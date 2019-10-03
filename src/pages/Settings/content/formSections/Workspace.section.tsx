import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { FlexSectionContainer } from './elements'
import { WORKSPACE_TYPES } from 'src/mocks/user_pp.mock'
import { CustomRadioField } from './Fields/CustomRadio.field'
import { WorkspaceType, IUserPP } from 'src/models/user_pp.models'

interface IProps {
  onInputChange: (inputValue: WorkspaceType) => void
  user: IUserPP
}
interface IState {
  checkedFocusValue?: string
}

export class WorkspaceSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      checkedFocusValue: this.props.user.workspaceType
        ? this.props.user.workspaceType
        : undefined,
    }
  }

  public onInputChange(value: WorkspaceType) {
    this.setState({ checkedFocusValue: value })
    this.props.onInputChange(value)
  }

  render() {
    const { user } = this.props
    return (
      <FlexSectionContainer>
        <Heading small>Workspace</Heading>
        <Box>
          <Text regular my={4}>
            What kind of Precious Plastic workspace do you run?
          </Text>
          <Flex wrap="nowrap">
            {WORKSPACE_TYPES.map((workspace, index: number) => (
              <CustomRadioField
                key={index}
                value={workspace.label}
                name="workspaceType"
                isSelected={this.state.checkedFocusValue === workspace.label}
                onChange={v => this.onInputChange(v as WorkspaceType)}
                imageSrc={workspace.imageSrc}
                textLabel={workspace.textLabel}
                subText={workspace.subText}
              />
            ))}
          </Flex>
        </Box>
      </FlexSectionContainer>
    )
  }
}
