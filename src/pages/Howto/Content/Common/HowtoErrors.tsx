import type { ValidationErrors } from 'final-form'
import { Box, Card, Text } from 'theme-ui'

import { headings, intro, steps } from '../../labels'

const stepKeys = (stepErrors) => {
  if (stepErrors === undefined) return []

  const emptyStepsList = new Array(stepErrors.length).fill([])
  const stepsWithErrors = emptyStepsList.map((_, index) =>
    Object.keys(stepErrors[index]),
  )
  const errors = stepsWithErrors.map((keys, index) => {
    const errors = stepErrors[index]
    const labels = steps
    const title = `${steps.heading.title} ${index + 1}`

    if (keys.length > 0) return { errors, title, keys, labels }
  })

  return errors.filter((error) => error !== undefined)
}

const introKeys = (errors) => {
  const labels = intro
  const title = intro.heading
  const keys = Object.keys(errors).filter((key) => intro[key])

  return { errors, title, keys, labels }
}

interface IProps {
  errors: ValidationErrors
  isVisible: boolean
}

export const HowtoErrors = ({ errors, isVisible }: IProps) => {
  if (!isVisible || errors === undefined || errors.length === 0) return null

  const errorsListSet = [introKeys(errors), ...stepKeys(errors.steps)]

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
    return <ErrorsList key={index} errorsList={errorsList} />
  })
}

const ErrorsList = ({ errorsList }) => {
  const { errors, title, keys, labels } = errorsList

  return (
    <Box paddingBottom={2}>
      <Box paddingBottom={1}>
        <Text>{title}</Text>
      </Box>
      <ul style={{ padding: 0, margin: 0, listStylePosition: 'inside' }}>
        <ErrorsListItems errors={errors} labels={labels} keys={keys} />
      </ul>
    </Box>
  )
}

const ErrorsListItems = ({ errors, labels, keys }) => {
  return keys.map((key, index) => {
    return (
      <li key={index}>
        <strong>{labels[key].title}</strong>: {errors[key]}
      </li>
    )
  })
}
