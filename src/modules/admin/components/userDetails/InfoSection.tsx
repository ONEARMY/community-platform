import { FieldInput, FieldTextarea } from 'oa-components'
import React from 'react'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { ProfileLinkField } from 'src/pages/Settings/content/formSections/Fields/Link.field'
import { CoverImages } from 'src/pages/Settings/content/formSections/UserInfos.section'
import { Box, Button, Flex, Text } from 'theme-ui'
import { required } from '../../../../utils/validators'
import type { IUserPP } from 'src/models'
import { STATUS_MOCKS } from 'src/mocks/Selectors'
import { SelectField } from 'src/components/Form/Select.field'
// import { IUserPP } from 'src/models'

type InfoProps = {
  userData: IUserPP
}

function InfoSection(props: InfoProps) {
  const isMemberProfile = props?.userData?.profileType === 'member'

  return (
    <Box>
      <Box sx={{ mt: 5 }}>
        <Text
          sx={{
            fontSize: 2,
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          Email *
        </Text>
        <Field
          data-cy="email"
          name="email"
          component={FieldInput}
          placeholder="Email Address"
          // validate={required}
          validateFields={[]}
        />
      </Box>
      <Box sx={{ mt: 5 }}>
        <Text
          sx={{
            fontSize: 2,
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          Display Name *
        </Text>
        <Field
          data-cy="username"
          name="displayName"
          component={FieldInput}
          placeholder="Pick a unique username"
          validate={required}
          validateFields={[]}
        />
      </Box>
      <Box sx={{ mt: 5 }}>
        <Text
          sx={{
            fontSize: 2,
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          Status *
        </Text>
        <Field
          data-cy={`select-link`}
          name={`label`}
          options={STATUS_MOCKS}
          component={SelectField}
          onCustomChange={(linkType: string) => console.log(linkType)}
          placeholder="Status"
          validate={required}
          validateFields={[]}
          style={{ width: '160px', height: '40px', marginRight: '8px' }}
        />
      </Box>
      <Box sx={{ mt: 5 }}>
        <Text
          sx={{
            fontSize: 2,
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          Roles *
        </Text>
        <Field
          data-cy="userRoles"
          name="userRoles"
          component={FieldInput}
          placeholder="Add user roles"
          validate={required}
          validateFields={[]}
        />
        <Box
          sx={{
            background: '#E2EDF7',
            width: '100%',
            mt: 2,
            px: 2,
            py: 2,
            borderRadius: 1,
          }}
        >
          <Text
            sx={{
              fontSize: 2,
              marginTop: 4,
              marginBottom: 4,
            }}
          >
            Enter a comma separated list of values. Available roles are: beta
            tester, verified, admin, and super admin
          </Text>
        </Box>
      </Box>
      <Box sx={{ mt: 5 }}>
        <Text
          sx={{
            fontSize: 2,
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          Description *
        </Text>
        <Field
          data-cy="info-description"
          name="about"
          component={FieldTextarea}
          placeholder="Describe in details what you do and who you are. Write in English otherwise your profile won't be approved."
          validate={required}
          validateFields={[]}
        />
      </Box>
      <Box sx={{ mt: 5 }}>
        <Flex sx={{ flexWrap: 'wrap' }}>
          <CoverImages
            isMemberProfile={isMemberProfile}
            coverImages={props.userData?.coverImages}
          />
        </Flex>
      </Box>
      <Box sx={{ mt: 5 }}>
        <>
          <Flex sx={{ alignItems: 'center', width: '100%', wrap: 'nowrap' }}>
            <Text mb={2} mt={7} sx={{ fontSize: 2 }}>
              Contacts & links *
            </Text>
          </Flex>
          <FieldArray name="links" initialValue={props?.userData?.links}>
            {({ fields }) => (
              <>
                {fields.map((name, i: number) => (
                  <>
                    <ProfileLinkField
                      key={name}
                      name={name}
                      onDelete={() => {
                        fields.remove(i)
                      }}
                      index={i}
                    />
                  </>
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
    </Box>
  )
}

export default InfoSection
