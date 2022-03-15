import * as React from 'react'
import { Field } from 'react-final-form'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import { InputField, TextAreaField } from 'src/components/Form/Fields'
import { Button } from 'oa-components'
import theme from 'src/themes/styled.theme'
import { FieldArray } from 'react-final-form-arrays'
import { ProfileLinkField } from './Fields/Link.field'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { Box } from 'rebass'
import { required } from 'src/utils/validators'
import { IUserPP } from 'src/models/user_pp.models'
import { ImageInputField } from 'src/components/Form/ImageInput.field'
import { ErrorMessage } from 'src/components/Form/elements'
import { IUser } from 'src/models'
import { IUploadedFileMeta } from 'src/stores/storage'

interface IProps {
  formValues: IUserPP
  mutators: { [key: string]: (...args: any[]) => any }
}
interface IState {
  readOnly: boolean
  isSaving?: boolean
  showNotification?: boolean
  isOpen?: boolean
}

const CoverImages = ({
  isMemberProfile,
  coverImages,
}: {
  isMemberProfile: boolean
  coverImages: IUser['coverImages']
}) =>
  isMemberProfile ? (
    <>
      <Text mb={2} mt={7} width="100%" medium>
        Add a profile image *
      </Text>
      <Box height="150px" width="150px" m="10px" data-cy="cover-image">
        <Field
          hasText={false}
          name="coverImages[0]"
          validate={required}
          validateFields={[]}
          component={ImageInputField}
          data-cy={`coverImages-0`}
          initialValue={coverImages[0]}
        />
      </Box>
    </>
  ) : (
    <>
      <Text mb={2} mt={7} width="100%" medium>
        Cover Image *
      </Text>
      <FieldArray
        name="coverImages"
        initialValue={coverImages as IUploadedFileMeta[]}
      >
        {({ fields, meta }) => {
          return (
            <>
              {fields.map((name, index: number) => (
                <Box
                  key={name}
                  height="100px"
                  width="150px"
                  m="10px"
                  data-cy="cover-image"
                >
                  <Field
                    hasText={false}
                    name={name}
                    validateFields={[]}
                    data-cy={`coverImages-${index}`}
                    component={ImageInputField}
                  />
                </Box>
              ))}
              {meta.error && <ErrorMessage>{meta.error}</ErrorMessage>}
            </>
          )
        }}
      </FieldArray>

      <Box
        bg={theme.colors.softblue}
        mt={2}
        p={2}
        width={1}
        sx={{ borderRadius: '3px' }}
      >
        <Text small>
          The cover images are shown in your profile and helps us evaluate your
          account.
        </Text>
        <Text small>
          Make sure the first image shows your space. Best size is 1920x1080.
        </Text>
      </Box>
    </>
  )

export class UserInfosSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      readOnly: true,
      isOpen: true,
    }
  }

  render() {
    const { formValues } = this.props
    const { profileType, links, coverImages } = formValues
    const { isOpen } = this.state
    const isMemberProfile = profileType === 'member'
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
              Display Name *
            </Text>
            <Field
              data-cy="username"
              name="displayName"
              component={InputField}
              placeholder="Pick a unique username"
              validate={required}
              validateFields={[]}
            />

            <Text mb={2} mt={7} medium>
              {isMemberProfile
                ? 'Tell us a bit about yourself *'
                : 'Description *'}
            </Text>
            <Field
              data-cy="info-description"
              name="about"
              component={TextAreaField}
              placeholder="Describe in details what you do and who you are. Write in English otherwise your profile won't be approved."
              validate={required}
              validateFields={[]}
            />
            <CoverImages
              isMemberProfile={isMemberProfile}
              coverImages={coverImages}
            />
          </Flex>
          <>
            <Flex wrap={'nowrap'} alignItems={'center'} width={1}>
              <Text mb={2} mt={7} medium>
                Contacts & links *
              </Text>
            </Flex>
            <FieldArray name="links" initialValue={links}>
              {({ fields }) => (
                <>
                  {fields.map((name, i: number) => (
                    <ProfileLinkField
                      key={name}
                      name={name}
                      onDelete={() => {
                        fields.remove(i)
                      }}
                      index={i}
                    />
                  ))}
                  <Button
                    type="button"
                    data-cy="add-link"
                    my={2}
                    variant="outline"
                    onClick={() => {
                      fields.push({} as any)
                    }}
                  >
                    add link
                  </Button>
                </>
              )}
            </FieldArray>
          </>
        </Box>
      </FlexSectionContainer>
    )
  }
}
