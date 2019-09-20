import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { RadioInputWImg, Label, ImgOp } from './elements'
import { InputField } from 'src/components/Form/Fields'

// assets
import CollectionBadge from 'src/assets/images/badges/pt-collection-point.jpg'
import MemberBadge from 'src/assets/images/badges/pt-member.jpg'
import MachineBadge from 'src/assets/images/badges/pt-machine-shop.jpg'
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.jpg'
import LocalComBadge from 'src/assets/images/badges/pt-local-community.jpg'

interface IProps {
  onInputChange: (inputValue: string) => void
}
interface IState {
  checkedFocusValue?: string
}

export class FocusSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  public onInputChange(value: string) {
    this.setState({ checkedFocusValue: value })
    this.props.onInputChange(value)
  }

  render() {
    return (
      <Flex
        card
        mediumRadius
        bg={'white'}
        mt={5}
        flexWrap="wrap"
        flexDirection="column"
      >
        <Heading small p={4}>
          Focus
        </Heading>
        <Box px={4}>
          <Text regular my={4}>
            What is your main Precious Plastic activity?
          </Text>
          <Flex wrap="nowrap">
            <Label>
              <RadioInputWImg
                id="pt-workspace"
                value="pt-workspace"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'pt-workspace'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={WorkspaceBadge} />
              <Text my={1} txtcenter small>
                I run a workspace
              </Text>
            </Label>
            <Label htmlFor="pt-community">
              <RadioInputWImg
                id="pt-community"
                value="pt-community"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'pt-community'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={LocalComBadge} />
              <Text my={1} txtcenter small>
                I run a local community
              </Text>
            </Label>
            <Label htmlFor="pt-collection">
              <RadioInputWImg
                id="pt-collection"
                value="pt-collection"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'pt-collection'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={CollectionBadge} />
              <Text my={1} txtcenter small>
                I collect & sort plastic
              </Text>
            </Label>
            <Label htmlFor="pt-machine">
              <RadioInputWImg
                id="pt-machine"
                value="pt-machine"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'pt-machine'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={MachineBadge} />
              <Text my={1} txtcenter small>
                I build machines
              </Text>
            </Label>
            <Label htmlFor="pt-member">
              <RadioInputWImg
                id="pt-member"
                value="pt-member"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'pt-member'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={MemberBadge} />
              <Text my={1} txtcenter small>
                I am a member
              </Text>
            </Label>
          </Flex>
        </Box>
      </Flex>
    )
  }
}
