import { Flex } from 'theme-ui'

import type { FlexProps } from 'theme-ui'

interface ILayoutProps {
  ignoreMaxWidth?: boolean
}

type IProps = FlexProps & ILayoutProps

const Main = (props: IProps) => {
  // avoid passing custom props
  const { ignoreMaxWidth, ...rest } = props

  return (
    <Flex {...rest} sx={{ flexDirection: 'column' }}>
      <Flex
        className="main-container"
        sx={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          ...(!ignoreMaxWidth && {
            // Base css for all the pages, except Map & Academy
            position: 'relative',
            maxWidth: 'container',
            px: [2, 3, 4],
            mx: 'auto',
            my: 0,
          }),
          ...(ignoreMaxWidth && {
            margin: '0',
            padding: '0',
          }),
        }}
      >
        {props.children}
      </Flex>
    </Flex>
  )
}

export default Main
