import { Field } from 'react-final-form'
import { useTheme } from '@emotion/react'
import { Button, ExternalLink } from 'oa-components'
import { getSupportedProfileTypes } from 'src/modules/profile'
import { buttons, fields, headings } from 'src/pages/UserSettings/labels'
import { Box, Flex, Grid, Heading, Paragraph, Text } from 'theme-ui'

import { CustomRadioField } from './Fields/CustomRadio.field'
import { FlexSectionContainer } from './elements'

import type { ProfileTypeLabel } from 'src/modules/profile/types'

const ProfileTypes = () => {
  const { description, error, title } = fields.activities
  const theme = useTheme()
  const profileTypes = getSupportedProfileTypes().filter(({ label }) =>
    Object.keys(theme.badges).includes(label),
  )

  if (profileTypes.length < 2) {
    return null
  }

  return (
    <Field
      name="profileType"
      render={(props) => (
        <FlexSectionContainer>
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Heading as="h2" variant="small">
              {headings.focus}
            </Heading>
          </Flex>
          <Box>
            <Paragraph my={4}>{title}</Paragraph>
            <Grid columns={['repeat(auto-fill, minmax(125px, 1fr))']} gap={2}>
              {profileTypes.map((profile, index: number) => (
                <Box key={index}>
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
            </Grid>
            <Flex sx={{ flexWrap: 'wrap', alignItems: 'center' }} mt={4}>
              <Text my={2}>{description}</Text>
              <ExternalLink href={theme.profileGuidelinesURL}>
                <Button ml={[1, 2, 2]} variant="outline" data-cy="go-to">
                  {buttons.guidelines}
                </Button>
              </ExternalLink>
            </Flex>
            {props.meta.error && <Text color={theme.colors.red}>{error}</Text>}
          </Box>
        </FlexSectionContainer>
      )}
    />
  )
}

export const FocusSection = () => (
  <Field name="profileType" render={ProfileTypes} />
)
