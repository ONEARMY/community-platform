import { Flex } from 'theme-ui'

import whiteBubble from '../../assets/images/white-bubble_1.svg'

interface Props {
  children: React.ReactNode
}

export const UserEngagementWrapper = ({ children }: Props) => {
  return (
    <Flex
      sx={{
        backgroundImage: `url("${whiteBubble}")`,
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: ['contain', 'contain', '80% auto'],
        flexDirection: 'column',
        marginTop: 4,
        paddingBottom: 5,
        paddingTop: 5,
      }}
    >
      {children}
    </Flex>
  )
}
