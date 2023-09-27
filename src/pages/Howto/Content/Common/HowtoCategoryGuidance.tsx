import { Alert, Text } from 'theme-ui'

import { guidance } from '../../labels'

import type { ICategory } from 'src/models/categories.model'

interface IProps {
  category: ICategory | undefined
  type: 'main' | 'files'
}

export const HowtoCategoryGuidance = ({ category, type }: IProps) => {
  if (!category) return null

  const label = category.label.toLowerCase()
  const labelExists = !!guidance[label] && !!guidance[label][type]

  return (
    <>
      {labelExists && (
        <Alert variant="info" marginY={2}>
          <Text
            dangerouslySetInnerHTML={{ __html: guidance[label][type] }}
            sx={{
              fontSize: 1,
              textAlign: 'left',
            }}
          />
        </Alert>
      )}
    </>
  )
}
