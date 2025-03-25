import { NewsForm } from 'src/pages/News/Content/Common/NewsForm'

export const NewsCreate = (props) => {
  return (
    <NewsForm data-testid="news-create-form" parentType="create" {...props} />
  )
}
