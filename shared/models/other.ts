export type SelectValue = { label: string; value: string };

export class TenantSettings {
  siteName: string;
  siteUrl: string;
  messageSignOff: string;
  emailFrom: string;
  siteImage: string;
  noMessaging: boolean;
  libraryHeading: string;
  academyResource: string;
  profileGuidelines: string;
  questionsGuidelines: string;
  supportedModules: string;
  patreonId: string;

  constructor(obj: Partial<TenantSettings>) {
    Object.assign(this, obj);
  }
}

export type UserEmailData = {
  email: string;
  code: string;
  new_email?: string;
  user_metadata: {
    username: string;
  };
};
