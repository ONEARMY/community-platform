import { useTheme } from '@emotion/react'
import { ExternalLink, Guidelines } from 'oa-components'
import { DISCORD_INVITE_URL } from 'src/constants'

export const ProfileGuidelines = () => {
  const theme = useTheme()

  return (
    <Guidelines
      title="Profile tips"
      steps={[
        <>
          Have a look at our{' '}
          <ExternalLink href={theme.profileGuidelinesURL}>
            profile guidelines.
          </ExternalLink>
        </>,
        <>Choose your focus.</>,
        <>
          If you want to get a pin on the map check our{' '}
          <ExternalLink href={theme.communityProgramURL}>
            Community Program.
          </ExternalLink>
        </>,
        <>Add a nice description, pics and details.</>,
        <>
          If something doesn't work,{' '}
          <ExternalLink href={DISCORD_INVITE_URL}>let us know.</ExternalLink>
        </>,
      ]}
    />
  )
}
