import loadingSVG from '../../assets/images/loading.svg'
import starSVG from '../../assets/icons/icon-star-default.svg'
import starActiveSVG from '../../assets/icons/icon-star-active.svg'
import verifiedSVG from '../../assets/icons/icon-verified-badge.svg'
import usefulSVG from '../../assets/icons/icon-useful.svg'
import commentSVG from '../../assets/icons/icon-comment.svg'
import viewSVG from '../../assets/icons/icon-views.svg'

const imgStyle = {
  maxWidth: '100%',
}

export const iconMap = {
  loading: <img alt="icon" style={imgStyle} src={loadingSVG} />,
  star: <img alt="icon" style={imgStyle} src={starSVG} />,
  starActive: <img alt="icon" style={imgStyle} src={starActiveSVG} />,
  verified: <img alt="icon" style={imgStyle} src={verifiedSVG} />,
  useful: <img alt="icon" style={imgStyle} src={usefulSVG} />,
  comment: <img alt="icon" style={imgStyle} src={commentSVG} />,
  view: <img alt="icon" style={imgStyle} src={viewSVG} />,
}
