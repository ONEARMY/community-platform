import { Box, Flex } from 'theme-ui'

import { Button } from '../Button/Button'
import { ButtonIcon } from '../ButtonIcon/ButtonIcon'
import { CardButton } from '../CardButton/CardButton'
import { CardProfile } from '../CardProfile/CardProfile'
import { InternalLink } from '../InternalLink/InternalLink'

import type { MapListItem } from '../types/common'

export interface IProps {
  item: MapListItem
  onClose: () => void
}

export const PinProfile = (props: IProps) => {
  const { item, onClose } = props
  const { creator } = item

  const isMember = creator?.profileType === 'member'

  return (
    <CardButton sx={{ '&:hover': 'none' }} data-cy="PinProfile">
      <Box sx={{ position: 'absolute', width: '100%' }}>
        <Box sx={{ float: 'right', marginTop: 1, marginRight: 2 }}>
          <ButtonIcon
            data-cy="PinProfileCloseButton"
            icon="close"
            onClick={() => onClose()}
            sx={{ borderWidth: 0, height: 'auto' }}
          />
        </Box>
      </Box>

      <CardProfile item={item} />

      {!isMember && creator?.isContactableByPublic && (
        <Flex sx={{ justifyContent: 'flex-end' }}>
          <InternalLink
            to={`/u/${creator._id}`}
            data-cy="PinProfileMessageLink"
          >
            <Button icon="contact" sx={{ margin: 1 }} small>
              Send Message
            </Button>
          </InternalLink>
        </Flex>
      )}
    </CardButton>
  )
}
