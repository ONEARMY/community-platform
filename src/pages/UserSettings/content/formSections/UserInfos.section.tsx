import * as React from 'react'
import { Field } from 'react-final-form'
import { Heading, Flex, Box, Text, Alert } from 'theme-ui'
import { countries } from 'countries-list'
import { Button, FieldInput, FieldTextarea } from 'oa-components'
import { FieldArray } from 'react-final-form-arrays'

import { ProfileLinkField } from './Fields/ProfileLink.field'
import { FlexSectionContainer } from './elements'
import { required } from 'src/utils/validators'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { ProfileType } from 'src/modules/profile/types'
import { SelectField } from 'src/common/Form/Select.field'

import { buttons, fields, headings } from 'src/pages/UserSettings/labels'

import type { IUserPP } from 'src/models/userPreciousPlastic.models'
import type { IUser } from 'src/models'
import type { IUploadedFileMeta } from 'src/stores/storage'

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

const { title, description } = fields.coverImages
export const CoverImages = ({
  isMemberProfile,
  coverImages,
}: {
  isMemberProfile: boolean
  coverImages: IUser['coverImages']
}) =>
  isMemberProfile ? (
    <>
      <Text mb={2} mt={7} sx={{ width: '100%', fontSize: 2 }}>
        {`${title} *`}
      </Text>
      <Box
        sx={{
          height: '190px',
          width: '190px',
        }}
        m="2"
        data-cy="cover-image"
        data-testid="cover-image"
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
        {`${title} *`}
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
                  data-testid="cover-image"
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
              {meta.error && (
                <Text sx={{ fontSize: 0, margin: 1, color: 'error' }}>
                  {meta.error}
                </Text>
              )}
            </>
          )
        }}
      </FieldArray>

      <Alert mt={2} variant="info">
        <Text sx={{ fontSize: 1, textAlign: 'left' }}>{description}</Text>
      </Alert>
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
    const { about, country, displayName } = fields

    return (
      <FlexSectionContainer>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading variant="small">{headings.infos}</Heading>
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
              {`${displayName.title} *`}
            </Text>
            <Field
              data-cy="username"
              name="displayName"
              component={FieldInput}
              placeholder="Pick a unique username"
              validate={required}
              validateFields={[]}
            />
            {this.props.showLocationDropdown && (
              <Flex sx={{ flexDirection: 'column', width: '100%' }}>
                <Text my={4} sx={{ fontSize: 2 }}>
                  {country.title}
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
              {`${about.title} *`}
            </Text>
            <Field
              data-cy="info-description"
              name="about"
              component={FieldTextarea}
              placeholder={about.placeholder}
              validate={required}
              validateFields={[]}
            />
            <CoverImages
              isMemberProfile={isMemberProfile}
              coverImages={coverImages}
            />
          </Flex>
          <Box data-cy="UserInfos: links">
            <Flex sx={{ alignItems: 'center', width: '100%', wrap: 'nowrap' }}>
              <Text mb={2} mt={7} sx={{ fontSize: 2 }}>
                {`${fields.links.title} *`}
              </Text>
            </Flex>
            <FieldArray name="links" initialValue={links}>
              {({ fields }) => (
                <>
                  {fields
                    ? fields.map((name, i: number) => (
                        <ProfileLinkField
                          key={fields.value[i].key}
                          name={name}
                          onDelete={() => {
                            fields.remove(i)
                          }}
                          index={i}
                          isDeleteEnabled={i > 0 || (fields as any).length > 1}
                        />
                      ))
                    : null}
                  <Button
                    type="button"
                    data-cy="add-link"
                    my={2}
                    variant="outline"
                    onClick={() => {
                      fields.push({} as any)
                    }}
                  >
                    {buttons.link.add}
                  </Button>
                </>
              )}
            </FieldArray>
          </Box>
        </Box>
      </FlexSectionContainer>
    )
  }
}
