import { INotification, IUserDB } from '../../../src/models'
import { NOTIFICATION_LIST_IMAGE } from './constants'
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
      `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
          <style>
            #body {
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              color: #000000;
              padding: 8%;
              width: 600px;
            }
            #body a {
              color: inherit;
            }
            table {
              width: 100%;
              border: 0;
            }
            .settings-table-container,
            .project-image-table-container,
            .greeting-container,
            .notifications-container {
              margin-bottom: 8%;
            }
            .notifications-header {
              font-size: 24px;
            }
            .notifications-header-icon {
              margin-right: 8px;
            }
            @media screen and (max-width: 480px) {
              #body {
                width: 100%
              }
            }
          </style>
        </head>
        <body id="body">
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
          <div class="greeting-container">
            <p>Hey ${user.displayName}</p>
            <p>You've missed notifications. No worries.</p>
            <p>I'm here to give you an overview :)</p>
          </div>
          <div class="notifications-container">
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
        </body>
      </html>`,
      { parser: 'html' },
    ),
    subject: `You've missed notifications from ${getProjectName()}`,
  }
}
