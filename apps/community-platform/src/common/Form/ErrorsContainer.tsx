import { Box, Card, Text } from 'theme-ui'

import { headings } from './labels'

import type { IErrorsListSet } from './types'

interface IProps {
  errorsListSet: IErrorsListSet[]
  isVisible: boolean
}

export const ErrorsContainer = ({ errorsListSet, isVisible }: IProps) => {
  if (!isVisible || errorsListSet.length === 0) return null

  return (
    <Box paddingTop={2} data-cy="errors-container">
      <Card
        sx={{
          padding: 3,
          flexDirection: 'column',
          fontSize: 1,
          backgroundColor: 'red2',
          borderColor: 'red',
        }}
      >
        <Box paddingBottom={2}>
          <Text sx={{ fontSize: 2, fontWeight: 'bold', paddingBottom: 2 }}>
            {headings.errors}
          </Text>
        </Box>
        <ErrorsListSet errorsListSet={errorsListSet} />
      </Card>
    </Box>
  )
}

const ErrorsListSet = ({ errorsListSet }) => {
  return errorsListSet.map((errorsList, index) => {
    if (errorsList === undefined) return
    return <ErrorsList key={index} errorsList={errorsList} />
  })
}

const ErrorsList = ({ errorsList }) => {
  const { errors, title, keys, labels } = errorsList

  return (
    <Box paddingBottom={2}>
      {title && (
        <Box paddingBottom={1}>
          <Text>{title}</Text>
        </Box>
      )}
      <ul style={{ padding: 0, margin: 0, listStylePosition: 'inside' }}>
        {keys.map((key, index) => {
          return (
            <li key={index}>
              <strong>{labels[key].title}</strong>: {errors[key]}
            </li>
          )
        })}
      </ul>
    </Box>
  )
}
