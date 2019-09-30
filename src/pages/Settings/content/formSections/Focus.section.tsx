import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box, Image } from 'rebass'
import { HiddenInput, Label, FlexSectionContainer } from './elements'
import { InputField } from 'src/components/Form/Fields'
import { Link } from 'src/components/Links'
import { Button } from 'src/components/Button'
import { ProfileType } from 'src/models/user_pp.models'

// assets
import CollectionBadge from 'src/assets/images/badges/pt-collection-point.jpg'
import MemberBadge from 'src/assets/images/badges/pt-member.jpg'
import MachineBadge from 'src/assets/images/badges/pt-machine-shop.jpg'
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.jpg'
import LocalComBadge from 'src/assets/images/badges/pt-local-community.jpg'

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
              htmlFor="workspace"
              className={
                this.state.checkedFocusValue === 'workspace'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="workspace"
                value="workspace"
                name="profileType"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'workspace'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={WorkspaceBadge} />
              <Text px={1} my={1} txtcenter small>
                I run a workspace
              </Text>
            </Label>
            <Label
              htmlFor="community-builder"
              className={
                this.state.checkedFocusValue === 'community-builder'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="community-builder"
                value="community-builder"
                name="profileType"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'community-builder'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={LocalComBadge} />
              <Text px={1} my={1} txtcenter small>
                I run a local community
              </Text>
            </Label>
            <Label
              htmlFor="collection-point"
              className={
                this.state.checkedFocusValue === 'collection-point'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="collection-point"
                value="collection-point"
                name="profileType"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'collection-point'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={CollectionBadge} />
              <Text px={1} my={1} txtcenter small>
                I collect & sort plastic
              </Text>
            </Label>
            <Label
              htmlFor="machine-builder"
              className={
                this.state.checkedFocusValue === 'machine-builder'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="machine-builder"
                value="machine-builder"
                name="profileType"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'machine-builder'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={MachineBadge} />
              <Text px={1} my={1} txtcenter small>
                I build machines
              </Text>
            </Label>
            <Label
              htmlFor="member"
              className={
                this.state.checkedFocusValue === 'member'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="member"
                value="member"
                name="profileType"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'member'}
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
