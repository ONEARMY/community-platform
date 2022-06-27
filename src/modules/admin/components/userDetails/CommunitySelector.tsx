import React from 'react'
import { Box, Flex, Text } from 'theme-ui'
import { CustomRadioField } from 'src/pages/Settings/content/formSections/Fields/CustomRadio.field'
import { Field } from 'react-final-form'
import { getSupportedProfileTypes } from 'src/modules/profile'
import type { ProfileTypeLabel } from 'src/modules/profile'
import { useTheme } from '@emotion/react'

function TypesRenderer() {
  const theme = useTheme()
  const profileTypes = getSupportedProfileTypes().filter(({ label }) =>
    Object.keys(theme.badges).includes(label),
  )
  return (
    <Field
      name="profileType"
      render={(props) => (
        <Box>
          <Flex sx={{ flexWrap: ['wrap', 'wrap', 'nowrap'] }}>
            {profileTypes.map((profile, index: number) => (
              <Box key={index} sx={{ width: `20%` }}>
                <CustomRadioField
                  data-cy={profile.label}
                  value={profile.label}
                  name="profileType"
                  isSelected={profile.label === props.input.value}
                  onChange={(v) => props.input.onChange(v as ProfileTypeLabel)}
                  imageSrc={
                    theme.badges[profile.label]?.normal || profile.imageSrc
                  }
                  textLabel={profile.textLabel}
                />
              </Box>
            ))}
          </Flex>
          {props.meta.error && (
            <Text color={theme.colors.red}>Please select a focus</Text>
          )}
        </Box>
      )}
    />
  )
}

function CommunitySelector() {
  return (
    <Box>
      <Text my={4}>User Type*</Text>
      <Field name="profileType" render={TypesRenderer} />
    </Box>
  )
}

export default CommunitySelector
