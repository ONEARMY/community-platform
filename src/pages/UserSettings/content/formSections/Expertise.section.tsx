import * as React from 'react'
import { Flex, Heading, Box, Text } from 'theme-ui'
import { FieldArray } from 'react-final-form-arrays'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles

import { CustomCheckbox } from './Fields/CustomCheckbox.field'
import { FlexSectionContainer } from './elements'
import { headings, fields } from 'src/pages/UserSettings/labels'

import type { IMAchineBuilderXp } from 'src/models'

interface IProps {
  required: boolean
}

const MACHINE_BUILDER_XP: IMAchineBuilderXp[] = [
  {
    label: 'electronics',
  },
  {
    label: 'machining',
  },
  {
    label: 'welding',
  },
  {
    label: 'assembling',
  },
  {
    label: 'mould-making',
  },
]

export class ExpertiseSection extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    const { required } = this.props
    const { description, title } = fields.expertise

    return (
      <FlexSectionContainer>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading variant="small">{headings.expertise}</Heading>
        </Flex>
        <Box>
          <Text mt={4} mb={4}>
            {`${title} *`}
          </Text>
          <Flex sx={{ flexWrap: ['wrap', 'wrap', 'nowrap'] }}>
            <FieldArray name="machineBuilderXp">
              {({ fields }) => (
                <>
                  {MACHINE_BUILDER_XP.map((xp, index: number) => (
                    <CustomCheckbox
                      data-cy={xp.label}
                      key={index}
                      value={xp.label}
                      index={index}
                      isSelected={
                        fields.value ? fields.value.includes(xp.label) : false
                      }
                      onChange={() => {
                        if (fields.value && fields.value.length !== 0) {
                          if (fields.value.includes(xp.label)) {
                            // eslint-disable-next-line
                            fields.value.map((value, selectedValIndex) => {
                              if (value === xp.label) {
                                fields.remove(selectedValIndex)
                              }
                            })
                          } else {
                            fields.push(xp.label)
                          }
                        } else {
                          fields.push(xp.label)
                        }
                      }}
                      btnLabel={xp.label}
                    />
                  ))}
                </>
              )}
            </FieldArray>
          </Flex>
          {required && (
            <Text
              color={theme.colors.error}
              sx={{
                fontSize: 0.5,
                marginLeft: 1,
                marginRight: 1,
              }}
            >
              {description}
            </Text>
          )}
        </Box>
      </FlexSectionContainer>
    )
  }
}
