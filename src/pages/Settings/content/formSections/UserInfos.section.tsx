import * as React from 'react'
import { Field } from 'react-final-form'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import { InputField, TextAreaField } from 'src/components/Form/Fields'
import { FlagSelector } from 'src/components/Form/Select.field'
import { Button } from 'src/components/Button'
import { getCountryCode } from 'src/utils/helpers'
import 'react-flags-select/scss/react-flags-select.scss'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import { FieldArray } from 'react-final-form-arrays'
import { Link } from './Fields/Link.field'
import { ImageInputField } from 'src/components/Form/ImageInput.field'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { Box } from 'rebass'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { IFormValues } from '../../SettingsPage'
import { required } from 'src/utils/validators'

interface IProps {
  initialFormValues: IFormValues | any
  onCoverImgChange: (v: IConvertedFileMeta) => void
  mutators: { [key: string]: (...args: any[]) => any }
}
interface IState {
  readOnly: boolean
  isSaving?: boolean
  showNotification?: boolean
  showComLinks?: boolean
  isOpen?: boolean
}

const FlagSelectContainer = styled(Flex)`
  border: 1px solid ${theme.colors.black};
  border-radius: 4px;
  height: 40px;
  background-color: ${theme.colors.background};
`

export class UserInfosSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      readOnly: true,
      showComLinks:
        props.initialFormValues && props.initialFormValues.links ? true : false,
      isOpen: true,
    }
    this.changeComLinkSwitch = this.changeComLinkSwitch.bind(this)
  }

  public changeComLinkSwitch() {
    this.setState({ showComLinks: !this.state.showComLinks })
  }

  render() {
    const { initialFormValues } = this.props
    const { isOpen } = this.state

    return (
      <FlexSectionContainer>
        <Flex justifyContent="space-between">
          <Heading small>Infos</Heading>
          <ArrowIsSectionOpen
            onClick={() => {
              this.setState({ isOpen: !isOpen })
            }}
            isOpen={isOpen}
          />
        </Flex>
        <Box sx={{ display: isOpen ? 'block' : 'none' }}>
          <Flex flexWrap={'wrap'}>
            <Text my={4} medium>
              User / workspace username *
            </Text>
            <Field
              data-cy="username"
              name="displayName"
              component={InputField}
              placeholder="Pick a unique username"
              validate={required}
            />
            {initialFormValues.profileType === 'member' && (
              <Text mb={2} mt={7} medium>
                Where are you based? *
              </Text>
            )}
            {initialFormValues.profileType === 'member' && (
              <FlagSelectContainer
                width={1}
                alignItems="center"
                data-cy="country"
              >
                <Field
                  name="country"
                  component={FlagSelector}
                  searchable={true}
                  validate={required}
                  defaultCountry={getCountryCode(initialFormValues.country)}
                />
              </FlagSelectContainer>
            )}
            <Text mb={2} mt={7} medium>
              Description *
            </Text>
            <Field
              data-cy="info-description"
              name="about"
              component={TextAreaField}
              placeholder="Describe in details what you do and who you are."
              validate={required}
            />
            <Text mb={2} mt={7} width="100%" medium>
              Cover Image *
            </Text>
            <Box height="100px" width="150px" data-cy="cover-image">
              <Field
                id="cover_image"
                name="coverImages"
                validate={required}
                src={
                  initialFormValues.coverImages
                    ? initialFormValues.coverImages[0]
                    : null
                }
                component={ImageInputField}
                customChange={v => this.props.onCoverImgChange(v)}
              />
            </Box>
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
                    initialType={
                      initialFormValues.links[index]
                        ? initialFormValues.links[index].label
                        : undefined
                    }
                    link={name}
                    index={index}
                    mutators={this.props.mutators}
                    onDelete={(fieldIndex: number) => {
                      fields.remove(fieldIndex)
                    }}
                  />
                ))}
                <Button
                  data-cy="add-link"
                  my={2}
                  variant="outline"
                  onClick={() => {
                    fields.push({
                      label: '',
                      url: '',
                    })
                  }}
                >
                  add link
                </Button>
              </>
            )}
          </FieldArray>
        </Box>
      </FlexSectionContainer>
    )
  }
}
