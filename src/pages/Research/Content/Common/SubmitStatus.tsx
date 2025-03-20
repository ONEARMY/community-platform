import { useNavigate } from '@remix-run/react'
import { Button, Icon, Modal } from 'oa-components'
import { Flex, Heading } from 'theme-ui'

interface IProps {
  isOpen: boolean
  slug: string
  complete: boolean
  type: 'Research' | 'Research Update'
  onClose: () => void
}

export const SubmitStatus = (props: IProps) => {
  const navigate = useNavigate()

  return (
    <Modal isOpen={props.isOpen}>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Heading as="p" variant="small" sx={{ textAlign: 'center' }}>
          Saving {props.type}
        </Heading>
        <Icon glyph="close" onClick={() => props.onClose()} />
      </Flex>
      {props.slug ? (
        <Button
          type="button"
          data-cy={props.complete ? 'view' : ''}
          disabled={!props.complete}
          variant={!props.complete ? 'disabled' : 'outline'}
          icon="arrow-forward"
          onClick={() => {
            navigate(props.slug)
            props.onClose()
          }}
        >
          View {props.type}
        </Button>
      ) : null}
    </Modal>
  )
}
