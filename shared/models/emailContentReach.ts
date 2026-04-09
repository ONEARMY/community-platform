import type { IDBDocSB, IDoc } from './document';

export class DBEmailContentReach implements IDBDocSB {
  id: number;
  created_at: Date;
  modified_at: Date | null;

  name: string;
  preferences_label: string;
  create_content_label: string;
  default_option: boolean;

  constructor(obj: any) {
    Object.assign(this, obj);
  }

  static toCreateCreateFormField(dbEmailContentReach: DBEmailContentReach) {
    return {
      value: dbEmailContentReach.id.toString(),
      label: dbEmailContentReach.create_content_label,
    };
  }

  static toNotificationsFormField(dbEmailContentReach: DBEmailContentReach) {
    return {
      value: dbEmailContentReach.id.toString(),
      label: dbEmailContentReach.preferences_label,
    };
  }
}

export class EmailContentReach implements IDoc {
  id: number;
  createdAt: Date;
  modifiedAt: Date | null;

  name: string;
  preferencesLabel: string;
  createContentLabel: string;
  defaultOption: boolean;

  constructor(obj: any) {
    Object.assign(this, obj);
  }

  static fromDB(dbEmailContentReach: DBEmailContentReach) {
    if (!dbEmailContentReach) {
      return null;
    }
    const {
      created_at,
      id,
      modified_at,
      name,
      preferences_label,
      create_content_label,
      default_option,
    } = dbEmailContentReach;

    return new EmailContentReach({
      id,
      createdAt: new Date(created_at),
      modifiedAt: modified_at ? new Date(modified_at) : null,
      name,
      preferencesLabel: preferences_label,
      createContentLabel: create_content_label,
      defaultOption: default_option,
    });
  }

  static toCreateCreateFormField(dbEmailContentReach: EmailContentReach) {
    return {
      value: dbEmailContentReach.id.toString(),
      label: dbEmailContentReach.createContentLabel,
    };
  }

  static toNotificationsFormField(dbEmailContentReach: EmailContentReach) {
    return {
      value: dbEmailContentReach.id.toString(),
      label: dbEmailContentReach.preferencesLabel,
    };
  }

  static findById(optionId: number | string, emailContentReachOptions: EmailContentReach[]) {
    return emailContentReachOptions.find(({ id }) => Number(optionId) === id) as EmailContentReach;
  }
}
