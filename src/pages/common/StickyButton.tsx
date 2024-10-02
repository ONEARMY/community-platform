import { useEffect, useState } from 'react'
import { useLocation } from '@remix-run/react'
import { Button, ExternalLink } from 'oa-components'
import { Box, Text } from 'theme-ui'

const FORM_URL =
  'https://onearmy.retool.com/form/c48a8f5a-4f53-4c58-adda-ef4f3cd8dee1'

export const StickyButton = () => {
  const location = useLocation()
  const [page, setPage] = useState<string>('')

  useEffect(() => {
    setPage(window.location.href)
  }, [location])

  const href = `${FORM_URL}#page=${page}`

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
          type="button"
          sx={{ display: ['none', 'inherit'] }}
          variant="primary"
          icon="update"
        >
          <Text>Report a Problem</Text>
        </Button>

        <Button
          type="button"
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
