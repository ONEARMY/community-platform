import React from 'react'

import styled from '@emotion/styled'
import { MessageSettings } from '../models/messageSettings'

const EmailContainer = styled.table`
  width: 100%;
  border: 0;
`

const Border = styled.div`
  border: 3px solid black;
  border-radius: 10px;
  padding: 4% 0;
  margin: 4% 0;
  width: 550px;
`

const SettingsTableContainer = styled.table`
  margin-bottom: 8%;
`

const ProjectImageTableContainer = styled.table`
  margin-bottom: 8%;
`

const GreetingContainer = styled.div`
  margin-left: 8%;
  margin-right: 8%;
`

type LayoutArgs = {
  children: React.ReactNode
  settings: MessageSettings
}

export default function Layout({ children, settings }: LayoutArgs) {
  return (
    <EmailContainer className="email-table-container">
      <tbody>
        <tr>
          <td align="center">
            <Border className="border">
              <ProjectImageTableContainer className="project-image-table-container">
                <tbody>
                  <tr>
                    <td align="center">
                      <img
                        width="144"
                        alt={settings.siteName}
                        src={settings.siteImage}
                      />
                    </td>
                  </tr>
                </tbody>
              </ProjectImageTableContainer>
              <GreetingContainer className="greeting-container">
                {children}
                <p>
                  Cheers,
                  <br />
                  {settings.messageSignOff}
                </p>
              </GreetingContainer>
            </Border>
            <SettingsTableContainer className="settings-table-container">
              <tbody>
                <tr>
                  <td align="center">
                    <div>
                      Manage your notifications
                      <a href={settings.siteUrl + '/settings/notifications'}>
                        here
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </SettingsTableContainer>
          </td>
        </tr>
      </tbody>
    </EmailContainer>
  )
}
