import type { INotification } from './notifications';

export enum UserRole {
  SUBSCRIBER = 'subscriber',
  ADMIN = 'admin',
  BETA_TESTER = 'beta-tester',
  RESEARCH_CREATOR = 'research_creator',
}

// Below are primarily used for PP

export type WorkspaceType = 'shredder' | 'sheetpress' | 'extrusion' | 'injection' | 'mix';

export interface IWorkspaceType {
  label: WorkspaceType;
  imageSrc?: string;
  textLabel: string;
  subText?: string;
}

export type UserMention = {
  username: string;
  location: string;
};

export const userVisitorPreferencePolicies = ['open', 'appointment', 'closed'] as const;

export type UserVisitorPreferencePolicy = (typeof userVisitorPreferencePolicies)[number];

export type UserVisitorPreference = {
  policy: UserVisitorPreferencePolicy;
  details?: string | null;
};

export interface IUserBadges {
  verified?: boolean;
  supporter?: boolean;
}

export interface IImpactDataField {
  id: string;
  value: number;
  isVisible: boolean;
}

export interface IUserImpact {
  [year: number]: IImpactDataField[];
}

export type IImpactYear = 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025;

export type INotificationUpdate = {
  _id: string;
  notifications?: INotification[];
};
