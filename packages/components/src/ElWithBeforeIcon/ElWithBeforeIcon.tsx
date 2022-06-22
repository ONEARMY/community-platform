import type { ThemeUIStyleObject } from 'theme-ui'
import { Box } from 'theme-ui'
import checkmarkIcon from 'src/assets/icons/icon-checkmark.svg'

export interface ElWithBeforeIconProps {
  icon: JSX.Element | string
  size?: string
  ticked?: boolean
  contain?: boolean
}

const DEFAULT_ICON_SIZE = '22px'

export const ElWithBeforeIcon: React.FC<ElWithBeforeIconProps> = ({
  icon,
  size,
  children,
  ticked,
  contain,
}) => {
  let after: ThemeUIStyleObject = {}

  if (ticked) {
    after = {
      content: "''",
      position: 'absolute',
      right: '0',
      bottom: '50%',
      transform: 'translateY(50%)',

      width: size || DEFAULT_ICON_SIZE,
      height: size || DEFAULT_ICON_SIZE,

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

          width: size || DEFAULT_ICON_SIZE,
          height: size || DEFAULT_ICON_SIZE,

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
