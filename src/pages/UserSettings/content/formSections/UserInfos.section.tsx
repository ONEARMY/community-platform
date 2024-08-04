import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import countriesList from 'countries-list'
import { Button, FieldInput } from 'oa-components'
import { SelectField } from 'src/common/Form/Select.field'
import { ProfileType } from 'src/modules/profile/types'
import { buttons, fields, headings } from 'src/pages/UserSettings/labels'
import { required } from 'src/utils/validators'
import { Box, Flex, Heading, Text } from 'theme-ui'

import {
  GROUP_PROFILE_DESCRIPTION_MAX_LENGTH,
  MEMBER_PROFILE_DESCRIPTION_MAX_LENGTH,
} from '../../constants'
import { ProfileLinkField } from './Fields/ProfileLink.field'
import { FlexSectionContainer } from './elements'

import type { IUserPP } from 'src/models/userPreciousPlastic.models'

interface IProps {
  formValues: IUserPP
  showLocationDropdown: boolean
  mutators: { [key: string]: (...args: any[]) => any }
}

export const UserInfosSection = (props: IProps) => {
  const { formValues, showLocationDropdown } = props
  const { profileType, links } = formValues
  const isMemberProfile = profileType === ProfileType.MEMBER
  const { about, country, displayName } = fields

  return (
    <FlexSectionContainer>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Heading as="h2" variant="small">
          {headings.infos}
        </Heading>
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
          {showLocationDropdown && (
            <Flex sx={{ flexDirection: 'column', width: '100%' }}>
              <Text my={4} sx={{ fontSize: 2 }}>
                {country.title}
              </Text>
              <Field data-cy="location-dropdown" name="country">
                {(field) => (
                  <SelectField
                    options={Object.keys(countriesList.countries).map(
                      (country) => ({
                        label: countriesList.countries[country].name,
                        value: country,
                      }),
                    )}
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
            component={FieldInput}
            showCharacterCount
            maxLength={
              isMemberProfile
                ? MEMBER_PROFILE_DESCRIPTION_MAX_LENGTH
                : GROUP_PROFILE_DESCRIPTION_MAX_LENGTH
            }
            placeholder={about.placeholder}
            validate={required}
            validateFields={[]}
          />
        </Flex>

        <Box data-cy="UserInfos: links">
          <Flex>
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
