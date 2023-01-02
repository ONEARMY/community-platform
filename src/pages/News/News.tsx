/* eslint-disable @typescript-eslint/naming-convention */
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Box, Card, Heading, Image } from 'theme-ui'

export const News = () => {
  const [articles, setArticles] = useState([])

  const loadArticles = async () => {
    const res = await (
      await await fetch(
        'https://public-api.wordpress.com/rest/v1.1/sites/onearmynews.wordpress.com/posts',
      )
    ).json()
    setArticles(res.posts)
  }
  useEffect(() => {
    loadArticles()
  }, [])

  return (
    <>
      <Heading sx={{ textAlign: 'center', m: 2, my: 5 }}>News</Heading>
      <Box sx={{ maxWidth: '48em', mx: 'auto' }}>
        {articles.length &&
          articles.map((article: any, key) => {
            const htmlPart = article.content
            return (
              <Card key={key} sx={{ mb: 5 }}>
                <Image src={article.featured_image} />
                <Box sx={{ padding: 3 }}>
                  <Heading>{article.title}</Heading>
                  {format(new Date(article.date), 'DD-MM-YYYY')}
                  <Box sx={{ mt: 1 }}>
                    <div dangerouslySetInnerHTML={{ __html: htmlPart }}></div>
                  </Box>
                </Box>
              </Card>
            )
          })}
      </Box>
      {JSON.stringify(articles)};
    </>
  )
}
