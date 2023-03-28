import * as React from 'react'
import type { IUserPP } from 'src/models/userPreciousPlastic.models'
import type { IPlasticType } from 'src/models'

import { Flex, Heading, Box, Text, Grid } from 'theme-ui'
import { FlexSectionContainer } from './elements'
import { OpeningHoursPicker } from './Fields/OpeningHoursPicker.field'

import Pet from 'src/assets/images/plastic-types/pet.svg'
import PP from 'src/assets/images/plastic-types/pp.svg'
import PS from 'src/assets/images/plastic-types/ps.svg'
import Hdpe from 'src/assets/images/plastic-types/hdpe.svg'
import Ldpe from 'src/assets/images/plastic-types/ldpe.svg'
import Other from 'src/assets/images/plastic-types/other.svg'
import Pvc from 'src/assets/images/plastic-types/pvc.svg'

import { FieldArray } from 'react-final-form-arrays'
import { Button } from 'oa-components'
import { CustomCheckbox } from './Fields/CustomCheckbox.field'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles

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
          <Box>
            <Text mt={4} mb={4}>
              Plastic types accepted *
            </Text>
            <Grid
              columns={['repeat(auto-fill, minmax(100px, 1fr))']}
              gap={2}
              sx={{ my: 2 }}
            >
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
            </Grid>
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
        </Box>
      </FlexSectionContainer>
    )
  }
}

const PLASTIC_TYPES: IPlasticType[] = [
  {
    label: 'pet',
    number: '1',
    imageSrc: Pet,
  },
  {
    label: 'hdpe',
    number: '2',
    imageSrc: Hdpe,
  },
  {
    label: 'pvc',
    number: '3',
    imageSrc: Pvc,
  },
  {
    label: 'ldpe',
    number: '4',
    imageSrc: Ldpe,
  },
  {
    label: 'pp',
    number: '5',
    imageSrc: PP,
  },
  {
    label: 'ps',
    number: '6',
    imageSrc: PS,
  },
  {
    label: 'other',
    number: '7',
    imageSrc: Other,
  },
]
