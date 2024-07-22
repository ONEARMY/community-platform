import { Alerts } from 'src/common/Alerts/Alerts'
import DevSiteHeader from 'src/pages/common/DevSiteHeader/DevSiteHeader'
import GlobalSiteFooter from 'src/pages/common/GlobalSiteFooter/GlobalSiteFooter'
import Header from 'src/pages/common/Header/Header'
import { Flex } from 'theme-ui'

import type { CSSObject, FlexProps } from 'theme-ui'

interface ILayoutProps {
  ignoreMaxWidth?: boolean
  customStyles?: CSSObject
}

type IProps = FlexProps & ILayoutProps

const Main = (props: IProps) => {
  // avoid passing custom props
  const { ignoreMaxWidth, customStyles, ...rest } = props
  return (
    <>
      <DevSiteHeader />
      <Alerts />
      <Header />
      <Flex {...rest} sx={{ flexDirection: 'column' }}>
        <Flex
          className="main-container"
          css={customStyles}
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
          }}
        >
          {props.children}
        </Flex>
      </Flex>
      <GlobalSiteFooter />
    </>
  )
}

export default Main
