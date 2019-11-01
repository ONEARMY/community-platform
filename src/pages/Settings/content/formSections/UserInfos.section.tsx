import * as React from 'react'
import { Field } from 'react-final-form'
import Heading from 'src/components/Heading'
import { IUserPP } from 'src/models/user_pp.models'
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
import { Image, Box } from 'rebass'

interface IProps {
  user: IUserPP | any
}
interface IState {
  readOnly: boolean
  isSaving?: boolean
  showNotification?: boolean
  showComLinks?: boolean
  editCoverImgs?: boolean
  isOpen?: boolean
}

// validation - return undefined if no error (i.e. valid)
const required = (value: any) => (value ? undefined : 'Required')

const FlagSelectContainer = styled(Flex)`
  border: 1px solid ${theme.colors.black};
  border-radius: 4px;
  height: 40px;
`

export class UserInfosSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      readOnly: true,
      showComLinks: props.user && props.user.links ? true : false,
      editCoverImgs: props.user && props.user.coverImages ? true : false,
      isOpen: props.user && !props.user.profileType,
    }
    this.changeComLinkSwitch = this.changeComLinkSwitch.bind(this)
  }

  public changeComLinkSwitch() {
    this.setState({ showComLinks: !this.state.showComLinks })
  }

  render() {
    const { user } = this.props
    const { editCoverImgs, isOpen } = this.state

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
              name="userName"
              component={InputField}
              placeholder="Pick a unique username"
              validate={required}
            />
            <Text mb={2} mt={7} medium>
              Where are you based? *
            </Text>
            <FlagSelectContainer width={1} alignItems="center" data-cy="country">
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
              data-cy="info-description"
              name="about"
              component={TextAreaField}
              placeholder="Describe in details what you do and who you are."
              validate={required}
            />
            <Text mb={2} mt={7} medium>
              Cover Image *
            </Text>
            {user.coverImages &&
            user.coverImages.length > 0 &&
            user.coverImages[0].downloadUrl !== undefined &&
            editCoverImgs ? (
              <Flex alignItems={'center'} justifyContent={'center'}>
                {user.coverImages.map(image => {
                  return (
                    <Flex
                      flexWrap={'nowrap'}
                      px={1}
                      width={1 / 4}
                      key={image.name}
                    >
                      <Image sx={{ opacity: 0.5 }} src={image.downloadUrl} />
                    </Flex>
                  )
                })}
                <Button
                  icon={'delete'}
                  variant={'tertiary'}
                  sx={{ position: 'absolute' }}
                  onClick={() =>
                    this.setState({
                      editCoverImgs: !editCoverImgs,
                    })
                  }
                />
              </Flex>
            ) : (
              <Field
                data-cy={'cover-images'}
                style={{ width: '100%' }}
                name={`coverImages`}
                component={ImageInputField}
                validate={required}
                multi
              />
            )}
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
