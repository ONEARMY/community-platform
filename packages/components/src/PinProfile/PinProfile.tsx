import { Box, Flex } from 'theme-ui'

import { Button } from '../Button/Button'
import { ButtonIcon } from '../ButtonIcon/ButtonIcon'
import { CardButton } from '../CardButton/CardButton'
import { CardProfile } from '../CardProfile/CardProfile'
import { InternalLink } from '../InternalLink/InternalLink'

import type { IMapPin } from 'oa-shared'

export interface IProps {
  item: IMapPin
  onClose: () => void
}

export const PinProfile = (props: IProps) => {
  const { item, onClose } = props
  const { creator } = item

  const isWorkspace = creator?.profileType && creator?.profileType !== 'member'

  return (
    <CardButton sx={{ '&:hover': 'none' }} data-cy="PinProfile">
      <Box sx={{ position: 'absolute', right: 0 }}>
        <Box sx={{ float: 'right', marginTop: 1, marginRight: '8px' }}>
          <ButtonIcon
            data-cy="PinProfileCloseButton"
            icon="close"
            onClick={() => onClose()}
            sx={{ borderWidth: 0, height: 'auto' }}
          />
        </Box>
      </Box>
      <Box sx={{ width: '100%', height: '100%', zIndex: 2 }}>
        <CardProfile item={item} isLink />

        {isWorkspace && creator?.isContactableByPublic !== false && (
          <Flex sx={{ justifyContent: 'flex-end' }}>
            <InternalLink
              to={`/u/${creator?._id}`}
              data-cy="PinProfileMessageLink"
              target="_blank"
            >
              <Button icon="contact" sx={{ margin: 1 }} small>
                Send Message
              </Button>
            </InternalLink>
          </Flex>
        )}
      </Box>
    </CardButton>
  )
}
