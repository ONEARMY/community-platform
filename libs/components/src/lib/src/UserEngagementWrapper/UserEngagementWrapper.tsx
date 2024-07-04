import { Flex } from 'theme-ui'

import whiteBubble from '../../assets/images/white-bubble_1.svg'

export interface Props {
  children: React.ReactNode
}

export const UserEngagementWrapper = ({ children }: Props) => {
  return (
    <Flex
      sx={{
        backgroundImage: `url("${whiteBubble}")`,
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: ['150% auto', '125% auto', '80% auto'],
        flexDirection: 'column',
        marginTop: [1, 2, 4],
        paddingBottom: [1, 1, 8],
        paddingTop: [4, 5, 6],
      }}
    >
      {children}
    </Flex>
  )
}
