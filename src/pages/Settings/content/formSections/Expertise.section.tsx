import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { FlexSectionContainer } from './elements'
import { FieldArray } from 'react-final-form-arrays'
import { MACHINE_BUILDER_XP } from 'src/mocks/user_pp.mock'
import { CustomCheckbox } from './CustomCheckbox.field'

export class ExpertiseSection extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <FlexSectionContainer>
        <Heading small>Expertise</Heading>
        <Box>
          <Text regular my={4}>
            What are you specialised in ? *
          </Text>
          <Flex wrap="nowrap">
            <FieldArray name="machineBuilderXp">
              {({ fields }) => (
                <>
                  {MACHINE_BUILDER_XP.map((xp, index: number) => (
                    <CustomCheckbox
                      key={index}
                      value={xp.label}
                      index={index}
                      isSelected={
                        fields.value ? fields.value.includes(xp.label) : false
                      }
                      onChange={() => {
                        if (fields.value && fields.value.length !== 0) {
                          if (fields.value.includes(xp.label)) {
                            fields.value.map((value, selectedValIndex) => {
                              fields.remove(selectedValIndex - 1)
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
        </Box>
      </FlexSectionContainer>
    )
  }
}
