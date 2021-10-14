import { Link } from 'rebass/styled-components'
import ImageTargetBlank from 'src/assets/icons/link-target-blank.svg'

export const LinkTargetBlank = props => (
  <Link
    {...props}
    target="_blank"
    sx={{
      paddingRight: '30px',
      position: 'relative',
      '::after': {
        content: "''",
        backgroundImage: `url("${ImageTargetBlank}")`,
        width: '20px',
        height: '20px',
        zIndex: `${props => props.theme.zIndex.level}`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        top: '-5px',
        right: '0px',
      },
    }}
  />
)
