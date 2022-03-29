import { FunctionComponent } from 'react';
import { Box } from 'theme-ui'
import checkmarkIcon from 'src/assets/icons/icon-checkmark.svg'

interface IProps {
  IconUrl: JSX.Element | string
  height?: string
  width?: string
  ticked?: boolean
  contain?: boolean
}

export const ElWithBeforeIcon: FunctionComponent<IProps> = ({
  IconUrl,
  height,
  width,
  children,
  ticked,
  contain,
}) => {
  let after: any
  if (ticked) {
    after = {
      content: "''",
      backgroundImage: `url("${checkmarkIcon}")`,
      width: width || '22px',
      height: height || '22px',
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
          width: width || '22px',
          height: height || '22px',
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

export default ElWithBeforeIcon
