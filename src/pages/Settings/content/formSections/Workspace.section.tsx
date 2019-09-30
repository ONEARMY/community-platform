import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box, Image } from 'rebass'
import { HiddenInput, Label, FlexSectionContainer } from './elements'
import { InputField } from 'src/components/Form/Fields'

// assets
import Extrusion from 'src/assets/images/workspace-focus/extrusion.jpg'
import Injection from 'src/assets/images/workspace-focus/injection.jpg'
import Mix from 'src/assets/images/workspace-focus/mix.jpg'
import Sheetpress from 'src/assets/images/workspace-focus/sheetpress.jpg'
import Shredder from 'src/assets/images/workspace-focus/shredder.jpg'

interface IProps {
  onInputChange: (inputValue: string) => void
}
interface IState {
  checkedFocusValue?: string
}

export class WorkspaceSection extends React.Component<IProps, IState> {
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
      <FlexSectionContainer>
        <Heading small>Workspace</Heading>
        <Box>
          <Text regular my={4}>
            What kind of Precious Plastic workspace do you run?
          </Text>
          <Flex wrap="nowrap">
            <Label
              htmlFor="wt-shredder"
              className={
                this.state.checkedFocusValue === 'wt-shredder'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="wt-shredder"
                value="wt-shredder"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'wt-shredder'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={Shredder} />
              <Text my={1} txtcenter medium>
                Shredder
              </Text>
              <Flex alignItems="center" flexWrap="nowrap">
                <Text my={1} txtcenter small>
                  Shredding plastic waste into flakes
                </Text>
              </Flex>
            </Label>
            <Label
              htmlFor="wt-sheetpress"
              className={
                this.state.checkedFocusValue === 'wt-sheetpress'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="wt-sheetpress"
                value="wt-sheetpress"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'wt-sheetpress'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={Sheetpress} />
              <Text my={1} txtcenter medium>
                Sheetpress
              </Text>
              <Flex alignItems="center">
                <Text my={1} txtcenter small>
                  Making recycled plastic sheets
                </Text>
              </Flex>
            </Label>
            <Label
              htmlFor="wt-extrusion"
              className={
                this.state.checkedFocusValue === 'wt-extrusion'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="wt-extrusion"
                value="wt-extrusion"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'wt-extrusion'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={Extrusion} />
              <Text my={1} txtcenter medium>
                Extrusion
              </Text>
              <Text my={1} txtcenter small>
                Extruding plastic into beams or products
              </Text>
            </Label>
            <Label
              htmlFor="wt-injection"
              className={
                this.state.checkedFocusValue === 'wt-injection'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="wt-injection"
                value="wt-injection"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'wt-injection'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={Injection} />
              <Text my={1} txtcenter medium>
                Injection
              </Text>
              <Text my={1} txtcenter small>
                Making small productions of goods
              </Text>
            </Label>
            <Label
              htmlFor="wt-mix"
              className={
                this.state.checkedFocusValue === 'wt-mix'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="wt-mix"
                value="wt-mix"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'wt-mix'}
                onChange={v => this.onInputChange(v.target.value)}
              />
              <Image px={3} src={Mix} />
              <Text my={1} txtcenter medium>
                Mix
              </Text>
              <Text my={1} txtcenter small>
                Running a workspace with multiple machines and goals
              </Text>
            </Label>
          </Flex>
        </Box>
      </FlexSectionContainer>
    )
  }
}
