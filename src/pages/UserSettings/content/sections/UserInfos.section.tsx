import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import countriesList from 'countries-list'
import {
  Button,
  FieldInput,
  FieldTextarea,
  InternalLink,
  Username,
} from 'oa-components'
import { ProfileTypeList } from 'oa-shared'
import { SelectField } from 'src/common/Form/Select.field'
import { isModuleSupported, MODULE } from 'src/modules'
import { buttons, fields, headings } from 'src/pages/UserSettings/labels'
import { required } from 'src/utils/validators'
import { Flex, Heading, Text } from 'theme-ui'

import {
  GROUP_PROFILE_DESCRIPTION_MAX_LENGTH,
  MEMBER_PROFILE_DESCRIPTION_MAX_LENGTH,
} from '../../constants'
import { FlexSectionContainer } from '../elements'
import { ProfileLinkField } from '../fields/ProfileLink.field'

import type { IUser } from 'oa-shared'

interface IProps {
  formValues: Partial<IUser>
}

export const UserInfosSection = ({ formValues }: IProps) => {
  const { countries } = countriesList
  const { profileType, links, location } = formValues
  const isMemberProfile = profileType === ProfileTypeList.MEMBER
  const { about, country, displayName, userName } = fields

  const countryCode = Object.keys(countries).find(
    (key) => countries[key].name === formValues.location?.country,
  )
  const noMapPin = !location?.latlng

  return (
    <FlexSectionContainer>
      <Flex
        data-testid="UserInfosSection"
        sx={{ flexDirection: 'column', gap: [3, 5] }}
      >
        <Heading as="h2">{headings.infos}</Heading>
        <Flex sx={{ flexDirection: 'column', gap: 1 }}>
          <Text>{`${userName.title} *`}</Text>
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
          <Text>{`${displayName.title} *`}</Text>
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

        <Flex sx={{ flexDirection: 'column', gap: 1 }}>
          <Text>{`${about.title} *`}</Text>
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
            {isModuleSupported(MODULE.MAP) && (
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
            <Field data-cy="location-dropdown" name="location.country">
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
                  userName: formValues.userName || '',
                  countryCode,
                  isSupporter: false,
                  isVerified: false,
                }}
              />
            </Flex>
          </Flex>
        )}

        <Flex
          data-cy="UserInfos: links"
          sx={{
            flexDirection: 'column',
            justifyContent: 'stretch',
            gap: [4, 4, 2],
          }}
        >
          <Text>{`${fields.links.title} *`}</Text>
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
                  variant="quiet"
                  onClick={() => {
                    fields.push({} as any)
                  }}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {buttons.link.add}
                </Button>
              </>
            )}
          </FieldArray>
        </Flex>
      </Flex>
    </FlexSectionContainer>
  )
}
