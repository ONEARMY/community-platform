export interface Email {
  html: string
  subject: string
}

// export const MAP_PIN_APPROVAL_SUBJECT = 'Your map pin has been approved!'
// export const getMapPinApprovalEmail = (
//   user: IUserDB,
//   mapPin: IMapPin,
// ): Email => {
//   return {
//     html: getEmailHtml('map-pin-approval', { user, mapPin, site }),
//     subject: MAP_PIN_APPROVAL_SUBJECT,
//   }
// }

// export const MAP_PIN_SUBMISSION_SUBJECT = 'Your map pin has been submitted'
// export const getMapPinSubmissionEmail = (
//   user: IUserDB,
//   mapPin: IMapPin,
// ): Email => {
//   return {
//     html: getEmailHtml('map-pin-submission', { user, mapPin, site }),
//     subject: MAP_PIN_SUBMISSION_SUBJECT,
//   }
// }

// export const getUserSupporterBadgeAddedEmail = (user: IUserDB): Email => ({
//   subject: `${user.displayName} - Your ${site.name} Supporter Badge!`,
//   html: getEmailHtml('supporter-badge-added', { user, site }),
// })

// export const getUserSupporterBadgeRemovedEmail = (user: IUserDB): Email => ({
//   subject: `${site.name} Supporter - We are sad to see you go.`,
//   html: getEmailHtml('supporter-badge-removed', {
//     user,
//     site,
//   }),
// })

// export const getUserVerifiedBadgeAddedEmail = (user: IUserDB): Email => ({
//   subject: `${user.displayName} - You are now part of the Verified Workspaces :)`,
//   html: getEmailHtml('verified-badge-added', { user, site }),
// })

// export const MAP_PIN_REJECTED_SUBJECT = 'Your map pin has been rejected'
// export const getMapPinRejectedEmail = (user: IUserDB): Email => ({
//   subject: MAP_PIN_REJECTED_SUBJECT,
//   html: getEmailHtml('map-pin-rejected', {
//     user,
//     site,
//   }),
// })

// export const MAP_PIN_NEEDS_IMPROVEMENTS_SUBJECT =
//   'Your map pin needs improvements'
// export const getMapPinNeedsImprovementsEmail = (
//   user: IUserDB,
//   mapPin: IMapPin,
// ): Email => ({
//   subject: MAP_PIN_NEEDS_IMPROVEMENTS_SUBJECT,
//   html: getEmailHtml('map-pin-needs-improvements', {
//     user,
//     mapPin,
//     site,
//   }),
// })
