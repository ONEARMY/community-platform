import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import { Box, Text } from 'theme-ui'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { WORKSPACE_TYPES } from 'src/mocks/user_pp.mock'
import { CustomRadioField } from './Fields/CustomRadio.field'
import { required } from 'src/utils/validators'
import theme from 'src/themes/styled.theme'
import { Field } from 'react-final-form'

interface IState {
  isOpen?: boolean
}

export class WorkspaceSection extends React.Component<any, IState> {
  state = {
    isOpen: true,
  }

  render() {
    const { isOpen } = this.state
    return (
      <Field
        name="workspaceType"
        validate={required}
        validateFields={[]}
        render={({ input, meta }) => (
          <FlexSectionContainer>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Heading small>Workspace</Heading>
              <ArrowIsSectionOpen
                onClick={() => {
                  this.setState({ isOpen: !isOpen })
                }}
                isOpen={isOpen}
              />
            </Flex>
            <Box sx={{ display: isOpen ? 'block' : 'none' }}>
              <Text mt={4} mb={4}>
                What kind of Precious Plastic workspace do you run?
              </Text>
              <Flex sx={{ flexWrap: ['wrap', 'wrap', 'nowrap'] }}>
                {WORKSPACE_TYPES.map((workspace, index: number) => (
                  <CustomRadioField
                    data-cy={workspace.label}
                    key={index}
                    value={workspace.label}
                    name="workspaceType"
                    isSelected={workspace.label === input.value}
                    onChange={(v) => {
                      input.onChange(v)
                      input.onBlur()
                    }}
                    imageSrc={workspace.imageSrc}
                    textLabel={workspace.textLabel}
                    subText={workspace.subText}
                  />
                ))}
              </Flex>
              {meta.touched && meta.error && (
                <Text color={theme.colors.red}>
                  Please select your workspace type
                </Text>
              )}
            </Box>
          </FlexSectionContainer>
        )}
      />
    )
  }
}
