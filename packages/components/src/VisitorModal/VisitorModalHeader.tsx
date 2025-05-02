import { Flex } from 'theme-ui'

import { ButtonIcon } from '../ButtonIcon/ButtonIcon'

import type { DisplayData, HideProp } from './props'

type HeaderProps = HideProp & { data: DisplayData }

export const VisitorModalHeader = ({ hide, data }: HeaderProps) => (
  <Flex
    sx={{
      borderBottom: '1px solid',
      borderColor: '#999999',
      gap: 2,
      justifyContent: 'space-between',
      padding: 0,
      alignItems: 'anchor-center',
      paddingLeft: '16px',
    }}
  >
    <Flex sx={{ alignItems: 'center', columnGap: '5px' }}>
      {data.icon}
      {data.label}
    </Flex>
    <ButtonIcon
      data-cy="VisitorModal-CloseButton"
      icon="close"
      onClick={() => hide()}
      sx={{ border: 'none', paddingLeft: 2, paddingRight: 3 }}
    />
  </Flex>
)
