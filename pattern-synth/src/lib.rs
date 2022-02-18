use async_std::task;
use futures::executor::block_on;
use node_bindgen::derive::node_bindgen;
use rand::Rng;
use texture_synthesis as ts;
use s3::bucket::Bucket;
use s3::creds::Credentials;

async fn simple_gen_async(uid: String, file_path: String, tile_size: i32,  size: i32) -> Result<(), ts::Error> {
    let texsynth = ts::Session::builder()
        //load a single example image
        .resize_input(ts::Dims {
            width: tile_size as u32,
            height: tile_size as u32,
        })
        .add_example(&file_path)
        .random_init(10)
        .seed(211)
        .output_size(ts::Dims::square(size as u32))
        .build()?;

    //generate an image
    let generated = texsynth.run(None);

    //save the image to the disk
    generated.save("public/result_".to_owned() + &uid + ".jpg")
}

#[node_bindgen]
async fn run_gen_single(uid: String, file_path: String, tile_size: i32, size: i32) -> String {
    let res = simple_gen_async(uid, file_path, tile_size, size).await;
    if res.is_ok() {
        return String::from("OK");
    } else {
        return String::from("ERR");
    }
}
