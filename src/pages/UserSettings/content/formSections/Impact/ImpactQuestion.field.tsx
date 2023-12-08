import { Box, Flex, Label, Text } from 'theme-ui'
import { FieldInput, Icon } from 'oa-components'
import { Field } from 'react-final-form'

import type { IImpactQuestion } from './impactQuestions'

interface Props {
  id: string
  field: IImpactQuestion
}

export const ImpactQuestionField = ({ id, field }: Props) => {
  const initialValue =
    typeof field.isVisible === 'boolean' ? field.isVisible : true

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Label htmlFor={`${field.label}.value`} sx={{ marginBottom: 1 }}>
        {field.description}
      </Label>
      <Flex
        sx={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Flex
          sx={{
            alignItems: 'center',
            alignSelf: 'flex-start',
            flexDirection: 'row',
            gap: 2,
          }}
        >
          {field.prefix && (
            <Box>
              <Text>{field.prefix}</Text>
            </Box>
          )}

          <Box>
            <Field
              component={FieldInput}
              data-cy={`${id}-field-${field.label}-value`}
              name={`${field.label}.value`}
              sx={{ background: 'white' }}
              type="number"
            />
          </Box>

          {field.suffix && (
            <Box>
              <Text>{field.suffix}</Text>
            </Box>
          )}

          <Box>
            <Text>{field.label}</Text>
          </Box>
        </Flex>

        <Flex sx={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
          <Icon glyph="show" size={24} />
          <Field
            component="input"
            data-cy={`${id}-field-${field.label}-isVisible`}
            initialValue={initialValue}
            name={`${field.label}.isVisible`}
            type="checkbox"
          />
        </Flex>
      </Flex>
    </Box>
  )
}
