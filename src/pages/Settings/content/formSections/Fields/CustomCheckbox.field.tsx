import React, { Component } from 'react'
import { InputField } from 'src/components/Form/Fields'
import { Label, HiddenInput } from '../elements'
import { Image } from 'rebass'
import Text from 'src/components/Text'

interface IProps {
  value: string
  index: number
  onChange: (index: number) => void
  isSelected: boolean
  imageSrc?: string
  btnLabel?: string
}
interface IState {
  showDeleteModal: boolean
}

// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

class CustomCheckbox extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showDeleteModal: false,
    }
  }

  render() {
    const { value, index, imageSrc, isSelected, btnLabel } = this.props
    return (
      <Label htmlFor={value} className={isSelected ? 'selected' : undefined}>
        <HiddenInput
          id={value}
          name={value}
          type="checkbox"
          component={InputField}
          checked={isSelected}
          onChange={() => this.props.onChange(index)}
        />
        {imageSrc && <Image px={3} src={imageSrc} />}
        {btnLabel && (
          <Text medium m="10px">
            {btnLabel}
          </Text>
        )}
      </Label>
    )
  }
}

export { CustomCheckbox }
