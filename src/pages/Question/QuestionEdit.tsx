import { useEffect } from 'react'
import { useNavigate, useParams } from '@remix-run/react'
import { UserRole } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { QuestionForm } from 'src/pages/Question/Content/Common/QuestionForm'

import type { Question } from 'src/models/question.model'

type QuestionEdit = {
  question: Question
}

export const QuestionEdit = ({ question }: QuestionEdit) => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { userStore } = useCommonStores().stores

  useEffect(() => {
    if (
      question.author?.username !== userStore.activeUser?.userName &&
      !userStore.activeUser?.userRoles?.includes(UserRole.ADMIN)
    ) {
      navigate(`/questions/${slug}`)
      return
    }
  }, [slug, userStore.activeUser?.userName])

  return (
    <QuestionForm
      data-testid="question-create-form"
      parentType="edit"
      question={question}
    />
  )
}
