import { Button, Loader } from 'oa-components'
import { useEffect, useState } from 'react'
import { useQuestionStore } from 'src/stores/Question/question.store'
import { Link } from 'react-router-dom'
import { Box, Card, Flex, Heading, Input } from 'theme-ui'

export const QuestionListing = () => {
  const store = useQuestionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [questionList, setQuestionList] = useState([])

  useEffect(() => {
    const fetchQuestions = async () => {
      const questions = await store.fetchQuestions()
      setQuestionList(questions || [])
      setIsLoading(false)
    }
    fetchQuestions()
  }, [isLoading])

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value
    store.updateSearchValue(searchValue)

    const questions = await store.searchQuestions(searchValue)
    setQuestionList(questions || [])

  }

  return (
    <Box sx={{ p: 7 }}>
      <Flex my={[18, 26]}>
        <Heading
          sx={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 5,
          }}
        >
          Ask your questions and help others out
        </Heading>
      </Flex>
      <Flex mb={3}>
        <Link to={'/questions/create'}>
          <Button variant={'primary'}>Ask a question</Button>
        </Link>
      </Flex>
      <Flex sx={{ width: ['100%', '100%', '200px'], mr: [0, 0, 2], mb: [3, 3, 0] }}>
        <Input
          variant="inputOutline"
          data-cy={`question-search-box`}
          placeholder={`Search for a Question`}
          onChange={handleSearch}
          value={store.searchValue}
        />
      </Flex>
      {isLoading ? (
        <Loader />
      ) : questionList.length ? (
        questionList.map((q: any, idx) => {
          const url = `/question/${encodeURIComponent(q.slug)}`
          return (
            <Card key={idx} mb={3} px={3} py={3}>
              <Link to={url} key={q._id}>
                <Heading
                  as="span"
                  mb={2}
                  sx={{
                    color: 'black',
                    fontSize: [3, 3, 4],
                  }}
                >
                  {q.title}
                </Heading>
              </Link>
            </Card>
          )
        })
      ) : (
        <Heading>No questions yet</Heading>
      )}
    </Box>
  )
}
