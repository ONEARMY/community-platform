import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box, Image } from 'rebass'
import { HiddenInput, Label, FlexSectionContainer } from './elements'
import { InputField } from 'src/components/Form/Fields'

// assets
import CollectionBadge from 'src/assets/images/badges/pt-collection-point.jpg'
import MemberBadge from 'src/assets/images/badges/pt-member.jpg'
import MachineBadge from 'src/assets/images/badges/pt-machine-shop.jpg'
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.jpg'
import LocalComBadge from 'src/assets/images/badges/pt-local-community.jpg'
import { Link } from 'src/components/Links'
import { Button } from 'src/components/Button'
import { ProfileType } from 'src/models/user.models'

interface IProps {
  onInputChange: (inputValue: ProfileType) => void
}
interface IState {
  checkedFocusValue?: string
}

export class FocusSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  public onInputChange(value: ProfileType) {
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
            <Label
              htmlFor="pt-workspace"
              className={
                this.state.checkedFocusValue === 'pt-workspace'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="pt-workspace"
                value="pt-workspace"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'pt-workspace'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={WorkspaceBadge} />
              <Text px={1} my={1} txtcenter small>
                I run a workspace
              </Text>
            </Label>
            <Label
              htmlFor="pt-community"
              className={
                this.state.checkedFocusValue === 'pt-community'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="pt-community"
                value="pt-community"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'pt-community'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={LocalComBadge} />
              <Text px={1} my={1} txtcenter small>
                I run a local community
              </Text>
            </Label>
            <Label
              htmlFor="pt-collection"
              className={
                this.state.checkedFocusValue === 'pt-collection'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="pt-collection"
                value="pt-collection"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'pt-collection'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={CollectionBadge} />
              <Text px={1} my={1} txtcenter small>
                I collect & sort plastic
              </Text>
            </Label>
            <Label
              htmlFor="pt-machine"
              className={
                this.state.checkedFocusValue === 'pt-machine'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="pt-machine"
                value="pt-machine"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'pt-machine'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={MachineBadge} />
              <Text px={1} my={1} txtcenter small>
                I build machines
              </Text>
            </Label>
            <Label
              htmlFor="pt-member"
              className={
                this.state.checkedFocusValue === 'pt-member'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="pt-member"
                value="pt-member"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'pt-member'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={MemberBadge} />
              <Text px={1} my={1} txtcenter small>
                I am a member
              </Text>
            </Label>
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
