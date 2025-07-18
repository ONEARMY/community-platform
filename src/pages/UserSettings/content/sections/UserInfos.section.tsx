import { useContext } from 'react'
import { Field } from 'react-final-form'
import { countries } from 'countries-list'
import {
  FieldInput,
  FieldTextarea,
  InternalLink,
  Username,
} from 'oa-components'
import { ProfileTypeList } from 'oa-shared'
import { SelectField } from 'src/common/Form/Select.field'
import { isModuleSupported, MODULE } from 'src/modules'
import { EnvironmentContext } from 'src/pages/common/EnvironmentContext'
import { fields, headings } from 'src/pages/UserSettings/labels'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { required, validateUrl } from 'src/utils/validators'
import { Flex, Heading, Text } from 'theme-ui'

import {
  GROUP_PROFILE_DESCRIPTION_MAX_LENGTH,
  MEMBER_PROFILE_DESCRIPTION_MAX_LENGTH,
} from '../../constants'
import { FlexSectionContainer } from '../elements'
import { ProfileTags } from './ProfileTags.section'

import type { ProfileFormData } from 'oa-shared'

interface IProps {
  formValues: Partial<ProfileFormData>
}

export const UserInfosSection = ({ formValues }: IProps) => {
  const env = useContext(EnvironmentContext)
  const { profile } = useProfileStore()

  const isMemberProfile = profile?.type === ProfileTypeList.MEMBER
  const { about, country, displayName, userName, website } = fields

  const countryCode = Object.keys(countries).find(
    (key) => countries[key].name === formValues.country,
  )
  const noMapPin = !profile?.pin

  return (
    <FlexSectionContainer>
      <Flex
        data-testid="UserInfosSection"
        sx={{ flexDirection: 'column', gap: [3, 5] }}
      >
        <Heading as="h2">{headings.infos}</Heading>
        <Flex sx={{ flexDirection: 'column', gap: 1 }}>
          <Text>{userName.title} *</Text>
          <Text variant="quiet" sx={{ fontSize: 2 }}>
            {userName.description}
          </Text>
          <Field
            data-cy="userName"
            name="userName"
            component={FieldInput}
            validate={required}
            validateFields={[]}
            disabled
          />
        </Flex>

        <Flex sx={{ flexDirection: 'column', gap: 1 }}>
          <Text>{displayName.title} *</Text>
          <Text variant="quiet" sx={{ fontSize: 2 }}>
            {displayName.description}
          </Text>
          <Field
            data-cy="displayName"
            name="displayName"
            component={FieldInput}
            placeholder="Pick a name to display on your profile"
            validate={required}
            validateFields={[]}
          />
        </Flex>

        <ProfileTags />

        <Flex sx={{ flexDirection: 'column', gap: 1 }}>
          <Text>{about.title} *</Text>
          <Field
            data-cy="info-description"
            name="about"
            component={FieldTextarea}
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

        {noMapPin && (
          <Flex sx={{ flexDirection: 'column', gap: 1 }}>
            <Text>{country.title}</Text>
            {isModuleSupported(
              env?.VITE_SUPPORTED_MODULES || '',
              MODULE.MAP,
            ) && (
              <InternalLink to="/settings/map/">
                <Text
                  variant="quiet"
                  sx={{ fontSize: 2, textDecoration: 'underline' }}
                  data-cy="link-to-map-setting"
                >
                  {country.description}
                </Text>
              </InternalLink>
            )}
            <Field data-cy="location-dropdown" name="country">
              {(field) => (
                <SelectField
                  options={Object.keys(countries).map((country) => ({
                    label: `${countries[country].emoji} ${countries[country].native}`,
                    value: countries[country].name,
                  }))}
                  placeholder="Select your country..."
                  {...field}
                />
              )}
            </Field>
            <Flex sx={{ gap: 1, alignItems: 'center' }}>
              <Text sx={{ fontSize: 1 }} variant="quiet">
                Preview:
              </Text>
              <Username
                user={{
                  userName: profile?.username || '',
                  countryCode,
                  isSupporter: false,
                  isVerified: false,
                }}
              />
            </Flex>
          </Flex>
        )}

        <Flex sx={{ flexDirection: 'column', gap: 1 }}>
          <Text>{website.title}</Text>
          <Field
            data-cy="website"
            name="website"
            component={FieldInput}
            validate={validateUrl}
            validateFields={[]}
          />
        </Flex>
      </Flex>
    </FlexSectionContainer>
  )
}
