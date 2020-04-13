import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { WORKSPACE_TYPES } from 'src/mocks/user_pp.mock'
import { CustomRadioField } from './Fields/CustomRadio.field'
import { WorkspaceType, IUserPP } from 'src/models/user_pp.models'
import theme from 'src/themes/styled.theme'

interface IProps {
  onInputChange: (inputValue: WorkspaceType) => void
  formValues: IUserPP
  showSubmitErrors: boolean
  isSelected: boolean
}
interface IState {
  checkedFocusValue?: string
  isOpen?: boolean
}

export class WorkspaceSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      checkedFocusValue: this.props.formValues.workspaceType
        ? this.props.formValues.workspaceType
        : undefined,
      isOpen: true,
    }
  }

  public onInputChange(value: WorkspaceType) {
    this.setState({ checkedFocusValue: value })
    this.props.onInputChange(value)
  }

  render() {
    const { isOpen } = this.state
    const { showSubmitErrors, isSelected } = this.props
    return (
      <FlexSectionContainer>
        <Flex justifyContent="space-between">
          <Heading small>Workspace</Heading>
          <ArrowIsSectionOpen
            onClick={() => {
              this.setState({ isOpen: !isOpen })
            }}
            isOpen={isOpen}
          />
        </Flex>
        <Box sx={{ display: isOpen ? 'block' : 'none' }}>
          <Text regular my={4}>
            What kind of Precious Plastic workspace do you run?
          </Text>
          <Flex flexWrap={['wrap', 'wrap', 'nowrap']}>
            {WORKSPACE_TYPES.map((workspace, index: number) => (
              <CustomRadioField
                data-cy={workspace.label}
                key={index}
                value={workspace.label}
                name="workspaceType"
                isSelected={
                  this.state.checkedFocusValue === workspace.label && isSelected
                }
                onChange={v => this.onInputChange(v as WorkspaceType)}
                imageSrc={workspace.imageSrc}
                textLabel={workspace.textLabel}
                subText={workspace.subText}
              />
            ))}
          </Flex>
          {showSubmitErrors && (
            <Text color={theme.colors.red}>
              Please select your workspace type
            </Text>
          )}
        </Box>
      </FlexSectionContainer>
    )
  }
}
