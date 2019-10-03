import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box, Image } from 'rebass'
import { FlexSectionContainer } from './elements'
import { OpeningHoursPicker } from './OpeningHoursPicker.field'
import { FieldArray } from 'react-final-form-arrays'
import { Button } from 'src/components/Button'
import { CustomCheckbox } from './Fields/CustomCheckbox.field'
import { PLASTIC_TYPES } from 'src/mocks/user_pp.mock'

interface IProps {
  onInputChange: (inputValue: string) => void
}

interface IState {}

export class CollectionSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }

  render() {
    return (
      <FlexSectionContainer>
        <Heading small>Collection</Heading>
        <Box>
          <Flex wrap={'nowrap'} alignItems={'center'} width={1}>
            <Text regular my={4}>
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
          <Text regular my={4}>
            Plastic types accepted *
          </Text>
          <Flex wrap="nowrap">
            <FieldArray name="collectedPlasticTypes">
              {({ fields }) => (
                <>
                  {PLASTIC_TYPES.map((plastic, index: number) => (
                    <CustomCheckbox
                      key={index}
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
        </Box>
      </FlexSectionContainer>
    )
  }
}
