import { Heading, Box, Text, Flex } from 'theme-ui'
import { FlexSectionContainer } from './elements'
import { Button, ExternalLink } from 'oa-components'
import type { ProfileTypeLabel } from 'src/modules/profile'
import { getSupportedProfileTypes } from 'src/modules/profile'
import { CustomRadioField } from './Fields/CustomRadio.field'
import { Field } from 'react-final-form'
import { useTheme } from '@emotion/react'

function ProfileTypes() {
  const theme = useTheme()
  const profileTypes = getSupportedProfileTypes().filter(({ label }) =>
    Object.keys(theme.badges).includes(label),
  )

  return (
    <Field
      name="profileType"
      render={(props) => (
        <FlexSectionContainer>
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Heading variant="small">Focus</Heading>
          </Flex>
          <Box>
            <Text my={4}>What is your main {theme.name} activity?</Text>
            <Flex sx={{ flexWrap: ['wrap', 'wrap', 'nowrap'] }}>
              {profileTypes.map((profile, index: number) => (
                <Box key={index} sx={{ width: `20%` }}>
                  <CustomRadioField
                    data-cy={profile.label}
                    value={profile.label}
                    name="profileType"
                    isSelected={profile.label === props.input.value}
                    onChange={(v) =>
                      props.input.onChange(v as ProfileTypeLabel)
                    }
                    imageSrc={
                      theme.badges[profile.label]?.normal || profile.imageSrc
                    }
                    textLabel={profile.textLabel}
                  />
                </Box>
              ))}
            </Flex>
            <Flex sx={{ flexWrap: 'wrap', alignItems: 'center' }} mt={4}>
              <Text my={2}>Not sure about your focus ?</Text>
              <ExternalLink href={theme.profileGuidelinesURL}>
                <Button ml={[1, 2, 2]} variant="outline" data-cy="go-to">
                  Check out our guidelines
                </Button>
              </ExternalLink>
            </Flex>
            {props.meta.error && (
              <Text color={theme.colors.red}>Please select a focus</Text>
            )}
          </Box>
        </FlexSectionContainer>
      )}
    />
  )
}

export function FocusSection() {
  return <Field name="profileType" render={ProfileTypes} />
}
