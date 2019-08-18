import space from './space'
import colors from './colors'
import { css } from 'styled-components'
import LogoBackground from './assets/images/logo-background.svg'
import MenuCurrent from './assets/images/menu-current.svg'

const HeaderContainer = css`
  height: 60px;
  background-color: ${colors.white};
  justify-content: space-between;
  align-items: center;
`

const LogoContainer = css`
  height: 60px;
  align-items: center;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    background-image: url(${LogoBackground});
    width: 250px;
    height: 70px;
    z-index: 999;
    background-size: contain;
    background-repeat: no-repeat;
    top: 0;
    left: 0px;
  }
`

const LogoLink = css`
  z-index: 9999;
  display: flex;
  align-items: center;
  padding-left: 25px;
  color: black;
`

const LogoImage = css`
  width: 45px;
  height: 45px;
`

const LogoTitle = css`
  font-size: 17px;
  font-weight: 400;
  margin-left: ${space[3]}px;
`

const MenuDesktopContainer = css`
  padding: 0px ${space[3]};
`

const MenuDesktopItem = css`
  padding: 0px ${space[4]}px;
  color: ${colors.black};
  position: relative;
  > div {
    z-index: 1;
    position: relative;

    &:hover {
      opacity: 0.7;
    }
  }
`

const MenuDesktopItemCurrent = css`
  &:after {
    content: '';
    width: 70px;
    height: 20px;
    display: block;
    position: absolute;
    bottom: -6px;
    background-image: url(${MenuCurrent});
    z-index: 0;
    background-repeat: no-repeat;
    background-size: contain;
    left: 50%;
    transform: translateX(-50%);
  }
`

const maxWidthHeader = '100%'
const paddingsHeader = [space[2], space[3], space[4]]

const header = {
  maxWidth: maxWidthHeader,
  paddings: paddingsHeader,
  container: {
    style: HeaderContainer,
  },
  logo: {
    container: {
      style: LogoContainer,
    },
    link: {
      style: LogoLink,
    },
    image: {
      style: LogoImage,
    },
    title: {
      style: LogoTitle,
    },
  },

  menuDesktop: {
    container: {
      style: MenuDesktopContainer,
    },
    item: {
      style: MenuDesktopItem,
      current: {
        style: MenuDesktopItemCurrent,
      },
    },
  },

  menuMobile: {
    container: {
      style: { undefined },
    },
    item: {
      style: { undefined },
      current: {
        style: { undefined },
      },
    },
  },

  profile: {
    container: {
      style: { undefined },
    },
    avatar: {
      style: { undefined },
    },
  },
}

export default header
