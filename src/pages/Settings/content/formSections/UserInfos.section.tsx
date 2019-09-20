import * as React from 'react'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import Heading from 'src/components/Heading'
import { IUser } from 'src/models/user.models'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import { InputField, YearPicker } from 'src/components/Form/Fields'
import { inputStyles } from 'src/components/Form/elements'
import { FlagSelector } from 'src/components/Form/Select.field'
import { Button } from 'src/components/Button'
import { Box } from 'rebass'
import { getCountryCode } from 'src/utils/helpers'
import 'react-flags-select/scss/react-flags-select.scss'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import { FieldArray } from 'react-final-form-arrays'
import { Link } from './Link.field'
import { timestampToYear } from 'src/utils/helpers'
import { Icon } from 'src/components/Icons'
import { ImageInputField } from 'src/components/Form/ImageInput.field'

interface IProps {
  user: IUser
}
interface IState {
  readOnly: boolean
  isSaving?: boolean
  showYearSelector?: boolean
  showNotification?: boolean
  showComLinks?: boolean
}

// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

const FlagSelectContainer = styled(Flex)`
  border: 1px solid ${theme.colors.black};
  border-radius: 4px;
  height: 40px;
`

const YearBox = styled(Box)`
  ${inputStyles}
  cursor: pointer;
  height: 40px;
`

export class UserInfosSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      readOnly: true,
      showYearSelector: false,
      showComLinks: props.user && props.user.links ? true : false,
    }
    this.changeComLinkSwitch = this.changeComLinkSwitch.bind(this)
  }

  public changeComLinkSwitch() {
    this.setState({ showComLinks: !this.state.showComLinks })
  }

  public displayYear(dateOrTmstp) {
    // if date comes from db, it will be formated in firebase.Timestamp whereas if it comes from calendar (user modifications) it's a Date object
    // this fn check the type of the date and return a year in format YYYY
    if (dateOrTmstp instanceof Date && !isNaN(dateOrTmstp.valueOf())) {
      return dateOrTmstp.getFullYear()
    } else {
      return timestampToYear(dateOrTmstp.seconds)
    }
  }

  render() {
    const { user } = this.props
    return (
      <Flex
        card
        mediumRadius
        bg={'white'}
        mt={5}
        p={4}
        flexWrap="wrap"
        flexDirection="column"
      >
        <Heading small mb={3}>
          Infos
        </Heading>
        <Flex flexWrap={'wrap'}>
          <Text my={2} medium>
            User / workspace username *
          </Text>
          <Field
            name="userName"
            component={InputField}
            placeholder="Pick a unique username"
          />
          <Text mb={2} mt={7} medium>
            Where are you based? *
          </Text>
          <FlagSelectContainer width={1} alignItems="center">
            <Field
              name="country"
              component={FlagSelector}
              searchable={true}
              defaultCountry={getCountryCode(user.country)}
            />
          </FlagSelectContainer>
          <Text mb={2} mt={7} medium>
            Description *
          </Text>
          <Field
            name="about"
            component={InputField}
            placeholder="Describe in details what you do and who you are."
          />
          <Text mb={2} mt={7} medium>
            Cover Image *
          </Text>
          {/* TODO display existing images on edit */}
          {/* {userimages.length > 0 &&
            images[0].downloadUrl !== undefined &&
            !editStepImgs ? (
              <Flex alignItems={'center'} justifyContent={'center'}>
              {images.map(image => {
                return (
                  <Flex
                  flexWrap={'nowrap'}
                  px={1}
                  width={1 / 4}
                  key={image.name}
                  >
                  <ImageWithOpacity src={image.downloadUrl} />
                  </Flex>
                  )
                })}
                <AbsoluteBtn
                icon={'delete'}
                variant={'tertiary'}
                onClick={() =>
                  this.setState({
                    editStepImgs: !editStepImgs,
                  })
                }
                />
                </Flex>
              ) : ( */}
          <Field
            style={{ width: '100%' }}
            name={`coverImages`}
            component={ImageInputField}
            multi
          />
          {/* )} */}
          {/* <Text width={1} mt={2} medium>
            Birth year :
          </Text>
          <YearBox
            width={1}
            onClick={() => {
              this.setState({
                showYearSelector: !this.state.showYearSelector,
              })
            }}
          >
            <Icon glyph={'arrow-down'} />
            <Text inline ml={2}>
              {user.year ? this.displayYear(user.year) : 'Choose a date'}
            </Text>
          </YearBox>
          {this.state.showYearSelector && (
            <Field
              name="year"
              component={YearPicker}
              onChange={year => {
                user.year = year
                this.setState({ showYearSelector: false })
              }}
            />
          )} */}
        </Flex>
        <Flex wrap={'nowrap'} alignItems={'center'} width={1}>
          <Text mb={2} mt={7} medium>
            Contacts & links *
          </Text>
        </Flex>
        <FieldArray name="links">
          {({ fields }) => (
            <>
              {fields.map((name, index: number) => (
                <Link
                  key={index}
                  link={name}
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
                add more
              </Button>
            </>
          )}
        </FieldArray>
      </Flex>
    )
  }
}
