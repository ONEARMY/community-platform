import { IMPACT_YEARS } from 'src/pages/User/impact/constants'
import { ImpactYearSection } from 'src/pages/UserSettings/content/sections/ImpactYear.section'
import { fields } from 'src/pages/UserSettings/labels'
import { Box, Flex, Heading, Text } from 'theme-ui'

export const SettingsPageImpact = () => {
  const { description, title } = fields.impact

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 1 }}>
        <Heading as="h2">{title}</Heading>
        <Text variant="quiet">{description}</Text>
      </Flex>

      <Box>
        {IMPACT_YEARS.map((year) => {
          return <ImpactYearSection year={year} key={year} />
        })}
      </Box>
    </Flex>
  )
}
