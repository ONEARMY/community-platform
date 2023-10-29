import { useState, useEffect } from 'react'
import type { RouteComponentProps } from 'react-router'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { Box, Heading } from 'theme-ui'

type IProps = RouteComponentProps<{ slug: string }>

export const QuestionEdit = (props: IProps) => {
  const store = useQuestionStore()
  const [isLoading] = useState(true)

  useEffect(() => {
    const { slug } = props.match.params
    const fetchQuestions = async () => {
      const question = await store.fetchQuestionBySlug(slug)

      if (store.activeUser?.userRoles?.includes('admin')) {
        return
      }

      if (question?._createdBy !== store.activeUser?.userName) {
        props.history.push(`/question/${question.slug}`)
        return
      }
    }
    fetchQuestions()
  }, [isLoading])

  return (
    <Box sx={{ p: 7 }}>
      <Heading>Question Edit</Heading>
    </Box>
  )
}
