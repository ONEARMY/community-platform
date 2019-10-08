import React, { Component } from 'react'
import { InputField } from 'src/components/Form/Fields'
import { Label, HiddenInput } from '../elements'
import { Image, Flex } from 'rebass'
import Text from 'src/components/Text'
import { ProfileTypeLabel } from 'src/models/user_pp.models'

interface IProps {
  value: string
  onChange: (value: string) => void
  isSelected: boolean
  imageSrc?: string
  textLabel?: string
  subText?: string
  name: string
  fullWidth?: boolean
}
interface IState {
  showDeleteModal: boolean
}

// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

class CustomRadioField extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showDeleteModal: false,
    }
  }

  render() {
    const {
      value,
      imageSrc,
      isSelected,
      textLabel,
      subText,
      name,
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
          name={name}
          value={value}
          type="radio"
          component={InputField}
          checked={isSelected}
          onChange={v => {
            this.props.onChange(v.target.value)
          }}
        />
        {imageSrc && <Image px={3} src={imageSrc} width="100%" />}
        {textLabel && (
          <Text px={1} my={1} txtcenter small>
            {textLabel}
          </Text>
        )}
        {subText && (
          <Flex alignItems="center" flexWrap="nowrap">
            <Text my={1} txtcenter small>
              {subText}
            </Text>
          </Flex>
        )}
      </Label>
    )
  }
}

export { CustomRadioField }
