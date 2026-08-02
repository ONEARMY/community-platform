import React from 'react';
import accountSVG from '../../assets/icons/account.svg';
import approvedSVG from '../../assets/icons/approved.svg';
import attentionSVG from '../../assets/icons/attention.svg';
import chevronDownSVG from '../../assets/icons/chevron-down.svg';
import chevronLeftSVG from '../../assets/icons/chevron-left.svg';
import chevronRightSVG from '../../assets/icons/chevron-right.svg';
import chevronUpSVG from '../../assets/icons/chevron-up.svg';
import collaboratorSVG from '../../assets/icons/collaborator.svg';
import commentOutlineSVG from '../../assets/icons/comment-outline.svg';
import contactSVG from '../../assets/icons/contact.svg';
import copyLinkSVG from '../../assets/icons/copy-link.svg';
import closeSVG from '../../assets/icons/cross-close.svg';
import crossCloseModalSVG from '../../assets/icons/cross-close-modal.svg';
import declinedSVG from '../../assets/icons/declined.svg';
import deleteSVG from '../../assets/icons/delete.svg';
import discussionSVG from '../../assets/icons/discussion.svg';
import doubleArrowLeft from '../../assets/icons/double-arrow-left.svg';
import doubleArrowRight from '../../assets/icons/double-arrow-right.svg';
import doubleTickSVG from '../../assets/icons/double-tick.svg';
import editSVG from '../../assets/icons/edit.svg';
import emailSVG from '../../assets/icons/email.svg';
import emailOffSVG from '../../assets/icons/email-off.svg';
import emailStackSVG from '../../assets/icons/email-stack.svg';
import employeeSVG from '../../assets/icons/employee.svg';
import errorSVG from '../../assets/icons/error.svg';
import eyeSVG from '../../assets/icons/eye.svg';
import eyeCrossedSVG from '../../assets/icons/eye-crossed.svg';
import flagUnknownSVG from '../../assets/icons/flag-unknown.svg';
import hyperlinkSVG from '../../assets/icons/hyperlink.svg';
import arrowFullDownSVG from '../../assets/icons/icon-arrow-down.svg';
import arrowFullUpSVG from '../../assets/icons/icon-arrow-up.svg';
import bazarSVG from '../../assets/icons/icon-bazar.svg';
import commentSVG from '../../assets/icons/icon-comment.svg';
import difficultyLevel from '../../assets/icons/icon-difficulty-level.svg';
import emailOutlineSVG from '../../assets/icons/icon-email-outline.svg';
import libraySVG from '../../assets/icons/icon-library.svg';
import researchSVG from '../../assets/icons/icon-research.svg';
import searchSVG from '../../assets/icons/icon-search.svg';
import socialMediaSVG from '../../assets/icons/icon-social-media.svg';
import starActiveSVG from '../../assets/icons/icon-star-active.svg';
import starSVG from '../../assets/icons/icon-star-default.svg';
import updateSVG from '../../assets/icons/icon-update.svg';
import usefulSVG from '../../assets/icons/icon-useful.svg';
import verifiedSVG from '../../assets/icons/icon-verified-badge.svg';
import websiteSVG from '../../assets/icons/icon-website.svg';
import impactSVG from '../../assets/icons/impact.svg';
import infoSVG from '../../assets/icons/info.svg';
import informationSVG from '../../assets/icons/information.svg';
import loadingSVG from '../../assets/icons/loading.svg';
import mapSVG from '../../assets/icons/map.svg';
import globe from '../../assets/icons/map-globe.svg';
import gpsLocation from '../../assets/icons/map-gpsLocation.svg';
import megaphoneSVG from '../../assets/icons/megaphone.svg';
import megaphoneActiveSVG from '../../assets/icons/megaphone-active.svg';
import megaphoneInactiveSVG from '../../assets/icons/megaphone-inactive.svg';
import navAcademySVG from '../../assets/icons/nav-academy.svg';
import navLibrarySVG from '../../assets/icons/nav-library.svg';
import navLogoutSVG from '../../assets/icons/nav-logout.svg';
import navMapSVG from '../../assets/icons/nav-map.svg';
import navNotificationsSVG from '../../assets/icons/nav-notifications.svg';
import navNotificationsActiveSVG from '../../assets/icons/nav-notifications-active.svg';
import navProfileSVG from '../../assets/icons/nav-profile.svg';
import navProjectsSVG from '../../assets/icons/nav-projects.svg';
import navQuestionsSVG from '../../assets/icons/nav-questions.svg';
import navResearchSVG from '../../assets/icons/nav-research.svg';
import navSettingsSVG from '../../assets/icons/nav-settings.svg';
import navSupporterSVG from '../../assets/icons/nav-supporter.svg';
import navUpdatesSVG from '../../assets/icons/nav-updates.svg';
import newsSVG from '../../assets/icons/news.svg';
import paginationSingleLeftSVG from '../../assets/icons/pagination-arrow-left.svg';
import paginationSingleRightSVG from '../../assets/icons/pagination-arrow-right.svg';
import profileSVG from '../../assets/icons/profile.svg';
import replySVG from '../../assets/icons/reply.svg';
import replyOutlineSVG from '../../assets/icons/reply-outline.svg';
import reportSVG from '../../assets/icons/report.svg';
import revenueSVG from '../../assets/icons/revenue.svg';
import serviceEmailSVG from '../../assets/icons/service-email.svg';
import slidersSVG from '../../assets/icons/sliders.svg';
import stepSVG from '../../assets/icons/step.svg';
import successSVG from '../../assets/icons/success.svg';
import thunderboltSVG from '../../assets/icons/thunderbolt.svg';
import thunderboltGreySVG from '../../assets/icons/thunderbolt-grey.svg';
import visitorsAppointmentSVG from '../../assets/icons/visitors-appointment.svg';
import visitorsClosedSVG from '../../assets/icons/visitors-closed.svg';
import visitorsOpenSVG from '../../assets/icons/visitors-open.svg';
import volunteerSVG from '../../assets/icons/volunteer.svg';
import warningSVG from '../../assets/icons/warning.svg';
import { SupporterIcon } from './SupporterIcon';

