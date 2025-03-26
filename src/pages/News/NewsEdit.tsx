import { useEffect } from 'react'
import { useNavigate, useParams } from '@remix-run/react'
import { UserRole } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { NewsForm } from 'src/pages/News/Content/Common/NewsForm'

import type { News } from 'oa-shared'

interface IProps {
  news: News
}

export const NewsEdit = ({ news }: IProps) => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { userStore } = useCommonStores().stores

  useEffect(() => {
    if (
      news.author?.firebaseAuthId !== userStore.activeUser?._authID &&
      !userStore.activeUser?.userRoles?.includes(UserRole.ADMIN)
    ) {
      navigate(`/news/${slug}`)
      return
    }
  }, [slug, userStore.activeUser?.userName])

  return (
    <NewsForm data-testid="news-create-form" parentType="edit" news={news} />
  )
}
