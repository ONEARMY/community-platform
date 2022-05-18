import * as React from 'react'
import { Field } from 'react-final-form'
import { Heading } from 'theme-ui'
import { countries } from 'countries-list'
import { Flex } from 'theme-ui'
import { InputField, TextAreaField } from 'src/components/Form/Fields'
import { Button } from 'oa-components'
import theme from 'src/themes/styled.theme'
import { FieldArray } from 'react-final-form-arrays'
import { ProfileLinkField } from './Fields/Link.field'
import { FlexSectionContainer } from './elements'
import { Box, Text } from 'theme-ui'
import { required } from 'src/utils/validators'
import type { IUserPP } from 'src/models/user_pp.models'
import { ImageInputField } from 'src/components/Form/ImageInput.field'
import { ErrorMessage } from 'src/components/Form/elements'
import type { IUser } from 'src/models'
import type { IUploadedFileMeta } from 'src/stores/storage'
import { ProfileType } from 'src/modules/profile'
import { SelectField } from 'src/components/Form/Select.field'

interface IProps {
  formValues: IUserPP
  showLocationDropdown: boolean
  mutators: { [key: string]: (...args: any[]) => any }
}
interface IState {
  readOnly: boolean
  isSaving?: boolean
  showNotification?: boolean
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
      <Text mb={2} mt={7} sx={{ width: '100%', fontSize: 2 }}>
        Add a profile image *
      </Text>
      <Box
        sx={{
          height: '150px',
          width: '150px',
        }}
        m="10px"
        data-cy="cover-image"
      >
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
      <Text mb={2} mt={7} sx={{ width: '100%', fontSize: 2 }}>
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
                  sx={{
                    height: '100px',
                    width: '150px',
                  }}
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
        sx={{ width: '100%', borderRadius: '3px' }}
      >
        <Text sx={{ fontSize: 1 }}>
          The cover images are shown in your profile and helps us evaluate your
          account.
        </Text>
        <Text sx={{ fontSize: 1 }}>
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
    }
  }

  render() {
    const { formValues } = this.props
    const { profileType, links, coverImages } = formValues
    const isMemberProfile = profileType === ProfileType.MEMBER
    return (
      <FlexSectionContainer>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading variant="small">Infos</Heading>
        </Flex>
        <Box>
          <Flex sx={{ flexWrap: 'wrap' }}>
            <Text
              sx={{
                fontSize: 2,
                marginTop: 4,
                marginBottom: 4,
                display: 'block',
              }}
            >
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
            {this.props.showLocationDropdown && (
              <Flex sx={{ flexDirection: 'column', width: '100%' }}>
                <Text my={4} sx={{ fontSize: 2 }}>
                  Your location
                </Text>
                <Field data-cy="location-dropdown" name="country">
                  {(field) => (
                    <SelectField
                      options={Object.keys(countries).map((country) => ({
                        label: countries[country].name,
                        value: country,
                      }))}
                      placeholder="Country"
                      {...field}
                    />
                  )}
                </Field>
              </Flex>
            )}

            <Text mb={2} mt={7} sx={{ fontSize: 2 }}>
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
            <Flex sx={{ alignItems: 'center', width: '100%', wrap: 'nowrap' }}>
              <Text mb={2} mt={7} sx={{ fontSize: 2 }}>
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
