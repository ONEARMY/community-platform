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
              htmlFor="shredder"
              className={
                this.state.checkedFocusValue === 'shredder'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="shredder"
                value="shredder"
                name="workspaceType"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'shredder'}
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
              htmlFor="sheetpress"
              className={
                this.state.checkedFocusValue === 'sheetpress'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="sheetpress"
                value="sheetpress"
                name="workspaceType"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'sheetpress'}
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
              htmlFor="extrusion"
              className={
                this.state.checkedFocusValue === 'extrusion'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="extrusion"
                value="extrusion"
                name="workspaceType"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'extrusion'}
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
              htmlFor="injection"
              className={
                this.state.checkedFocusValue === 'injection'
                  ? 'selected'
                  : undefined
              }
            >
              <HiddenInput
                id="injection"
                value="injection"
                name="workspaceType"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'injection'}
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
              htmlFor="mix"
              className={
                this.state.checkedFocusValue === 'mix' ? 'selected' : undefined
              }
            >
              <HiddenInput
                id="mix"
                value="mix"
                name="workspaceType"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'mix'}
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
