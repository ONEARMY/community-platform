import { Heading, Box, Text, Flex, Grid, Paragraph } from 'theme-ui'
import { Button, ExternalLink } from 'oa-components'
import { Field } from 'react-final-form'
import { useTheme } from '@emotion/react'

import { FlexSectionContainer } from './elements'
import { getSupportedProfileTypes } from 'src/modules/profile'
import { CustomRadioField } from './Fields/CustomRadio.field'
import { buttons, headings, fields } from 'src/pages/UserSettings/labels'

import type { ProfileTypeLabel } from 'src/modules/profile/types'

const ProfileTypes = () => {
  const { description, error, title } = fields.activities
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
            <Heading variant="small">{headings.focus}</Heading>
          </Flex>
          <Box>
            <Paragraph my={4}>{title}</Paragraph>
            <Grid columns={['repeat(auto-fill, minmax(150px, 1fr))']} gap={2}>
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
