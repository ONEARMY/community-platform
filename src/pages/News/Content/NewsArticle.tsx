import { format } from 'date-fns'
import { Loader } from 'oa-components'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Box, Card, Heading } from 'theme-ui'

export const NewsArticle = () => {
  const params = useParams() as any
  const [article, setArticle] = useState<any>(null)
  const [isLoading, setLoading] = useState(true)
  console.log({ params })

  const loadArticle = async () => {
    const res = await (
      await fetch(
        `https://public-api.wordpress.com/rest/v1.1/sites/onearmynews.wordpress.com/posts/slug:${params.slug}`,
      )
    ).json()
    setArticle(res)
    setLoading(false)
  }
  useEffect(() => {
    loadArticle()
  }, [])
  return (
    <Box sx={{ maxWidth: '48em', mx: 'auto', my: 5 }}>
      {isLoading && <Loader />}
      {article && (
        <Card>
          <Box sx={{ p: 3 }}>
            <Heading>{article.title}</Heading>
            {format(new Date(article.date), 'DD-MM-YYYY')}
            <Box sx={{ mt: 1 }}>
              <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
            </Box>
          </Box>
        </Card>
      )}
      {JSON.stringify(article)}
    </Box>
  )
}
