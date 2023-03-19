import { Component } from 'react'
import { Label, HiddenInput } from '../elements'
import { Image, Input, Text } from 'theme-ui'
import type { FieldRenderProps } from 'react-final-form'

interface IProps {
  value: string
  index: number
  onChange: (index: number) => void
  isSelected: boolean
  imageSrc?: string
  btnLabel?: string
  fullWidth?: boolean
  'data-cy'?: string
  required?: boolean
}
interface IState {
  showDeleteModal: boolean
}

type FieldProps = FieldRenderProps<any, any> & {
  children?: React.ReactNode
  disabled?: boolean
  'data-cy'?: string
  customOnBlur?: (event) => void
}

const HiddenInputField = ({ input, meta, ...rest }: FieldProps) => (
  <>
    <Input
      type="hidden"
      variant={meta.error && meta.touched ? 'error' : 'input'}
      {...input}
      {...rest}
    />
  </>
)

// validation - return undefined if no error (i.e. valid)
const isRequired = (value: any) => (value ? undefined : 'Required')

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
      'data-cy': dataCy,
      required,
    } = this.props
    const classNames: Array<string> = []
    if (isSelected) {
      classNames.push('selected')
    }
    if (fullWidth) {
      classNames.push('full-width')
    }

    return (
      <Label
        htmlFor={value}
        sx={{
          width: ['inherit', 'inherit', '100%'],
          borderRadius: 1,
          py: 2,
          border: '1px solid transparent',
          cursor: 'pointer',
          ':hover': {
            backgroundColor: 'background',
          },
          '&.selected': {
            backgroundColor: 'background',
            borderColor: 'green',
          },
        }}
        className={classNames.join(' ')}
        data-cy={dataCy}
      >
        <HiddenInput
          name={value}
          id={value}
          value={value}
          onChange={() => this.props.onChange(index)}
          checked={isSelected}
          validate={required ? isRequired : undefined}
          validateFields={[]}
          type="checkbox"
          component={HiddenInputField}
        />
        {imageSrc && (
          <Image
            loading="lazy"
            px={3}
            src={imageSrc}
            sx={{ width: ['70px', '70px', '100%'] }}
          />
        )}
        {btnLabel && (
          <Text sx={{ fontSize: 2 }} m="10px">
            {btnLabel}
          </Text>
        )}
      </Label>
    )
  }
}

export { CustomCheckbox }
