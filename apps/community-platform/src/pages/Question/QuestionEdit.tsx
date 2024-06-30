import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from '@onearmy.apps/components'
import { UserRole } from '@onearmy.apps/shared'
import { toJS } from 'mobx'

import { logger } from '../../logger'
import { QuestionForm } from '../../pages/Question/Content/Common/QuestionForm'
import { useQuestionStore } from '../../stores/Question/question.store'

import type { IQuestionItem } from '../../models'

export const QuestionEdit = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const store = useQuestionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<Partial<IQuestionItem>>({})

  useEffect(() => {
    const fetchQuestion = async () => {
      logger.debug(`fetchQuestion`, slug)

      if (slug) {
        const questionDoc = await store.fetchQuestionBySlug(slug)
        logger.debug(`fetchQuestion.questionDoc`, questionDoc)

        if (questionDoc === null) {
          navigate('/questions')
        }

        if (
          questionDoc?._createdBy !== store.activeUser?.userName &&
          !store.activeUser?.userRoles?.includes(UserRole.ADMIN)
        ) {
          navigate(`/questions/${slug}`)
          return
        }

        setInitialValues(toJS(questionDoc || {}))
      }
      setIsLoading(false)
    }

    fetchQuestion()
  }, [slug])

  if (isLoading) {
    return <Loader />
  }

  return (
    <QuestionForm
      data-testid="question-create-form"
      parentType="edit"
      formValues={initialValues}
    />
  )
}
