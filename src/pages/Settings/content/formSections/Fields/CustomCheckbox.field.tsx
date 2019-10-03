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
  fullWidth?: boolean
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
    const {
      value,
      index,
      imageSrc,
      isSelected,
      btnLabel,
      fullWidth,
    } = this.props
    const classNames: Array<string> = []
    if (isSelected) {
      classNames.push('selected')
    }
    if (fullWidth) {
      classNames.push('full-width')
    }

    return (
      <Label htmlFor={value} className={classNames.join(' ')}>
        <HiddenInput
          id={value}
          name={value}
          value={value}
          type="checkbox"
          component={InputField}
          checked={isSelected}
          onChange={() => this.props.onChange(index)}
        />
        {imageSrc && <Image px={3} src={imageSrc} height="100%" />}
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
