import { IHowtoDB, IMapPin, INotification, IUserDB } from '../../../src/models'
import { NOTIFICATION_LIST_IMAGE } from './constants'
import prettier from 'prettier'
import {
  getProjectImageSrc,
  SITE_URL,
  getProjectName,
  getNotificationListItem,
  getProjectSignoff,
} from './utils'
import { getEmailHtml } from './templates/index'

export interface Email {
  html: string
  subject: string
}

export const getEmailTemplate = (styles: string, content: string) =>
  prettier.format(
    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <style>
          #body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            color: #000000;
          }
          #body a {
            color: inherit;
          }
          .border {
            border: 3px solid black;
            border-radius: 10px;
            padding: 4% 0;
            margin: 4% 0;
            width: 550px;
          }
          table {
            width: 100%;
            border: 0;
          }
          .settings-table-container,
          .project-image-table-container {
            margin-bottom: 8%;
          }
          ${styles}
          @media only screen and (max-width: 550px) {
            .table-container {
              width: 100%;
            }
          }
        </style>
      </head>
      <body id="body">
      <table class="email-table-container">
      <tr>
        <td align="center">
          <div class="border">
            <table class="project-image-table-container">
              <tr>
                <td align="center">
                  <img
                    width="144"
                    alt=""
                    src="${getProjectImageSrc()}"
                  />
                </td>
              </tr>
            </table>
            ${content}
          </div>
          <table class="settings-table-container">
            <tr>
              <td align="center">
                <div class="notifications">
                  Manage your notifications
                  <a href="${SITE_URL}/settings"> here</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      </table>
      </body>
    </html>`,
    { parser: 'html' },
  )

export const getNotificationEmail = (
  user: IUserDB,
  notifications: INotification[],
): Email => {
  const styles = `
    .greeting-container {
      margin-bottom: 8%;
    }
    .greeting-container,
    .notifications-container {
      margin-left: 8%;
    }
    .notifications-header {
      font-size: 24px;
    }
    .notifications-header-icon {
      margin-right: 8px;
    }
  `
  const content = `
    <div align="left" class="greeting-container">
      <p>Hey ${user.displayName}</p>
      <p>You've missed notifications. No worries.</p>
      <p>I'm here to give you an overview :)</p>
    </div>
    <div align="left" class="notifications-container">
      <div class="notifications-header">
        <img
          class="notifications-header-icon"
          width="30"
          height="24"
          alt=""
          src="${NOTIFICATION_LIST_IMAGE}"
        />
        Missed Notifications
      </div>
      ${notifications.map(getNotificationListItem).join('')}
    </div>
  `
  return {
    html: getEmailTemplate(styles, content),
    subject: `You've missed notifications from ${getProjectName()}`,
  }
}

export const HOW_TO_APPROVAL_SUBJECT = 'Your how-to has been approved!'
export const getHowToApprovalEmail = (
  user: IUserDB,
  resource: IHowtoDB,
): Email => {
  const styles = `
  .greeting-container,
  .main-container {
    margin-bottom: 8%;
  }
  .greeting-container,
  .main-container,
  .closing-containter {
    margin-left: 8%;
  }`

  const content = `
  <div align="left" class="greeting-container">
    <p>Hey ${user.displayName}</p>
    <p>Huzzah! Your How-To ${resource.title} has been approved.</p>
  </div>
  <div align="left" class="main-container">
    <p>It is visible on the community platform <a href="${SITE_URL}/how-to/${
    resource.slug
  }">here</a>.</p>
    <p>Users are now be able to comment and mark it as useful.</p>
  </div>
  <div align="left" class="closing-containter">
    <p>Thanks for sharing your knowledge!</p>
    <p>${getProjectSignoff()}</p>
  </div>`
  return {
    html: getEmailTemplate(styles, content),
    subject: HOW_TO_APPROVAL_SUBJECT,
  }
}

export const MAP_PIN_APPROVAL_SUBJECT = 'Your map pin has been approved!'
export const getMapPinApprovalEmail = (
  user: IUserDB,
  resource: IMapPin,
): Email => {
  const styles = `
  .greeting-container,
  .main-container {
    margin-bottom: 8%;
  }
  .greeting-container,
  .main-container,
  .closing-containter {
    margin-left: 8%;
    margin-right: 8%;
  }`

  const content = `
  <div align="left" class="greeting-container">
    <p>Hey ${user.displayName}</p>
    <p>Huzzah! We are happy to inform you that your map pin has been approved and is now visible!</p>
  </div>
  <div align="left" class="main-container">
    <p>It is visible on the community platform map <a href="${SITE_URL}/map#${
    resource._id
  }">here</a>.</p>
  </div>
  <div align="left" class="closing-containter">
    <p>Thanks,</p>
    <p>${getProjectSignoff()}</p>
  </div>`
  return {
    html: getEmailTemplate(styles, content),
    subject: MAP_PIN_APPROVAL_SUBJECT,
  }
}

