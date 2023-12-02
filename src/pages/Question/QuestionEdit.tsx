import { useState, useEffect } from 'react'
import type { RouteComponentProps } from 'react-router'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { Loader } from 'oa-components'
import { logger } from 'src/logger'
import { Box } from 'theme-ui'
import { toJS } from 'mobx'
import type { IQuestion } from 'src/models'
import { QuestionForm } from 'src/pages/Question/Content/Common/QuestionForm'

type IProps = RouteComponentProps<{ slug: string }>

export const QuestionEdit = (props: IProps) => {
  const store = useQuestionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<Partial<IQuestion.Item>>(
    {},
  )

  useEffect(() => {
    const { slug } = props.match.params
    const fetchQuestion = async () => {
      logger.debug(`fetchQuestion`, slug)

      const questionDoc = await store.fetchQuestionBySlug(slug)
      logger.debug(`fetchQuestion.questionDoc`, questionDoc)

      if (questionDoc === null) {
        props.history.push(`/questions`)
      }

      if (
        questionDoc?._createdBy !== store.activeUser?.userName &&
        !store.activeUser?.userRoles?.includes('admin')
      ) {
        props.history.push(`/question/${slug}`)
        return
      }

      setInitialValues(toJS(questionDoc || {}))
      setIsLoading(false)
    }

    fetchQuestion()
  }, [])

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <QuestionForm
          data-testid="question-create-form"
          parentType="edit"
          formValues={initialValues}
          {...props}
        ></QuestionForm>
      )}
    </>
  )
}
