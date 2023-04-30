import type { ThemeUIStyleObject } from 'theme-ui'
import { Box } from 'theme-ui'
import checkmarkIcon from '../../assets/icons/icon-checkmark.svg'

export interface ElWithBeforeIconProps {
  children?: React.ReactNode
  icon: JSX.Element | string
  size?: number
  ticked?: boolean
  contain?: boolean
}

const DEFAULT_ICON_SIZE = 22

export const ElWithBeforeIcon = ({
  icon,
  size,
  children,
  ticked,
  contain,
}: ElWithBeforeIconProps) => {
  let after: ThemeUIStyleObject = {}

  const iconSize = size || DEFAULT_ICON_SIZE

  if (ticked) {
    after = {
      content: "''",
      position: 'absolute',
      right: '0',
      bottom: '50%',
      transform: 'translateY(50%)',

      width: iconSize,
      height: iconSize,

      backgroundImage: `url("${checkmarkIcon}")`,
      backgroundRepeat: 'no-repeat',
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        pl: '30px',
        marginRight: 0,
        '::after': after,
        '::before': {
          content: "''",
          position: 'absolute',
          left: '0',
          bottom: '50%',
          transform: 'translateY(50%)',

          width: iconSize,
          height: iconSize,

          backgroundRepeat: 'no-repeat',
          backgroundImage: `url("${icon}")`,
          backgroundSize: contain ? 'contain' : 'initial',
        },
      }}
    >
      {children}
    </Box>
  )
}
