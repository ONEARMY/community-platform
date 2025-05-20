import { commonStyles } from 'oa-themes'
import { Flex } from 'theme-ui'

import { Button } from '../Button/Button'
import { Icon } from '../Icon/Icon'

import type { HideProp } from './props'

const ContactSpaceButton = ({ hide }: HideProp) => (
  <Button
    sx={{ margin: 1, width: '100%', justifyContent: 'center' }}
    onClick={() => hide('contact')}
  >
    {/* Not using native button icon to allow centralization together with text */}
    <Flex sx={{ gap: 1, alignItems: 'center' }}>
      <Icon glyph="contact" />
      Contact the space
    </Flex>
  </Button>
)

export const VisitorModalFooter = ({ hide }: HideProp) => (
  <Flex
    sx={{
      padding: 2,
      borderTop: '1px solid',
      borderColor: commonStyles.colors.darkGrey,
    }}
  >
    <ContactSpaceButton hide={hide} />
  </Flex>
)
