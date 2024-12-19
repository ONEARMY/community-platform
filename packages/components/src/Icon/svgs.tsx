import accountSVG from '../../assets/icons/account.svg'
import arrowCurvedBottomRightSVG from '../../assets/icons/arrow-curved-bottom-right.svg'
import categorySVG from '../../assets/icons/category.svg'
import chevronDownSVG from '../../assets/icons/chevron-down.svg'
import chevronLeftSVG from '../../assets/icons/chevron-left.svg'
import chevronRightSVG from '../../assets/icons/chevron-right.svg'
import chevronUpSVG from '../../assets/icons/chevron-up.svg'
import constructionSVG from '../../assets/icons/construction.svg'
import contactSVG from '../../assets/icons/contact.svg'
import closeSVG from '../../assets/icons/cross-close.svg'
import deleteSVG from '../../assets/icons/delete.svg'
import employeeSVG from '../../assets/icons/employee.svg'
import eyeSVG from '../../assets/icons/eye.svg'
import eyeCrossedSVG from '../../assets/icons/eye-crossed.svg'
import flagUnknownSVG from '../../assets/icons/flag-unknown.svg'
import foodSVG from '../../assets/icons/food.svg'
import guidesSVG from '../../assets/icons/guides.svg'
import hyperlinkSVG from '../../assets/icons/hyperlink.svg'
import arrowFullDownSVG from '../../assets/icons/icon-arrow-down.svg'
import arrowFullUpSVG from '../../assets/icons/icon-arrow-up.svg'
import bazarSVG from '../../assets/icons/icon-bazar.svg'
import commentSVG from '../../assets/icons/icon-comment.svg'
import discordSVG from '../../assets/icons/icon-discord.svg'
import emailOutlineSVG from '../../assets/icons/icon-email.svg'
import searchSVG from '../../assets/icons/icon-search.svg'
import socialMediaSVG from '../../assets/icons/icon-social-media.svg'
import starActiveSVG from '../../assets/icons/icon-star-active.svg'
import starSVG from '../../assets/icons/icon-star-default.svg'
import updateSVG from '../../assets/icons/icon-update.svg'
import usefulSVG from '../../assets/icons/icon-useful.svg'
import verifiedSVG from '../../assets/icons/icon-verified-badge.svg'
import viewSVG from '../../assets/icons/icon-views.svg'
import websiteSVG from '../../assets/icons/icon-website.svg'
import impactSVG from '../../assets/icons/impact.svg'
import landscapeSVG from '../../assets/icons/landscape.svg'
import machineSVG from '../../assets/icons/machine.svg'
import machinesSVG from '../../assets/icons/machines.svg'
import mapSVG from '../../assets/icons/map.svg'
import globe from '../../assets/icons/map-globe.svg'
import gpsLocation from '../../assets/icons/map-gpsLocation.svg'
import mouldsSVG from '../../assets/icons/moulds.svg'
import otherSVG from '../../assets/icons/other.svg'
import patreonSVG from '../../assets/icons/patreon.svg'
import plasticSVG from '../../assets/icons/plastic.svg'
import productsSVG from '../../assets/icons/products.svg'
import profileSVG from '../../assets/icons/profile.svg'
import revenueSVG from '../../assets/icons/revenue.svg'
import slidersSVG from '../../assets/icons/sliders.svg'
import starterKitsSVG from '../../assets/icons/starter-kits.svg'
import stepSVG from '../../assets/icons/step.svg'
import supporterSVG from '../../assets/icons/supporter.svg'
import thunderboltSVG from '../../assets/icons/thunderbolt.svg'
import thunderboltGreySVG from '../../assets/icons/thunderbolt-grey.svg'
import utilitiesSVG from '../../assets/icons/utilities.svg'
import volunteerSVG from '../../assets/icons/volunteer.svg'
import loadingSVG from '../../assets/images/loading.svg'

const imgStyle = {
  maxWidth: '100%',
}
interface IProps {
  src: string
}

const ImageIcon = (props: IProps) => {
  return <img alt="icon" style={imgStyle} {...props} />
}

export const iconMap = {
  arrowCurvedBottomRight: <ImageIcon src={arrowCurvedBottomRightSVG} />,
  arrowFullDown: <ImageIcon src={arrowFullDownSVG} />,
  arrowFullUp: <ImageIcon src={arrowFullUpSVG} />,
  account: <ImageIcon src={accountSVG} />,
  bazar: <ImageIcon src={bazarSVG} />,
  category: <ImageIcon src={categorySVG} data-testid="category-icon" />,
  chevronDown: <ImageIcon src={chevronDownSVG} />,
  chevronLeft: <ImageIcon src={chevronLeftSVG} />,
  chevronRight: <ImageIcon src={chevronRightSVG} />,
  chevronUp: <ImageIcon src={chevronUpSVG} />,
  close: <ImageIcon src={closeSVG} data-cy="close" />,
  comment: <ImageIcon src={commentSVG} />,
  construction: <ImageIcon src={constructionSVG} />,
  contact: <ImageIcon src={contactSVG} />,
  delete: <ImageIcon src={deleteSVG} />,
  discord: <ImageIcon src={discordSVG} />,
  emailOutline: <ImageIcon src={emailOutlineSVG} />,
  employee: <ImageIcon src={employeeSVG} />,
  flagUnknown: <ImageIcon src={flagUnknownSVG} />,
  food: <ImageIcon src={foodSVG} />,
  guides: <ImageIcon src={guidesSVG} />,
  hide: <ImageIcon src={eyeCrossedSVG} />,
  hyperlink: <ImageIcon src={hyperlinkSVG} />,
  impact: <ImageIcon src={impactSVG} />,
  landscape: <ImageIcon src={landscapeSVG} />,
  loading: <ImageIcon src={loadingSVG} data-cy="icon-loading" />,
  machine: <ImageIcon src={machineSVG} />,
  machines: <ImageIcon src={machinesSVG} />,
  map: <ImageIcon src={mapSVG} />,
  moulds: <ImageIcon src={mouldsSVG} />,
  other: <ImageIcon src={otherSVG} />,
  patreon: <ImageIcon src={patreonSVG} />,
  plastic: <ImageIcon src={plasticSVG} />,
  profile: <ImageIcon src={profileSVG} />,
  products: <ImageIcon src={productsSVG} />,
  revenue: <ImageIcon src={revenueSVG} />,
  show: <ImageIcon src={eyeSVG} />,
  sliders: <ImageIcon src={slidersSVG} />,
  socialMedia: <ImageIcon src={socialMediaSVG} />,
  star: <ImageIcon src={starSVG} />,
  starActive: <ImageIcon src={starActiveSVG} />,
  starterKits: <ImageIcon src={starterKitsSVG} />,
  step: <ImageIcon src={stepSVG} />,
  supporter: <ImageIcon src={supporterSVG} />,
  thunderbolt: <ImageIcon src={thunderboltSVG} />,
  thunderboltGrey: <ImageIcon src={thunderboltGreySVG} />,
  update: <ImageIcon src={updateSVG} />,
  useful: <ImageIcon src={usefulSVG} />,
  utilities: <ImageIcon src={utilitiesSVG} />,
  verified: <ImageIcon src={verifiedSVG} />,
  view: <ImageIcon src={viewSVG} />,
  volunteer: <ImageIcon src={volunteerSVG} />,
  website: <ImageIcon src={websiteSVG} />,
  search: <ImageIcon src={searchSVG} />,
  globe: <ImageIcon src={globe}></ImageIcon>,
  gpsLocation: <ImageIcon src={gpsLocation}></ImageIcon>,
}
