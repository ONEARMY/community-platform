export type SelectValue = { label: string; value: string }

export interface TenantSettings {
  siteName: string
  siteUrl: string
  messageSignOff: string
  emailFrom: string
  siteImage: string
}

export type UserEmailData = {
  email: string
  code: string
  new_email?: string
  user_metadata: {
    username: string
  }
}
