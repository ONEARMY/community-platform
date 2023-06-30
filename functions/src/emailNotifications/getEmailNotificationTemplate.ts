import { INotification, IUserDB, NotificationType } from '../../../src/models'
import {
  COMMENT_SECTION_IMAGE,
  COMMENT_SECTION_TEXT,
  USEFUL_SECTION_IMAGE,
  USEFUL_SECTION_TEXT,
} from './consts'
import prettier from 'prettier'
import {
  isCommentNotification,
  isMentionNotification,
  getCommentListItem,
  getMentionListItem,
  isUsefulNotification,
  getUsefulListItem,
  getProjectImageSrc,
  SITE_URL,
  getProjectName,
} from './utils'

enum NotificationEmailSection {
  COMMENTS = 'comments',
  USEFULS = 'usefuls',
}

interface NotificationEmailSectionConfig {
  sectionHeader: string
  sectionImage: string
  notificationFilterFunction: (n: INotification) => boolean
  getListItemFunction: (n: INotification) => string
}

const NOTIFICATION_EMAIL_SECTION_CONFIG: Record<
  NotificationEmailSection,
  NotificationEmailSectionConfig
> = {
  [NotificationEmailSection.COMMENTS]: {
    sectionHeader: COMMENT_SECTION_TEXT,
    sectionImage: COMMENT_SECTION_IMAGE,
    notificationFilterFunction: (n: INotification) =>
      isCommentNotification(n) || isMentionNotification(n),
    getListItemFunction: (n: INotification) =>
      isCommentNotification ? getCommentListItem(n) : getMentionListItem(n),
  },
  [NotificationEmailSection.USEFULS]: {
    sectionHeader: USEFUL_SECTION_TEXT,
    sectionImage: USEFUL_SECTION_IMAGE,
    notificationFilterFunction: isUsefulNotification,
    getListItemFunction: getUsefulListItem,
  },
}

const getNotificationEmailSection = (
  section: NotificationEmailSection,
  notifications: INotification[],
) => {
  const config = NOTIFICATION_EMAIL_SECTION_CONFIG[section]
  const sectionNotifications = notifications.filter(
    config.notificationFilterFunction,
  )
  return sectionNotifications.length
    ? `
  <div class='section-container'>
    <div class='section-header'>
      <img
          width='30'
          alt=''
          src='${config.sectionImage}'
      />
      ${config.sectionHeader}
    </div>
    <div class='section-items'>
        ${sectionNotifications.map(config.getListItemFunction).join('')}
    </div>  
  </div>
  `
    : ''
}
export const getEmailNotificationTemplate = (
  user: IUserDB,
  notifications: INotification[],
): { html: string; subject: string } => {
  return {
    html: prettier.format(
      `<html>
          <head>
              <style>
              body { font-family: arial, helvetica, sans-serif; font-size: 14px; color:
              #000000; padding: 8%; display: flex; flex-direction: column; gap: 40px; }
              a { color: #000000; } .image-container { align-self: center; }
              .section-header { font-size: 24px; display: flex; align-items: center;
              gap: 10px; } .notifications { align-self: center; }
              @media screen and (max-width: 480px) { body { font-size: 12px; }
              .section-header { font-size: 18px; } }
              </style>
          </head>
          <body>
              <div class='image-container'>
                  <img
                      width='144'
                      alt=''
                      src='${getProjectImageSrc()}'
                  />
              </div>
              <div class='greeting'>
                  <p>Hey ${user.displayName}</p>
                  <p>You've missed notifications. No worries.</p>
                  <p>I'm here to give you an overview :)</p>
              </div>
              ${Object.values(NotificationEmailSection)
                .map((section) =>
                  getNotificationEmailSection(section, notifications),
                )
                .join('')}
              <div class='notifications'>
                  Manage your notifications
                  <a href='${SITE_URL}/settings'> here</a>
              </div>
          </body>
      </html>`,
      { parser: 'html' },
    ),
    subject: `You've missed notifications from ${getProjectName()}`,
  }
}
