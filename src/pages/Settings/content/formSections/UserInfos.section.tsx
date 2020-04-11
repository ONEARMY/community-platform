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
  onCoverImgChange: (v: IConvertedFileMeta, i: number) => void
  mutators: { [key: string]: (...args: any[]) => any }
}
interface IState {
  readOnly: boolean
  isSaving?: boolean
  showNotification?: boolean
  showComLinks?: boolean
  isOpen?: boolean
}

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
`

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
            <Box height="100px" width="150px" m="10px" data-cy="cover-image">
              <Field
                canDelete
                hasText={false}
                id="cover_image-1"
                data-cy="cover_image-1"
                name="coverImages[0]"
                src={
                  initialFormValues.coverImages
                    ? initialFormValues.coverImages[0]
                    : null
                }
                component={ImageInputField}
                customChange={v => this.props.onCoverImgChange(v, 0)}
              />
            </Box>
            <Box height="100px" width="150px" m="10px" data-cy="cover-image">
              <Field
                canDelete
                hasText={false}
                id="cover_image-2"
                data-cy="cover_image-2"
                name="coverImages[1]"
                src={
                  initialFormValues.coverImages
                    ? initialFormValues.coverImages[1]
                    : null
                }
                component={ImageInputField}
                customChange={v => this.props.onCoverImgChange(v, 1)}
              />
            </Box>
            <Box height="100px" width="150px" m="10px" data-cy="cover-image">
              <Field
                canDelete
                hasText={false}
                id="cover_image-3"
                data-cy="cover_image-3"
                name="coverImages[2]"
                src={
                  initialFormValues.coverImages
                    ? initialFormValues.coverImages[2]
                    : null
                }
                component={ImageInputField}
                customChange={v => this.props.onCoverImgChange(v, 2)}
              />
            </Box>
            <Box height="100px" width="150px" m="10px" data-cy="cover-image">
              <Field
                canDelete
                hasText={false}
                id="cover_image-4"
                data-cy="cover_image-4"
                name="coverImages[3]"
                src={
                  initialFormValues.coverImages
                    ? initialFormValues.coverImages[3]
                    : null
                }
                component={ImageInputField}
                customChange={v => this.props.onCoverImgChange(v, 3)}
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
                    hideDelete={!index}
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
                  Add link
                </Button>
              </>
            )}
          </FieldArray>
        </Box>
      </FlexSectionContainer>
    )
  }
}
