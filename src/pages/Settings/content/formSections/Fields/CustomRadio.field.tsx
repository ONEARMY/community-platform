import { Component } from 'react'
import { HiddenInput } from '../elements'
import { Label, Image, Flex, Box } from 'theme-ui'
import Text from 'src/components/Text'
import { HiddenInputField } from 'src/components/Form/Fields'

interface IProps {
  value: string
  onChange: (value: string) => void
  isSelected: boolean
  imageSrc?: string
  textLabel?: string
  subText?: string
  name: string
  fullWidth?: boolean
  required?: boolean
  'data-cy'?: string
  theme?: any
}
interface IState {
  showDeleteModal: boolean
}

// validation - return undefined if no error (i.e. valid)
const isRequired = (value: any) => (value ? undefined : 'Required')

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
      required,
      'data-cy': dataCy,
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
        sx={{
          //TODO: Remove hardcoded theme values
          alignItems: 'center',
          width: '100%',
          display: 'flex',
          padding: '10px',
          flexDirection: ['row', 'row', 'column'],
          m: '5px',
          p: '10px 0',
          borderRadius: '5px',
          border: `#f4f6f7`, // theme.colors.background
          ':hover': {
            backgroundColor: `#f4f6f7`, // theme.colors.background
            cursor: 'pointer',
          },
          '&.selected': {
            backgroundColor: `#f4f6f7`, // theme.colors.background
            border: '1px solid ' + `#00c3a9`, // theme.colors.green
          },
        }}
        htmlFor={value}
        className={classNames.join(' ')}
        data-cy={dataCy}
      >
        <HiddenInput
          id={value}
          name={name}
          value={value}
          type="radio"
          component={HiddenInputField}
          checked={isSelected}
          validate={required ? isRequired : undefined}
          validateFields={[]}
          onChange={(v) => {
            this.props.onChange(v.target.value)
          }}
        />
        {imageSrc && (
          <Image
            px={3}
            src={imageSrc}
            sx={{ width: ['100px', '100px', '100%'] }}
          />
        )}
        <Flex
          sx={{
            alignItems: 'center',
            flexWrap: 'nowrap',
            flexDirection: 'column',
          }}
          px={1}
        >
          <Box mt="auto">
            {textLabel && (
              <Text
                px={1}
                my={1}
                small
                sx={{
                  fontWeight: ['bold', 'bold', 'inherit'],
                  textAlign: ['left', 'left', 'center'],
                }}
              >
                {textLabel}
              </Text>
            )}
            {subText && (
              <Text my={1} txtcenter small>
                {subText}
              </Text>
            )}
          </Box>
        </Flex>
      </Label>
    )
  }
}

export { CustomRadioField }
