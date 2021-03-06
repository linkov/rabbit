import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import Post, { PostProps } from '../components/Post'
import UploadPage from "../components/Upload";

type Props = {
  feed: PostProps[]
}

const Blog : React.FC<Props> = props => {
  return (
    <Layout>
      <div className="page">
        <main>
            <UploadPage/>
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}



export default Blog
