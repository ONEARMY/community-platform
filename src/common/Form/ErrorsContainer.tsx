import { Box, Card, Text } from 'theme-ui'

import { headings } from './labels'

interface IProps {
  errors: string[]
}

export const ErrorsContainer = ({ errors }: IProps) => {
  if (!errors || errors.length === 0) {
    return null
  }

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
        <ul style={{ padding: 0, margin: 0, listStylePosition: 'inside' }}>
          {errors.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </Card>
    </Box>
  )
}
