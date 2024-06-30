import { Flex } from 'theme-ui'

import { Alerts } from '../../../common/Alerts/Alerts'
import DevSiteHeader from '../DevSiteHeader/DevSiteHeader'
import GlobalSiteFooter from '../GlobalSiteFooter/GlobalSiteFooter'
import Header from '../Header/Header'

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
          sx={
            !ignoreMaxWidth
              ? {
                  // Base css for all the pages, except Map & Academy
                  position: 'relative',
                  maxWidth: 'container',
                  px: [2, 3, 4],
                  mx: 'auto',
                  my: 0,
                  flexDirection: 'column',
                  width: '100%',
                }
              : {
                  flexDirection: 'column',
                  width: '100%',
                }
          }
        >
          {props.children}
        </Flex>
      </Flex>
      <GlobalSiteFooter />
    </>
  )
}

export default Main
