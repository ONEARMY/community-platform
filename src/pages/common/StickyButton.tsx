import { Button, ExternalLink } from 'oa-components'
import { Box, Text } from 'theme-ui'

const FORM_URL =
  'https://onearmy.retool.com/form/c48a8f5a-4f53-4c58-adda-ef4f3cd8dee1'

export const StickyButton = () => {
  const href = `${FORM_URL}#page=${window.location.href}`

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: [2, 5],
        right: [2, 5],
        display: 'block',
      }}
    >
      <ExternalLink href={href} data-cy="feedback">
        <Button
          sx={{ display: ['none', 'inherit'] }}
          variant="primary"
          icon="update"
        >
          <Text>Report a Problem</Text>
        </Button>

        <Button
          sx={{ display: ['inherit', 'none'] }}
          variant="primary"
          icon="update"
          small
        >
          <Text>Problem?</Text>
        </Button>
      </ExternalLink>
    </Box>
  )
}