const imgStyle = {
  maxWidth: '100%',
};
interface IProps {
  src: string;
  style?: React.CSSProperties;
}

const ImageIcon = (props: IProps) => {
  return <img alt="icon" {...props} style={{ ...imgStyle, ...props.style }} />;
};

export const iconMap = {
  approved: <ImageIcon src={approvedSVG} />,
  arrowFullDown: <ImageIcon src={arrowFullDownSVG} />,
  arrowFullUp: <ImageIcon src={arrowFullUpSVG} />,
  attention: <ImageIcon src={attentionSVG} />,
  account: <ImageIcon src={accountSVG} />,
  bazar: <ImageIcon src={bazarSVG} />,
  chevronDown: <ImageIcon src={chevronDownSVG} />,
  chevronLeft: <ImageIcon src={chevronLeftSVG} />,
  chevronRight: <ImageIcon src={chevronRightSVG} />,
  chevronUp: <ImageIcon src={chevronUpSVG} />,
  collaborator: <ImageIcon src={collaboratorSVG} />,
  close: <ImageIcon src={closeSVG} data-cy="close" />,
  crossCloseModal: <ImageIcon src={crossCloseModalSVG} data-cy="close-modal" />,
  comment: <ImageIcon src={commentSVG} />,
  commentOutline: <ImageIcon src={commentOutlineSVG} />,
  contact: <ImageIcon src={contactSVG} />,
  copyLink: <ImageIcon src={copyLinkSVG} />,
  declined: <ImageIcon src={declinedSVG} />,
  delete: <ImageIcon src={deleteSVG} />,
  difficultyLevel: <ImageIcon src={difficultyLevel} />,
  discussion: <ImageIcon src={discussionSVG} />,
  doubleTick: <ImageIcon src={doubleTickSVG} />,
  doubleArrowLeft: (
    <ImageIcon
      src={doubleArrowLeft}
      style={{
        maxWidth: 'none',
      }}
    />
  ),
  doubleArrowRight: (
    <ImageIcon
      src={doubleArrowRight}
      style={{
        maxWidth: 'none',
      }}
    />
  ),
  edit: <ImageIcon src={editSVG} />,
  email: <ImageIcon src={emailSVG} />,
  emailOff: <ImageIcon src={emailOffSVG} />,
  emailStack: <ImageIcon src={emailStackSVG} />,
  emailOutline: <ImageIcon src={emailOutlineSVG} />,
  employee: <ImageIcon src={employeeSVG} />,
  flagUnknown: <ImageIcon src={flagUnknownSVG} />,
  globe: <ImageIcon src={globe} />,
  gpsLocation: <ImageIcon src={gpsLocation} />,
  hide: <ImageIcon src={eyeCrossedSVG} />,
  hyperlink: <ImageIcon src={hyperlinkSVG} />,
  impact: <ImageIcon src={impactSVG} />,
  information: <ImageIcon src={informationSVG} />,
  loading: <ImageIcon src={loadingSVG} data-cy="icon-loading" />,
  library: <ImageIcon src={libraySVG} />,
  map: <ImageIcon src={mapSVG} />,
  megaphone: <ImageIcon src={megaphoneSVG} />,
  megaphoneActive: <ImageIcon src={megaphoneActiveSVG} />,
  megaphoneInactive: <ImageIcon src={megaphoneInactiveSVG} />,
  news: <ImageIcon src={newsSVG} />,
  paginationSingleLeft: (
    <ImageIcon
      src={paginationSingleLeftSVG}
      style={{
        maxWidth: 'none',
      }}
    />
  ),
  paginationSingleRight: (
    <ImageIcon
      src={paginationSingleRightSVG}
      style={{
        maxWidth: 'none',
      }}
    />
  ),
  profile: <ImageIcon src={profileSVG} />,
  reply: <ImageIcon src={replySVG} />,
  replyOutline: <ImageIcon src={replyOutlineSVG} />,
  report: <ImageIcon src={reportSVG} />,
  research: <ImageIcon src={researchSVG} />,
  revenue: <ImageIcon src={revenueSVG} />,
  search: <ImageIcon src={searchSVG} />,
  serviceEmail: <ImageIcon src={serviceEmailSVG} />,
  show: <ImageIcon src={eyeSVG} />,
  sliders: <ImageIcon src={slidersSVG} />,
  socialMedia: <ImageIcon src={socialMediaSVG} />,
  star: <ImageIcon src={starSVG} />,
  starActive: <ImageIcon src={starActiveSVG} />,
  step: <ImageIcon src={stepSVG} />,
  supporter: <SupporterIcon />,
  thunderbolt: <ImageIcon src={thunderboltSVG} />,
  thunderboltGrey: <ImageIcon src={thunderboltGreySVG} />,
  update: <ImageIcon src={updateSVG} />,
  useful: <ImageIcon src={usefulSVG} />,
  verified: <ImageIcon src={verifiedSVG} />,
  volunteer: <ImageIcon src={volunteerSVG} />,
  visitorsAppointment: <ImageIcon src={visitorsAppointmentSVG} />,
  visitorsClosed: <ImageIcon src={visitorsClosedSVG} />,
  visitorsOpen: <ImageIcon src={visitorsOpenSVG} />,
  website: <ImageIcon src={websiteSVG} />,
  success: <ImageIcon src={successSVG} />,
  error: <ImageIcon src={errorSVG} />,
  warning: <ImageIcon src={warningSVG} />,
  info: <ImageIcon src={infoSVG} />,
  navAcademy: <ImageIcon src={navAcademySVG} />,
  navLibrary: <ImageIcon src={navLibrarySVG} />,
  navLogout: <ImageIcon src={navLogoutSVG} />,
  navMap: <ImageIcon src={navMapSVG} />,
  navProfile: <ImageIcon src={navProfileSVG} />,
  navProjects: <ImageIcon src={navProjectsSVG} />,
  navQuestions: <ImageIcon src={navQuestionsSVG} />,
  navResearch: <ImageIcon src={navResearchSVG} />,
  navSettings: <ImageIcon src={navSettingsSVG} />,
  navSupporter: <ImageIcon src={navSupporterSVG} />,
  navUpdates: <ImageIcon src={navUpdatesSVG} />,
  navNotifications: <ImageIcon src={navNotificationsSVG} />,
  navNotificationsActive: <ImageIcon src={navNotificationsActiveSVG} />,
};
