import { useNavigate } from 'react-router-dom'
import { Button, Icon, Modal } from 'oa-components'
import { Box, Flex, Heading, Text } from 'theme-ui'

export interface IUploadStatus {
  Start: boolean
  Complete: boolean
}

interface IProps {
  title: string
  status: IUploadStatus
  url?: string
  buttonLabel: string
  onClose: () => void
}
export const SubmitStatusModal = ({
  title,
  status,
  url,
  onClose,
  buttonLabel,
}: IProps) => {
  return (
    <Modal isOpen={status.Start}>
      <Header title={title} onClose={onClose} />
      <UploadingSteps status={status} />
      {url && (
        <BackButton
          label={buttonLabel}
          url={url}
          isComplete={status.Complete}
          onClose={onClose}
        />
      )}
    </Modal>
  )
}

interface HeaderProps {
  title: string
  onClose: () => void
}
const Header = ({ title, onClose }: HeaderProps) => {
  return (
    <Flex sx={{ justifyContent: 'space-between' }}>
      <Heading as="p" variant="small" sx={{ textAlign: 'center' }}>
        {title}
      </Heading>
      <Icon glyph={'close'} onClick={onClose} />
    </Flex>
  )
}

const UploadingSteps = ({ status }: { status: IUploadStatus }) => {
  return (
    <Box margin="15px 0" p={0}>
      {Object.keys(status).map((key) => (
        <Flex p={0} sx={{ alignItems: 'center' }} key={key}>
          <Icon marginRight="4px" glyph={status[key] ? 'check' : 'loading'} />
          <Text>| {key}</Text>
        </Flex>
      ))}
    </Box>
  )
}

interface BackButtonProps {
  label: string
  url: string
  isComplete: boolean
  onClose: () => void
}
const BackButton = ({ label, url, isComplete, onClose }: BackButtonProps) => {
  const navigate = useNavigate()

  return (
    <Button
      data-cy={isComplete ? 'view-research' : ''}
      disabled={!isComplete}
      variant={!isComplete ? 'disabled' : 'outline'}
      icon="arrow-forward"
      onClick={() => {
        navigate(url)
        onClose()
      }}
    >
      {label}
    </Button>
  )
}
