import { Box, Card, Flex, Text } from 'theme-ui'

import { headings } from './labels'

import type { IErrorsListSet } from './types'

interface IProps {
  client?: (IErrorsListSet | undefined)[] | undefined
  saving?: (string | undefined | null)[]
}

export const ErrorsContainer = ({ client, saving }: IProps) => {
  const hasClientErrors = client && client.length !== 0
  const hasSaveErrors =
    saving && saving.filter((error) => error != undefined).length !== 0

  if (!hasClientErrors && !hasSaveErrors) {
    return null
  }

  return (
    <Card
      data-cy="errors-container"
      sx={{
        display: 'flex',
        padding: 3,
        flexDirection: 'column',
        fontSize: 1,
        backgroundColor: 'red2',
        borderColor: 'red',
        gap: 2,
      }}
    >
      <Text sx={{ fontSize: 2, fontWeight: 'bold' }}>{headings.errors}</Text>
      {hasSaveErrors && (
        <ul style={{ padding: 0, margin: 0, listStylePosition: 'inside' }}>
          {saving.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      )}
      {hasClientErrors && <ErrorsListSet errorsListSet={client} />}
    </Card>
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
    <Flex sx={{ flexDirection: 'column' }}>
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
    </Flex>
  )
}
