import { INotification, IUserDB } from '../../../src/models'
import { NOTIFICATION_LIST_IMAGE } from './consts'
import prettier from 'prettier'
import {
  getProjectImageSrc,
  SITE_URL,
  getProjectName,
  getNotificationListItem,
} from './utils'

export const getNotificationEmailTemplate = (
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
              <div class='section-container'>
                <div class='section-header'>
                  <img
                      width='30'
                      alt=''
                      src='${NOTIFICATION_LIST_IMAGE}'
                  />
                  Missed Notifications
                </div>
                <div class='section-items'>
                    ${notifications.map(getNotificationListItem).join('')}
                </div>  
              </div>
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
