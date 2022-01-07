import loadingSVG from '../../assets/images/loading.svg'
import starSVG from '../../assets/icons/icon-star-default.svg'
import starActiveSVG from '../../assets/icons/icon-star-active.svg'
import githubSVG from '../../assets/icons/icon-github.svg'

const imgStyle = {
  maxWidth: '100%',
}

const iconMap = {
  loading: <img alt="icon" style={imgStyle} src={loadingSVG} />,
  star: <img alt="icon" style={imgStyle} src={starSVG} />,
  starActive: <img alt="icon" style={imgStyle} src={starActiveSVG} />,
  github: <img alt="icon" style={imgStyle} src={githubSVG} />,
}

export default iconMap
