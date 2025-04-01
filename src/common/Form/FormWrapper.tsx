import { Button, ElWithBeforeIcon } from 'oa-components'
import { Alert, Box, Card, Flex, Heading } from 'theme-ui'

interface IProps {
  buttonLabel: string
  children: React.ReactNode
  guidelines: React.ReactNode
  handleSubmit: () => void
  heading: string
  icon: string
  parentType: string
  saveError: string | null
  submitting: boolean
  valid: boolean
}

export const FormWrapper = (props: IProps) => {
  const {
    buttonLabel,
    children,
    guidelines,
    handleSubmit,
    heading,
    icon,
    parentType,
    saveError,
    submitting,
    valid,
  } = props
  return (
    <Flex sx={{ flexWrap: 'wrap', backgroundColor: 'inherit', mx: -2 }}>
      <Flex
        sx={{
          backgroundColor: 'inherit',
          px: 2,
          mt: 4,
          width: ['100%', '100%', `${(2 / 3) * 100}%`],
        }}
      >
        <Box
          as="form"
          id="newsForm"
          sx={{ width: '100%' }}
          onSubmit={handleSubmit}
        >
          <Card sx={{ backgroundColor: 'softblue' }}>
            <Flex
              data-cy={`news-${parentType}-title`}
              sx={{ alignItems: 'center', paddingX: 3, paddingY: 2 }}
            >
              <Heading as="h1">{heading}</Heading>
              <Box ml="15px">
                <ElWithBeforeIcon icon={icon} size={20} />
              </Box>
            </Flex>
          </Card>
          <Box sx={{ mt: '20px', display: ['block', 'block', 'none'] }}>
            {guidelines}
          </Box>
          <Card sx={{ marginTop: 4, padding: 4, overflow: 'visible' }}>
            {children}
          </Card>
        </Box>
      </Flex>
      <Flex
        sx={{
          flexDirection: 'column',
          width: ['100%', '100%', `${100 / 3}%`],
          height: '100%',
          px: 2,
          backgroundColor: 'inherit',
          mt: [0, 0, 4],
        }}
      >
        <Box
          sx={{
            top: 3,
            maxWidth: ['inherit', 'inherit', '400px'],
          }}
        >
          <Box sx={{ display: ['none', 'none', 'block'] }}>{guidelines}</Box>
          <Button
            large
            data-cy="submit"
            variant="primary"
            type="submit"
            disabled={submitting || !valid}
            onClick={handleSubmit}
            sx={{
              mt: 3,
              width: '100%',
              mb: ['40px', '40px', 0],
              display: 'block',
            }}
          >
            {buttonLabel}
          </Button>
          {saveError && (
            <Alert variant="failure" sx={{ mt: 3 }}>
              {saveError}
            </Alert>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}
