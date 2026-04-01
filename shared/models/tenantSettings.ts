import { UserRole } from './user';

export class TenantSettings {
  siteName: string;
  siteDescription: string;
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
  colorPrimary: string;
  colorPrimaryHover: string;
  colorAccent: string;
  colorAccentHover: string;
  showImpact: boolean;
  createResearchRoles: UserRole[];
  gaTrackingId: string;

  constructor(obj: Partial<TenantSettings>) {
    Object.assign(this, obj);
  }
}
