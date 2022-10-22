import * as React from 'react'

import { Flex, Heading, Box, Text } from 'theme-ui'
import { FlexSectionContainer } from './elements'
import { OpeningHoursPicker } from './Fields/OpeningHoursPicker.field'

import { FieldArray } from 'react-final-form-arrays'
import { Button } from 'oa-components'
import { CustomCheckbox } from './Fields/CustomCheckbox.field'
import { PLASTIC_TYPES } from 'src/mocks/user_pp.mock'
import type { IUserPP } from 'src/models/user_pp.models'
import theme from 'src/themes/styled.theme'

interface IProps {
  formValues: IUserPP
  required: boolean
}

export class CollectionSection extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  render() {
    const { required } = this.props
    return (
      <FlexSectionContainer>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading variant="small">Collection</Heading>
        </Flex>
        <Box>
          <Flex sx={{ wrap: 'nowrap', alignItems: 'center', width: '100%' }}>
            <Text mt={4} mb={4}>
              Opening time *
            </Text>
          </Flex>
          <FieldArray name="openingHours">
            {({ fields }) => (
              <>
                {fields.map((name, index: number) => (
                  <OpeningHoursPicker
                    key={index}
                    openingHoursValues={name}
                    index={index}
                    onDelete={(fieldIndex: number) => {
                      fields.remove(fieldIndex)
                    }}
                  />
                ))}
                <Button
                  data-cy="add-opening-time"
                  my={2}
                  variant="outline"
                  onClick={() => {
                    fields.push({
                      day: '',
                      openFrom: '',
                      openTo: '',
                    })
                  }}
                >
                  add opening day
                </Button>
              </>
            )}
          </FieldArray>
          <Text mt={4} mb={4}>
            Plastic types accepted *
          </Text>
          <Flex sx={{ flexWrap: ['wrap', 'wrap', 'nowrap'] }} my="10px">
            <FieldArray name="collectedPlasticTypes">
              {({ fields }) => (
                <>
                  {PLASTIC_TYPES.map((plastic, index: number) => (
                    <CustomCheckbox
                      data-cy={`plastic-${plastic.label}`}
                      key={index}
                      fullWidth
                      value={plastic.label}
                      index={index}
                      isSelected={
                        fields.value
                          ? fields.value.includes(plastic.label)
                          : false
                      }
                      onChange={() => {
                        if (fields.value && fields.value.length !== 0) {
                          if (fields.value.includes(plastic.label)) {
                            // eslint-disable-next-line
                            fields.value.map((value, selectedValIndex) => {
                              if (value === plastic.label) {
                                fields.remove(selectedValIndex)
                              }
                            })
                          } else {
                            fields.push(plastic.label)
                          }
                        } else {
                          fields.push(plastic.label)
                        }
                      }}
                      imageSrc={plastic.imageSrc}
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
              Choose at least one plastic type{' '}
            </Text>
          )}
        </Box>
      </FlexSectionContainer>
    )
  }
}
