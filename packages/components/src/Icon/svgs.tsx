import loadingSVG from '../../assets/images/loading.svg'
import starSVG from '../../assets/icons/icon-star-default.svg'
import starActiveSVG from '../../assets/icons/icon-star-active.svg'

const imgStyle = {
  maxWidth: '100%',
}

export const iconMap = {
  loading: <img alt="icon" style={imgStyle} src={loadingSVG} />,
  star: <img alt="icon" style={imgStyle} src={starSVG} />,
  starActive: <img alt="icon" style={imgStyle} src={starActiveSVG} />,
}
