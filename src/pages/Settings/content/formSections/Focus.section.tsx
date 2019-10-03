import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { FlexSectionContainer } from './elements'
import { Link } from 'src/components/Links'
import { Button } from 'src/components/Button'
import { ProfileTypeLabel, IUserPP } from 'src/models/user_pp.models'
import { PROFILE_TYPES } from 'src/mocks/user_pp.mock'
import { CustomRadioField } from './Fields/CustomRadio.field'

interface IProps {
  onInputChange: (inputValue: ProfileTypeLabel) => void
  user: IUserPP
}
interface IState {
  checkedFocusValue?: string
}

export class FocusSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      checkedFocusValue: this.props.user.profileType
        ? this.props.user.profileType
        : undefined,
    }
  }

  public onInputChange(value: ProfileTypeLabel) {
    this.setState({ checkedFocusValue: value })
    this.props.onInputChange(value)
  }

  render() {
    return (
      <FlexSectionContainer>
        <Heading small>Focus</Heading>
        <Box>
          <Text regular my={4}>
            What is your main Precious Plastic activity?
          </Text>
          <Flex wrap="nowrap">
            {PROFILE_TYPES.map((profile, index: number) => (
              <CustomRadioField
                key={index}
                value={profile.label}
                name="profileType"
                isSelected={this.state.checkedFocusValue === profile.label}
                onChange={v => this.onInputChange(v as ProfileTypeLabel)}
                imageSrc={profile.imageSrc}
                textLabel={profile.textLabel}
              />
            ))}
          </Flex>
          <Flex flexWrap="wrap" alignItems="center" mt={4}>
            <Text>Not sure about your focus ?</Text>
            <Link to={'/academy'}>
              <Button ml={2} variant="outline">
                Go to starter kits
              </Button>
            </Link>
          </Flex>
        </Box>
      </FlexSectionContainer>
    )
  }
}
