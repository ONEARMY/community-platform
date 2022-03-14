import * as admin from 'firebase-admin'
import { NextSeo } from 'next-seo'

export async function getServerSideProps(context) {
  const FIREBASE_CONFIG = process.env.FIREBASE_CONFIG
    ? JSON.parse(process.env.FIREBASE_CONFIG)
    : {
        databaseURL: '',
        projectId: '',
      }

  const app = admin.initializeApp(
    {
      projectId: FIREBASE_CONFIG.projectId,
    },
    `${Math.floor(Math.random() * 10000)}`,
  )

  console.log({ app })

  const db = admin.firestore()

  const collection = db.collection('v3_howtos')

  const queryResult = await collection
    .where('slug', '==', context.params.slug)
    .get()

  let article

  queryResult.forEach(doc => {
    // doc.data() is never undefined for query doc snapshots
    ;(article = doc.data()),
      console.log(`Results of query:`, doc.id, ' => ', doc.data())
  })

  return {
    props: {
      article,
      slug: context.params.slug,
    },
  }
}

export default function HowtoArticle({ slug, article }) {
  const { title, description } = article
  const seoTitle = title + ' | Precious Plastic Community'
  return (
    <>
      <NextSeo
        title={seoTitle}
        description={description}
        openGraph={{
          type: 'website',
          url: 'https://www.example.com/page',
          title: seoTitle,
          description,
          images: [
            {
              url: article.cover_image.downloadUrl,
              width: 800,
              height: 600,
              alt: seoTitle,
            },
          ],
        }}
      />
      <div id="HowtoArticle">
        <pre>{article.slug}</pre>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <ul>
          <li>{article.steps.length} steps</li>
          <li>{article.time}</li>
          <li>{article.difficulty_level}</li>
        </ul>
        <footer>Published {Date.now()}</footer>
        <hr />
        Article
        {JSON.stringify(article)}
        <div>
          <div>
            You're done.
            <br />
            Nice one!
          </div>
          <div>
            <a href="/">Back</a>
          </div>
        </div>
      </div>
    </>
  )
}
