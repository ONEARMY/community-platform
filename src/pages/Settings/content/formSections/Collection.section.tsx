import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'theme-ui'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { OpeningHoursPicker } from './Fields/OpeningHoursPicker.field'

import { FieldArray } from 'react-final-form-arrays'
import { Button } from 'oa-components'
import { CustomCheckbox } from './Fields/CustomCheckbox.field'
import { PLASTIC_TYPES } from 'src/mocks/user_pp.mock'
import { IUserPP } from 'src/models/user_pp.models'

interface IProps {
  formValues: IUserPP
  required: boolean
}

interface IState {
  isOpen: boolean
}

export class CollectionSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      isOpen: true,
    }
  }

  render() {
    const { isOpen } = this.state
    const { required } = this.props
    return (
      <FlexSectionContainer>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading small>Collection</Heading>
          <ArrowIsSectionOpen
            onClick={() => {
              this.setState({ isOpen: !isOpen })
            }}
            isOpen={isOpen}
          />
        </Flex>
        <Box sx={{ display: isOpen ? 'block' : 'none' }}>
          <Flex sx={{ wrap: 'nowrap', alignItems: 'center', width: '100%' }}>
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
          <Text regular my={4}>
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
            <Text color="red">Choose at least one plastic type </Text>
          )}
        </Box>
      </FlexSectionContainer>
    )
  }
}
