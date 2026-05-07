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
  pwaIcons?: PWAIcons;

  constructor(obj: Partial<TenantSettings>) {
    Object.assign(this, obj);
  }
}

export interface PWAIcons {
  16: string;
  32: string;
  192: string;
  256: string;
  512: string;
}