export const HOW_TO_SUBMISSION_SUBJECT = 'Your how-to has been submitted'
export const getHowToSubmissionEmail = (
  user: IUserDB,
  resource: IHowtoDB,
): Email => {
  const styles = `
  .greeting-container,
  .main-container {
    margin-bottom: 8%;
  }
  .greeting-container,
  .main-container,
  .closing-containter {
    margin-left: 8%;
    margin-right: 8%;
  }`

  const content = `
  <div align="left" class="greeting-container">
    <p>Hey ${user.displayName}</p>
    <p>Huzzah! Your How-To ${resource.title} has been submitted.</p>
  </div>
  <div align="left" class="main-container">
    <p>Our team is currently reviewing it and will get back to you within a few business days.</p>
    <p>Thank you for taking the time, the community will benefit from this knowledge and more plastic will be recycled thanks to YOU.</p>
  </div>
  <div align="left" class="closing-containter">
    <p>Cheers,</p>
    <p>${getProjectSignoff()}</p>
  </div>`
  return {
    html: getEmailTemplate(styles, content),
    subject: HOW_TO_SUBMISSION_SUBJECT,
  }
}

export const MAP_PIN_SUBMISSION_SUBJECT = 'Your map pin has been submitted'
export const getMapPinSubmissionEmail = (
  user: IUserDB,
  resource: IMapPin,
): Email => {
  const styles = `
  .greeting-container,
  .main-container {
    margin-bottom: 8%;
  }
  .greeting-container,
  .main-container,
  .closing-containter {
    margin-left: 8%;
    margin-right: 8%;
  }`

  const content = `
  <div align="left" class="greeting-container">
    <p>Hey ${user.displayName}</p>
    <p>Your map pin has been submitted.</p>
  </div>
  <div align="left" class="main-container">
    <p>Our team is currently reviewing it and will get back to you within a few business days.</p>
  </div>
  <div align="left" class="closing-containter">
    <p>Cheers,</p>
    <p>${getProjectSignoff()}</p>
  </div>`
  return {
    html: getEmailTemplate(styles, content),
    subject: MAP_PIN_SUBMISSION_SUBJECT,
  }
}

const site = {
  name: getProjectName(),
  url: SITE_URL,
  image: getProjectImageSrc(),
  signOff: getProjectSignoff(),
}

export const getUserSupporterBadgeAddedEmail = (user: IUserDB): Email => ({
  subject: `${user.displayName} - Your ${site.name} Supporter Badge!`,
  html: getEmailHtml('supporter-badge-added', { user, site }),
})

export const getUserSupporterBadgeRemovedEmail = (user: IUserDB): Email => ({
  subject: `${site.name} Supporter - We are sad to see you go.`,
  html: getEmailHtml('supporter-badge-removed', {
    user,
    site,
  }),
})

export const getUserVerifiedBadgeAddedEmail = (user: IUserDB): Email => ({
  subject: `${user.displayName} - You are now part of the Verified Workspaces :)`,
  html: getEmailHtml('verified-badge-added', { user, site }),
})

export const HOW_TO_REJECTED_SUBJECT = 'Your how-to has been rejected'
export const getHowToRejectedEmail = (
  user: IUserDB,
  howto: IHowtoDB,
): Email => ({
  subject: HOW_TO_REJECTED_SUBJECT,
  html: getEmailHtml('how-to-rejected', {
    user,
    howto,
    site,
  }),
})

export const MAP_PIN_REJECTED_SUBJECT = 'Your map pin has been rejected'
export const getMapPinRejectedEmail = (user: IUserDB): Email => ({
  subject: MAP_PIN_REJECTED_SUBJECT,
  html: getEmailHtml('map-pin-rejected', {
    user,
    site,
  }),
})

export const HOW_TO_NEEDS_IMPROVEMENTS_SUBJECT =
  'Your how-to needs improvements'
export const getHowToNeedsImprovementsEmail = (
  user: IUserDB,
  howto: IHowtoDB,
): Email => ({
  subject: HOW_TO_NEEDS_IMPROVEMENTS_SUBJECT,
  html: getEmailHtml('how-to-needs-improvements', {
    user,
    howto,
    site,
  }),
})

export const MAP_PIN_NEEDS_IMPROVEMENTS_SUBJECT =
  'Your map pin needs improvements'
export const getMapPinNeedsImprovementsEmail = (
  user: IUserDB,
  mapPin: IMapPin,
): Email => ({
  subject: MAP_PIN_NEEDS_IMPROVEMENTS_SUBJECT,
  html: getEmailHtml('map-pin-needs-improvements', {
    user,
    mapPin,
    site,
  }),
})
