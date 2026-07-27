export interface IUserSignUpDetails {
  username: string;
  email: string;
  password: string;
}

export enum Page {
  HOWTO = '/library',
  ACADEMY = '/academy',
  SETTINGS = '/settings',
}

export const generateAlphaNumeric = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export enum DbCollectionName {
  users = 'users',
  howtos = 'howtos',
}

export const generateNewUserDetails = (): IUserSignUpDetails => {
  const username = `CI_${generateAlphaNumeric(9)}`.toLocaleLowerCase();
  const tenantId = Cypress.env('TENANT_ID');
  return {
    username,
    email: `delivered+${username}+${tenantId}@resend.dev`.toLocaleLowerCase(),
    password: 'test1234',
  };
};

/**
 * Transforms a mock user to include the tenant ID in their email
 * Use this when you need to reference user data that matches what's in the database
 * @example
 * const user = getTenantUser(users.admin)
 * cy.signIn(user.email, user.password)
 */
export const getTenantUser = <T extends { email: string }>(user: T): T => {
  const tenantId = Cypress.env('TENANT_ID');
  const tenantAwareEmail = user.email.includes(`+${tenantId}@`)
    ? user.email
    : user.email.replace('@', `+${tenantId}@`);
  
  return {
    ...user,
    email: tenantAwareEmail,
  };
};
