import { Flex, Text } from 'theme-ui'

import { Icon } from '../Icon/Icon'
import { Tooltip } from '../Tooltip/Tooltip'

export interface IProps {
  onClick?: () => void
  isLoggedIn?: boolean
}

export const DownloadButton = ({ onClick, isLoggedIn }: IProps) => {
  return (
    <>
      <Flex
        p={2}
        mb={1}
        sx={{
          background: 'accent.base',
          border: '2px solid black',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          maxWidth: '300px',
          borderRadius: 1,
          cursor: 'pointer',
        }}
        onClick={onClick}
        data-cy="downloadButton"
        data-testid="downloadButton"
        data-tip={!isLoggedIn ? 'Login to download' : ''}
      >
        <Icon size={24} glyph={'external-url'} mr={3} />
        <Text sx={{ flex: 1, fontSize: 1, color: 'black' }} mr={3}>
          Download files
        </Text>
      </Flex>
      <Tooltip />
    </>
  )
}
