import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { RadioInputWImg, Label, ImgOp } from './elements'
import { InputField } from 'src/components/Form/Fields'

// assets
import Extrusion from 'src/assets/images/workspace-focus/extrusion.jpg'
import Injection from 'src/assets/images/workspace-focus/injection.jpg'
import Mix from 'src/assets/images/workspace-focus/mix.jpg'
import Sheetpress from 'src/assets/images/workspace-focus/sheetpress.jpg'
import Shredder from 'src/assets/images/workspace-focus/shredder.jpg'

interface IProps {}
interface IState {
  checkedFocusValue?: string
}

export class WorkspaceSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {}
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
          Workspace
        </Heading>
        <Box px={4}>
          <Text regular my={4}>
            What kind of Precious Plastic workspace do you run?
          </Text>
          <Flex wrap="nowrap">
            <Label>
              <RadioInputWImg
                id="wt-shredder"
                value="wt-shredder"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'wt-shredder'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={Shredder} />
              <Text my={1} txtcenter medium>
                Shredder
              </Text>
              <Text my={1} txtcenter small>
                Shredding plastic waste into flakes
              </Text>
            </Label>
            <Label htmlFor="wt-sheetpress">
              <RadioInputWImg
                id="wt-sheetpress"
                value="wt-sheetpress"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'wt-sheetpress'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={Sheetpress} />
              <Text my={1} txtcenter medium>
                Sheetpress
              </Text>
              <Text my={1} txtcenter small>
                Making recycled plastic sheets
              </Text>
            </Label>
            <Label htmlFor="wt-extrusion">
              <RadioInputWImg
                id="wt-extrusion"
                value="wt-extrusion"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'wt-extrusion'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={Extrusion} />
              <Text my={1} txtcenter medium>
                Extrusion
              </Text>
              <Text my={1} txtcenter small>
                Extruding plastic into beams or products
              </Text>
            </Label>
            <Label htmlFor="wt-injection">
              <RadioInputWImg
                id="wt-injection"
                value="wt-injection"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'wt-injection'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={Injection} />
              <Text my={1} txtcenter medium>
                Injection
              </Text>
              <Text my={1} txtcenter small>
                Making small productions of goods
              </Text>
            </Label>
            <Label htmlFor="wt-mix">
              <RadioInputWImg
                id="wt-mix"
                value="wt-mix"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'wt-mix'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={Mix} />
              <Text my={1} txtcenter medium>
                Mix
              </Text>
              <Text my={1} txtcenter small>
                Running a workspace with multiple machines and goals
              </Text>
            </Label>
          </Flex>
        </Box>
      </Flex>
    )
  }
}
