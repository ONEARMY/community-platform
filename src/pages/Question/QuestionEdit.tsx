import { useEffect } from 'react'
import { useNavigate, useParams } from '@remix-run/react'
import { UserRole } from 'oa-shared'
import { QuestionForm } from 'src/pages/Question/Content/Common/QuestionForm'
import { useQuestionStore } from 'src/stores/Question/question.store'

import type { Question } from 'src/models/question.model'

type QuestionEdit = {
  question: Question
}

export const QuestionEdit = ({ question }: QuestionEdit) => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const store = useQuestionStore()

  useEffect(() => {
    if (
      question.author?.firebaseAuthId !== store.activeUser?._authID &&
      !store.activeUser?.userRoles?.includes(UserRole.ADMIN)
    ) {
      navigate(`/questions/${slug}`)
      return
    }
  }, [slug, store.activeUser?.userName])

  return (
    <QuestionForm
      data-testid="question-create-form"
      parentType="edit"
      question={question}
    />
  )
}
