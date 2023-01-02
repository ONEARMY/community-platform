/* eslint-disable @typescript-eslint/naming-convention */
import { format } from 'date-fns'
import { InternalLink, Loader } from 'oa-components'
import { useEffect, useState } from 'react'
import { Box, Card, Heading, Image } from 'theme-ui'

export const NewsListing = () => {
  const [articles, setArticles] = useState([])
  const [isLoading, setLoading] = useState(true)

  const loadArticles = async () => {
    const res = await (
      await fetch(
        'https://public-api.wordpress.com/rest/v1.1/sites/onearmynews.wordpress.com/posts',
      )
    ).json()
    setArticles(res.posts)
    setLoading(false)
  }
  useEffect(() => {
    loadArticles()
  }, [])

  return (
    <>
      <Heading sx={{ textAlign: 'center', m: 2, my: 5 }}>News</Heading>
      <Box sx={{ maxWidth: '48em', mx: 'auto' }}>
        {isLoading && <Loader />}
        {!isLoading &&
          articles.length &&
          articles.map((article: any, key) => {
            const htmlPart = article.content
            return (
              <Card key={key} sx={{ mb: 5 }}>
                <Image src={article.featured_image} />
                <Box sx={{ padding: 3 }}>
                  <Heading>
                    <InternalLink to={`/news/${article.slug}`}>
                      {article.title}
                    </InternalLink>
                  </Heading>
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
