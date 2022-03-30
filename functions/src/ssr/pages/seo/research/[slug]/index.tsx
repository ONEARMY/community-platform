import * as admin from 'firebase-admin'
import { NextSeo } from 'next-seo'
import { Button } from 'oa-components'

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

  const db = admin.firestore()

  const collection = db.collection('research_rev20201020')

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
  if (!article) {
    return <>Research: Not found</>
  }

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
          images: [],
        }}
      />
      <div id="HowtoArticle">
        <Button>Back</Button>
        
        <h1>{title}</h1>
        <p>{description}</p>

        <pre>
          {JSON.stringify(article)}
        </pre>
      </div>
    </>
  )
}
