import { Flex, FlexProps } from 'rebass/styled-components'
import { CSSObject } from '@styled-system/css'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/App'
import type { ThemeStore } from 'src/stores/Theme/theme.store'

interface ILayoutProps {
  ignoreMaxWidth?: boolean
  customStyles?: CSSObject
  themeStore?: ThemeStore
}

type IProps = FlexProps & ILayoutProps

const Main = observer((props: IProps) => {
  const theme = useCommonStores().stores.themeStore.currentTheme.styles
  return (
    <Flex {...(props as any)} flexDirection="column">
      <Flex
        width="100%"
        flexDirection="column"
        className="main-container"
        css={props.customStyles}
        sx={
          !props.ignoreMaxWidth
            ? {
                // Base css for all the pages, except Map & Academy
                position: 'relative',
                maxWidth: theme.maxContainerWidth,
                px: [2, 3, 4],
                mx: 'auto',
                my: 0,
              }
            : {}
        }
      >
        {props.children}
      </Flex>
    </Flex>
  )
})

export default Main
