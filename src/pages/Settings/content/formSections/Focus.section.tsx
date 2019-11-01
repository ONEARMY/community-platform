import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { Link } from 'src/components/Links'
import { Button } from 'src/components/Button'
import { ProfileTypeLabel, IUserPP } from 'src/models/user_pp.models'
import { PROFILE_TYPES } from 'src/mocks/user_pp.mock'
import { CustomRadioField } from './Fields/CustomRadio.field'
import theme from 'src/themes/styled.theme'

interface IProps {
  onInputChange: (inputValue: ProfileTypeLabel) => void
  user: IUserPP
  showSubmitErrors: boolean
}
interface IState {
  checkedFocusValue?: string
  isOpen: boolean
}

export class FocusSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      checkedFocusValue: this.props.user.profileType
        ? this.props.user.profileType
        : undefined,
      isOpen: props.user && !props.user.profileType,
    }
  }

  public onInputChange(value: ProfileTypeLabel) {
    this.setState({ checkedFocusValue: value })
    this.props.onInputChange(value)
  }

  render() {
    const { isOpen, checkedFocusValue } = this.state
    const { showSubmitErrors } = this.props
    return (
      <FlexSectionContainer>
        <Flex justifyContent="space-between">
          <Heading small>Focus</Heading>
          <ArrowIsSectionOpen
            onClick={() => {
              this.setState({ isOpen: !isOpen })
            }}
            isOpen={isOpen}
          />
        </Flex>
        <Box sx={{ display: isOpen ? 'block' : 'none' }}>
          <Text regular my={4}>
            What is your main Precious Plastic activity?
          </Text>
          <Flex wrap="nowrap">
            {PROFILE_TYPES.map((profile, index: number) => (
              <CustomRadioField
                key={index}
                fullWidth
                value={profile.label}
                name="profileType"
                isSelected={checkedFocusValue === profile.label}
                onChange={v => this.onInputChange(v as ProfileTypeLabel)}
                required
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
          {showSubmitErrors && (
            <Text color={theme.colors.red}>Please select a focus</Text>
          )}
        </Box>
      </FlexSectionContainer>
    )
  }
}
