import {PrismaClient} from '@prisma/client'
import cors from 'cors'
import express from 'express'
const path = require('path');
var cron = require('node-cron');
var fs = require('fs');
const fsx = require('fs-extra')
var uniqid = require('uniqid');
const fileUpload = require('express-fileupload');
const rustBackend = require('../../pattern-synth/dist');
const http = require('http');
const https = require('https');
const subdomain = require('express-subdomain');
const prisma = new PrismaClient()
const app = express()
var router = express.Router();
app.use(express.json())
app.use(cors())
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));
app.use(express.static('public'))

cron.schedule('0 0 10 * * *', function() {
  console.log('---------------------');
  console.log('Running temp folder delete');
  fsx.removeSync(path.join(__dirname, '..', 'public'));

});

router.post('/upload4',  async (req, res) => {
  let sampleFile;
  let uploadPath:string;
  let uid = uniqid();


  console.log(req.query);
  console.log(path.join(__dirname, '..', '/public'))

  const {tile, output} = req.query;
  // @ts-ignore
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let hostname = req.headers.host;
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  // @ts-ignore
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/tmp/' + sampleFile.name;
  let displayPath = "/assets/result_" + uid + ".jpg"

  // Use the mv() method to place the file somewhere on your server
  // @ts-ignore
  sampleFile.mv(uploadPath, async function (err) {
    if (err)
      return res.status(500).send(err);

    rustBackend.runGenSingle(uid,uploadPath, parseInt(tile as string), parseInt(output as string)).then((val: any) => {
      console.log(val)
      console.log("displayPath: " + displayPath)

      fs.unlink(uploadPath, function (err: any) {
        if (err) throw err;
        console.log('File deleted!');
        res.json({path: displayPath})
      });



    })

  });
});

router.post('/upload', function(req, res) {
  console.log("REQ: ",req);
  console.log("RES:",res);


  // let sampleFile;
  // let uploadPath;
  //
  // if (!req.files || Object.keys(req.files).length === 0) {
  //   return res.status(400).send('No files were uploaded.');
  // }
  //
  // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  // sampleFile = req.files.sampleFile;
  // uploadPath = __dirname + '/somewhere/on/your/server/' + sampleFile.name;
  //
  // // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function(err) {
  //   if (err)
  //     return res.status(500).send(err);
  //
  //   res.send('File uploaded!');
  // });
});

router.get('/gen', async (req, res) => {
  const gen_res = await rustBackend.runGen2("test_256.jpg",1024).then((val: any) => {console.log(val)})
  res.json(gen_res)
})


router.get('/drafts', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: false },
    include: { author: true }
  })
  res.json(posts)
})

router.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true }
  })
  res.json(posts)
})

router.get('/filterPosts', async (req, res) => {
  const { searchString }: { searchString?: string } = req.query;
  const filteredPosts = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: searchString,
          },
        },
        {
          content: {
            contains: searchString,
          },
        },
      ],
    },
  })
  res.json(filteredPosts)
})

router.post(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  })
  res.json(result)
})

router.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(post)
})

router.get(`/post/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    include: { author: true }
  })
  res.json(post)
})

router.put('/publish/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  })
  res.json(post)
})

router.post(`/user`, async (req, res) => {
  const result = await prisma.user.create({
    data: {
      ...req.body,
    },
  })
  res.json(result)
})
app.use(router);
// const server = app.listen(3001, () =>
//   console.log(
//     '🚀 Server ready at: http://localhost:3001',
//   ),
// )    ssl_certificate /etc/letsencrypt/live/fvnction.link/fullchain.pem; # managed by Certbot
//     ssl_certificate_key /etc/letsencrypt/live/fvnction.link/privkey.pem; # managed by Certbot
//     include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
//     ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
// Listen both http & https ports
const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/fvnction.link/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/fvnction.link/fullchain.pem'),
}, app);


httpsServer.listen(3001, () => {
  console.log('HTTPS Server running on port 3001');
});