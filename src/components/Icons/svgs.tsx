import loadingSVG from '../../assets/images/loading.svg'
import starSVG from '../../assets/icons/icon-star-default.svg'
import starActiveSVG from '../../assets/icons/icon-star-active.svg'

const imgStyle = {
  maxWidth: '100%',
}
const loading = <img alt="icon" style={imgStyle} src={loadingSVG} />
const star = <img alt="icon" style={imgStyle} src={starSVG} />
const starActive = <img alt="icon" style={imgStyle} src={starActiveSVG} />

export default {
  loading,
  star,
  starActive,
}
