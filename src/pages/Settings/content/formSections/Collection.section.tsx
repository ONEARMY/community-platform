import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box } from 'rebass'
import { RadioInputWImg, Label, ImgOp } from './elements'
import { InputField } from 'src/components/Form/Fields'
import { OpeningHoursPicker } from './OpeningHoursPicker.field'

// assets
import Pet from 'src/assets/images/plastic-types/pet.jpg'
import PP from 'src/assets/images/plastic-types/pp.jpg'
import PS from 'src/assets/images/plastic-types/ps.jpg'
import Hdpe from 'src/assets/images/plastic-types/hdpe.jpg'
import Ldpe from 'src/assets/images/plastic-types/ldpe.jpg'
import Other from 'src/assets/images/plastic-types/other.jpg'
import Pvc from 'src/assets/images/plastic-types/pvc.jpg'
import { FieldArray } from 'react-final-form-arrays'
import { Button } from 'src/components/Button'

interface IProps {}
interface IState {
  checkedFocusValue?: string
}

export class CollectionSection extends React.Component<IProps, IState> {
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
          Collection
        </Heading>
        <Box px={4}>
          <Flex wrap={'nowrap'} alignItems={'center'} width={1}>
            <Text regular my={4}>
              Opening time *
            </Text>
          </Flex>
          <FieldArray name="links">
            {({ fields }) => (
              <>
                {fields.map((name, index: number) => (
                  <OpeningHoursPicker
                    key={index}
                    index={index}
                    onDelete={(fieldIndex: number) => {
                      fields.remove(fieldIndex)
                    }}
                  />
                ))}
                <Button
                  my={2}
                  variant="outline"
                  onClick={() => {
                    fields.push({
                      label: '',
                      url: '',
                    })
                  }}
                >
                  add opening day
                </Button>
              </>
            )}
          </FieldArray>
          <Text regular my={4}>
            Plastic types accepted *
          </Text>
          <Flex wrap="nowrap">
            <Label>
              <RadioInputWImg
                id="col-pt-1"
                value="col-pt-1"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'col-pt-1'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={Pet} />
            </Label>
            <Label htmlFor="col-pt-2">
              <RadioInputWImg
                id="col-pt-2"
                value="col-pt-2"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'col-pt-2'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={Hdpe} />
            </Label>
            <Label htmlFor="col-pt-3">
              <RadioInputWImg
                id="col-pt-3"
                value="col-pt-3"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'col-pt-3'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={Pvc} />
            </Label>
            <Label htmlFor="col-pt-4">
              <RadioInputWImg
                id="col-pt-4"
                value="col-pt-4"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'col-pt-4'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={Ldpe} />
            </Label>
            <Label htmlFor="col-pt-5">
              <RadioInputWImg
                id="col-pt-5"
                value="col-pt-5"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'col-pt-5'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={PP} />
            </Label>
            <Label htmlFor="col-pt-6">
              <RadioInputWImg
                id="col-pt-6"
                value="col-pt-6"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'col-pt-6'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={PS} />
            </Label>
            <Label htmlFor="col-pt-7">
              <RadioInputWImg
                id="col-pt-7"
                value="col-pt-7"
                name="title"
                type="radio"
                validateFields={[]}
                component={InputField}
                checked={this.state.checkedFocusValue === 'col-pt-7'}
                // onChange={v => this.onInputChange(v.target.value)}
              />
              <ImgOp px={3} src={Other} />
            </Label>
          </Flex>
        </Box>
      </Flex>
    )
  }
}
