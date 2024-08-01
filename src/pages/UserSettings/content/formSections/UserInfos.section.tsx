import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { countries } from 'countries-list'
import { Button, FieldInput, FieldTextarea, InternalLink } from 'oa-components'
import { SelectField } from 'src/common/Form/Select.field'
import { isModuleSupported, MODULE } from 'src/modules'
import { ProfileType } from 'src/modules/profile/types'
import { buttons, fields, headings } from 'src/pages/UserSettings/labels'
import { required } from 'src/utils/validators'
import { Flex, Heading, Text } from 'theme-ui'

import {
  GROUP_PROFILE_DESCRIPTION_MAX_LENGTH,
  MEMBER_PROFILE_DESCRIPTION_MAX_LENGTH,
} from '../../constants'
import { ProfileLinkField } from './Fields/ProfileLink.field'
import { FlexSectionContainer } from './elements'

import type { IUserPP } from 'src/models/userPreciousPlastic.models'

interface IProps {
  formValues: Partial<IUserPP>
}

export const UserInfosSection = ({ formValues }: IProps) => {
  const { profileType, links, location } = formValues
  const isMemberProfile = profileType === ProfileType.MEMBER
  const { about, country, displayName } = fields

  const noMapPin = !location?.latlng

  return (
    <FlexSectionContainer>
      <Flex sx={{ flexDirection: 'column', gap: [4, 6] }}>
        <Heading as="h2" variant="small">
          {headings.infos}
        </Heading>
        <Flex sx={{ flexDirection: 'column', gap: 2 }}>
          <Text>{`${displayName.title} *`}</Text>
          <Field
            data-cy="username"
            name="displayName"
            component={FieldInput}
            placeholder="Pick a unique username"
            validate={required}
            validateFields={[]}
          />
        </Flex>

        <Flex sx={{ flexDirection: 'column' }}>
          <Text
            sx={{ alignSelf: 'self-start', paddingBottom: 2 }}
          >{`${about.title} *`}</Text>
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
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
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
                    label: countries[country].name,
                    value: countries[country].name,
                  }))}
                  placeholder="Select your country..."
                  {...field}
                />
              )}
            </Field>
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
