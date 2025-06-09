import { Button, ElWithBeforeIcon } from 'oa-components'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { Box, Card, Flex, Heading } from 'theme-ui'

import type { ContentFormType } from 'oa-shared'

interface IProps {
  buttonLabel: string
  contentType: ContentFormType
  children: React.ReactNode
  guidelines?: React.ReactNode
  handleSubmit: () => void
  heading: string
  saveError: React.ReactNode | null
  sidebar?: React.ReactNode
  submitting: boolean
  unsavedChangesDialog?: React.ReactNode
  valid: boolean
}

export const FormWrapper = (props: IProps) => {
  const {
    buttonLabel,
    children,
    contentType,
    guidelines,
    handleSubmit,
    heading,
    saveError,
    sidebar,
    submitting,
    unsavedChangesDialog,
    valid,
  } = props
  return (
    <Flex sx={{ flexWrap: 'wrap', backgroundColor: 'inherit', marginTop: 4 }}>
      <Flex
        sx={{
          backgroundColor: 'inherit',
          px: 2,
          width: ['100%', '100%', `${(2 / 3) * 100}%`],
        }}
      >
        {unsavedChangesDialog}
        <Box
          as="form"
          id={`${contentType}Form`}
          sx={{ width: '100%' }}
          onSubmit={handleSubmit}
        >
          <Card sx={{ backgroundColor: 'softblue' }}>
            <Flex
              data-cy={`${contentType}-title`}
              sx={{ alignItems: 'center', paddingX: 3, paddingY: 2 }}
            >
              <Heading as="h1">{heading}</Heading>
              <Box ml="15px">
                <ElWithBeforeIcon icon={IconHeaderHowto} size={20} />
              </Box>
            </Flex>
          </Card>
          {guidelines && (
            <Box sx={{ marginX: '20px', display: ['block', 'block', 'none'] }}>
              {guidelines}
            </Box>
          )}
          <Card sx={{ marginTop: 4, padding: 4, overflow: 'visible' }}>
            {children}
          </Card>
        </Box>
      </Flex>
      <Flex
        sx={{
          flexDirection: 'column',
          height: '100%',
          px: 2,
          backgroundColor: 'inherit',
          maxWidth: ['inherit', 'inherit', '400px'],
          width: ['100%', '100%', `${100 / 3}%`],
          gap: 3,
        }}
      >
        {guidelines && (
          <Box sx={{ display: ['none', 'none', 'block'] }}>{guidelines}</Box>
        )}
        <Button
          large
          data-cy="submit"
          variant="primary"
          type="submit"
          disabled={submitting || !valid}
          onClick={handleSubmit}
          sx={{
            width: '100%',
            mb: ['40px', '40px', 0],
            display: 'block',
          }}
        >
          {buttonLabel}
        </Button>
        {sidebar && sidebar}
        {saveError && saveError}
      </Flex>
    </Flex>
  )
}
