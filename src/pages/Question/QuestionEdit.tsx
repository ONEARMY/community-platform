import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@remix-run/react'
import { toJS } from 'mobx'
import { Loader } from 'oa-components'
import { UserRole } from 'oa-shared'
import { logger } from 'src/logger'
import { QuestionForm } from 'src/pages/Question/Content/Common/QuestionForm'
import { useQuestionStore } from 'src/stores/Question/question.store'

import type { IQuestion } from 'oa-shared'

export const QuestionEdit = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const store = useQuestionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<Partial<IQuestion.Item>>(
    {},
  )

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

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <QuestionForm
          data-testid="question-create-form"
          parentType="edit"
          formValues={initialValues}
        />
      )}
    </>
  )
}
