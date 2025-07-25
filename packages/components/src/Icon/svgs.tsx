import accountSVG from '../../assets/icons/account.svg'
import approvedSVG from '../../assets/icons/approved.svg'
import arrowCurvedBottomRightSVG from '../../assets/icons/arrow-curved-bottom-right.svg'
import attentionSVG from '../../assets/icons/attention.svg'
import categorySVG from '../../assets/icons/category.svg'
import chevronDownSVG from '../../assets/icons/chevron-down.svg'
import chevronLeftSVG from '../../assets/icons/chevron-left.svg'
import chevronRightSVG from '../../assets/icons/chevron-right.svg'
import chevronUpSVG from '../../assets/icons/chevron-up.svg'
import collaboratorSVG from '../../assets/icons/collaborator.svg'
import constructionSVG from '../../assets/icons/construction.svg'
import contactSVG from '../../assets/icons/contact.svg'
import closeSVG from '../../assets/icons/cross-close.svg'
import declinedSVG from '../../assets/icons/declined.svg'
import deleteSVG from '../../assets/icons/delete.svg'
import discussionSVG from '../../assets/icons/discussion.svg'
import discussionFollowSVG from '../../assets/icons/discussion-follow.svg'
import discussionUnfollowSVG from '../../assets/icons/discussion-unfollow.svg'
import editSVG from '../../assets/icons/edit.svg'
import emailSVG from '../../assets/icons/email.svg'
import employeeSVG from '../../assets/icons/employee.svg'
import eyeSVG from '../../assets/icons/eye.svg'
import eyeCrossedSVG from '../../assets/icons/eye-crossed.svg'
import flagUnknownSVG from '../../assets/icons/flag-unknown.svg'
import foodSVG from '../../assets/icons/food.svg'
import fromTheTeamSVG from '../../assets/icons/from-the-team.svg'
import guidesSVG from '../../assets/icons/guides.svg'
import hyperlinkSVG from '../../assets/icons/hyperlink.svg'
import arrowFullDownSVG from '../../assets/icons/icon-arrow-down.svg'
import arrowFullUpSVG from '../../assets/icons/icon-arrow-up.svg'
import bazarSVG from '../../assets/icons/icon-bazar.svg'
import commentSVG from '../../assets/icons/icon-comment.svg'
import discordSVG from '../../assets/icons/icon-discord.svg'
import emailOutlineSVG from '../../assets/icons/icon-email-outline.svg'
import researchSVG from '../../assets/icons/icon-research.svg'
import searchSVG from '../../assets/icons/icon-search.svg'
import socialMediaSVG from '../../assets/icons/icon-social-media.svg'
import starActiveSVG from '../../assets/icons/icon-star-active.svg'
import starSVG from '../../assets/icons/icon-star-default.svg'
import updateSVG from '../../assets/icons/icon-update.svg'
import usefulSVG from '../../assets/icons/icon-useful.svg'
import verifiedSVG from '../../assets/icons/icon-verified-badge.svg'
import websiteSVG from '../../assets/icons/icon-website.svg'
import impactSVG from '../../assets/icons/impact.svg'
import informationSVG from '../../assets/icons/information.svg'
import landscapeSVG from '../../assets/icons/landscape.svg'
import machineSVG from '../../assets/icons/machine.svg'
import machinesSVG from '../../assets/icons/machines.svg'
import mapSVG from '../../assets/icons/map.svg'
import globe from '../../assets/icons/map-globe.svg'
import gpsLocation from '../../assets/icons/map-gpsLocation.svg'
import megaphoneSVG from '../../assets/icons/megaphone.svg'
import megaphoneActiveSVG from '../../assets/icons/megaphone-active.svg'
import megaphoneInactiveSVG from '../../assets/icons/megaphone-inactive.svg'
import mouldsSVG from '../../assets/icons/moulds.svg'
import otherSVG from '../../assets/icons/other.svg'
import patreonSVG from '../../assets/icons/patreon.svg'
import plasticSVG from '../../assets/icons/plastic.svg'
import productsSVG from '../../assets/icons/products.svg'
import profileSVG from '../../assets/icons/profile.svg'
import recyclingSVG from '../../assets/icons/recycling.svg'
import reportSVG from '../../assets/icons/report.svg'
import revenueSVG from '../../assets/icons/revenue.svg'
import slidersSVG from '../../assets/icons/sliders.svg'
import starterKitsSVG from '../../assets/icons/starter-kits.svg'
import stepSVG from '../../assets/icons/step.svg'
import supporterSVG from '../../assets/icons/supporter.svg'
import thunderboltSVG from '../../assets/icons/thunderbolt.svg'
import thunderboltGreySVG from '../../assets/icons/thunderbolt-grey.svg'
import utilitiesSVG from '../../assets/icons/utilities.svg'
import visitorsAppointmentSVG from '../../assets/icons/visitors-appointment.svg'
import visitorsClosedSVG from '../../assets/icons/visitors-closed.svg'
import visitorsOpenSVG from '../../assets/icons/visitors-open.svg'
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
  approved: <ImageIcon src={approvedSVG} />,
  arrowCurvedBottomRight: <ImageIcon src={arrowCurvedBottomRightSVG} />,
  arrowFullDown: <ImageIcon src={arrowFullDownSVG} />,
  arrowFullUp: <ImageIcon src={arrowFullUpSVG} />,
  attention: <ImageIcon src={attentionSVG} />,
  account: <ImageIcon src={accountSVG} />,
  bazar: <ImageIcon src={bazarSVG} />,
  category: <ImageIcon src={categorySVG} data-testid="category-icon" />,
  chevronDown: <ImageIcon src={chevronDownSVG} />,
  chevronLeft: <ImageIcon src={chevronLeftSVG} />,
  chevronRight: <ImageIcon src={chevronRightSVG} />,
  chevronUp: <ImageIcon src={chevronUpSVG} />,
  collaborator: <ImageIcon src={collaboratorSVG} />,
  close: <ImageIcon src={closeSVG} data-cy="close" />,
  comment: <ImageIcon src={commentSVG} />,
  construction: <ImageIcon src={constructionSVG} />,
  contact: <ImageIcon src={contactSVG} />,
  declined: <ImageIcon src={declinedSVG} />,
  delete: <ImageIcon src={deleteSVG} />,
  discord: <ImageIcon src={discordSVG} />,
  discussion: <ImageIcon src={discussionSVG} />,
  discussionFollow: <ImageIcon src={discussionFollowSVG} />,
  discussionUnfollow: <ImageIcon src={discussionUnfollowSVG} />,
  edit: <ImageIcon src={editSVG} />,
  email: <ImageIcon src={emailSVG} />,
  emailOutline: <ImageIcon src={emailOutlineSVG} />,
  employee: <ImageIcon src={employeeSVG} />,
  flagUnknown: <ImageIcon src={flagUnknownSVG} />,
  food: <ImageIcon src={foodSVG} />,
  fromTheTeam: <ImageIcon src={fromTheTeamSVG} />,
  globe: <ImageIcon src={globe} />,
  gpsLocation: <ImageIcon src={gpsLocation} />,
  guides: <ImageIcon src={guidesSVG} />,
  hide: <ImageIcon src={eyeCrossedSVG} />,
  hyperlink: <ImageIcon src={hyperlinkSVG} />,
  impact: <ImageIcon src={impactSVG} />,
  information: <ImageIcon src={informationSVG} />,
  landscape: <ImageIcon src={landscapeSVG} />,
  loading: <ImageIcon src={loadingSVG} data-cy="icon-loading" />,
  machine: <ImageIcon src={machineSVG} />,
  machines: <ImageIcon src={machinesSVG} />,
  map: <ImageIcon src={mapSVG} />,
  megaphone: <ImageIcon src={megaphoneSVG} />,
  megaphoneActive: <ImageIcon src={megaphoneActiveSVG} />,
  megaphoneInactive: <ImageIcon src={megaphoneInactiveSVG} />,
  moulds: <ImageIcon src={mouldsSVG} />,
  other: <ImageIcon src={otherSVG} />,
  patreon: <ImageIcon src={patreonSVG} />,
  plastic: <ImageIcon src={plasticSVG} />,
  profile: <ImageIcon src={profileSVG} />,
  products: <ImageIcon src={productsSVG} />,
  recycling: <ImageIcon src={recyclingSVG} />,
  report: <ImageIcon src={reportSVG} />,
  research: <ImageIcon src={researchSVG} />,
  revenue: <ImageIcon src={revenueSVG} />,
  search: <ImageIcon src={searchSVG} />,
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
  volunteer: <ImageIcon src={volunteerSVG} />,
  visitorsAppointment: <ImageIcon src={visitorsAppointmentSVG} />,
  visitorsClosed: <ImageIcon src={visitorsClosedSVG} />,
  visitorsOpen: <ImageIcon src={visitorsOpenSVG} />,
  website: <ImageIcon src={websiteSVG} />,
}
