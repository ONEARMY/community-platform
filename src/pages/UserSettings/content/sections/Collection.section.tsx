import * as React from 'react'
import { FieldArray } from 'react-final-form-arrays'
import { Button } from 'oa-components'
import Hdpe from 'src/assets/images/plastic-types/hdpe.svg'
import Ldpe from 'src/assets/images/plastic-types/ldpe.svg'
import Other from 'src/assets/images/plastic-types/other.svg'
import Pet from 'src/assets/images/plastic-types/pet.svg'
import PP from 'src/assets/images/plastic-types/pp.svg'
import PS from 'src/assets/images/plastic-types/ps.svg'
import Pvc from 'src/assets/images/plastic-types/pvc.svg'
import { fields, headings } from 'src/pages/UserSettings/labels'
import { Flex, Grid, Heading, Text } from 'theme-ui'

import { FlexSectionContainer } from '../elements'
import { CustomCheckbox } from '../fields/CustomCheckbox.field'
import { OpeningHoursPicker } from '../fields/OpeningHoursPicker.field'

import type { IPlasticType } from 'oa-shared'
import type { IUser } from 'src/models'

interface IProps {
  formValues: IUser
  required: boolean
}

export const CollectionSection = (props: IProps) => {
  const { required } = props
  const { description, title } = fields.openingHours

  return (
    <FlexSectionContainer>
      <Flex
        data-testid="CollectionSection"
        sx={{ justifyContent: 'space-between' }}
      >
        <Heading as="h2">{headings.collection}</Heading>
      </Flex>
      <Flex sx={{ gap: 4, flexDirection: 'column' }}>
        <Flex sx={{ gap: 2, flexDirection: 'column' }}>
          <Text>{`${title} *`}</Text>
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
                {fields.length && fields.length < 7 && (
                  <Button
                    type="button"
                    data-cy="add-opening-time"
                    variant="outline"
                    onClick={() => {
                      fields.push({
                        day: '',
                        openFrom: '',
                        openTo: '',
                      })
                    }}
                    sx={{
                      alignSelf: 'flex-start',
                    }}
                  >
                    {description}
                  </Button>
                )}
              </>
            )}
          </FieldArray>
        </Flex>
        <Flex sx={{ gap: 2, flexDirection: 'column' }}>
          <Text>{`${fields.plastic.title}`} *</Text>
          {required && (
            <Text sx={{ fontSize: 1, color: 'error' }}>
              {fields.plastic.description}
            </Text>
          )}
          <Grid columns={['repeat(auto-fill, minmax(100px, 1fr))']} gap={2}>
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
        </Flex>
      </Flex>
    </FlexSectionContainer>
  )
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
