import { Box } from 'theme-ui'
import checkmarkIcon from 'src/assets/icons/icon-checkmark.svg'

export interface ElWithBeforeIconProps {
  IconUrl: JSX.Element | string
  size?: string
  ticked?: boolean
  contain?: boolean
}

export const ElWithBeforeIcon: React.FC<ElWithBeforeIconProps> = ({
  IconUrl,
  size,
  children,
  ticked,
  contain,
}) => {
  let after: any
  if (ticked) {
    after = {
      content: "''",
      backgroundImage: `url("${checkmarkIcon}")`,
      width: size || '22px',
      height: size || '22px',
      backgroundRepeat: 'no-repeat',
      position: 'absolute',
      right: '0',
      bottom: '50%',
      transform: 'translateY(50%)',
    }
  }

  return (
    <Box
      pl="30px"
      sx={{
        position: 'relative',
        '::before': {
          content: "''",
          backgroundImage: `url("${IconUrl}")`,
          backgroundSize: contain ? 'contain' : 'initial',
          width: size,
          height: size,
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          left: '0',
          bottom: '50%',
          transform: 'translateY(50%)',
        },
        marginRight: 0,
        '::after': after,
      }}
    >
      {children}
    </Box>
  )
}
