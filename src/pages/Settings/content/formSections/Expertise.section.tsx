import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { Label, HiddenInput, FlexSectionContainer } from './elements'
import { InputField } from 'src/components/Form/Fields'
import theme from 'src/themes/styled.theme'

interface IProps {}
interface IState {
  checkedFocusValue?: string
}

const CustomSelectBtn = props => (
  <Box
    sx={{
      margin: '10px',
    }}
  >
    {props.children}
  </Box>
)

export class ExpertiseSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
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
            <Label
              htmlFor="exp-electronics"
              className={
                this.state.checkedFocusValue === 'exp-electronics'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="exp-electronics"
                value="exp-electronics"
                name="title"
                type="checkbox"
                component={InputField}
                checked={this.state.checkedFocusValue === 'exp-electronics'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <CustomSelectBtn>
                <Text medium>Electronics</Text>
              </CustomSelectBtn>
            </Label>
            <Label htmlFor="exp-machining">
              <HiddenInput
                id="exp-machining"
                value="exp-machining"
                name="title"
                type="checkbox"
                component={InputField}
                checked={this.state.checkedFocusValue === 'exp-machining'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <CustomSelectBtn>
                <Text medium>Machining</Text>
              </CustomSelectBtn>
            </Label>
            <Label htmlFor="exp-welding">
              <HiddenInput
                id="exp-welding"
                value="exp-welding"
                name="title"
                type="checkbox"
                component={InputField}
                checked={this.state.checkedFocusValue === 'exp-welding'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <CustomSelectBtn>
                <Text medium>Welding</Text>
              </CustomSelectBtn>
            </Label>
            <Label htmlFor="exp-assembling">
              <HiddenInput
                id="exp-assembling"
                value="exp-assembling"
                name="title"
                type="checkbox"
                component={InputField}
                checked={this.state.checkedFocusValue === 'exp-assembling'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <CustomSelectBtn>
                <Text medium>Assembling</Text>
              </CustomSelectBtn>
            </Label>
            <Label htmlFor="exp-mould-making">
              <HiddenInput
                id="exp-mould-making"
                value="exp-mould-making"
                name="title"
                type="checkbox"
                component={InputField}
                checked={this.state.checkedFocusValue === 'exp-mould-making'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <CustomSelectBtn>
                <Text medium>Mould-making</Text>
              </CustomSelectBtn>
            </Label>
          </Flex>
        </Box>
      </FlexSectionContainer>
    )
  }
}
