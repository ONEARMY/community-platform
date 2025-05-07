import { commonStyles } from 'oa-themes'
import { Flex } from 'theme-ui'

import { ButtonIcon } from '../ButtonIcon/ButtonIcon'

import type { DisplayData, HideProp } from './props'

type HeaderProps = HideProp & { data: DisplayData }

export const VisitorModalHeader = ({ hide, data }: HeaderProps) => (
  <Flex
    sx={{
      borderBottom: '1px solid',
      borderColor: commonStyles.colors.darkGrey,
      gap: 2,
      justifyContent: 'space-between',
      padding: 0,
      alignItems: 'anchor-center',
      paddingLeft: 2,
    }}
  >
    <Flex sx={{ alignItems: 'center', columnGap: 1 }}>
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
