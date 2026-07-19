export class DBOrganisationSignupSettings {
  id: number;
  description: string;
  image_url: string | null;

  constructor(obj: Partial<DBOrganisationSignupSettings>) {
    Object.assign(this, obj);
  }
}

export class OrganisationSignupSettings {
  id: number;
  description: string;
  imageUrl: string | null;

  constructor(obj: Partial<OrganisationSignupSettings>) {
    Object.assign(this, obj);
  }

  static fromDB(value: DBOrganisationSignupSettings) {
    return new OrganisationSignupSettings({
      id: value.id,
      description: value.description,
      imageUrl: value.image_url,
    });
  }
}
