export enum Page {
  HOWTO = '/how-to',
  ACADEMY = '/academy',
  SETTINGS = '/settings',
}

export const generateAlphaNumeric = (length: number) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export enum DbCollectionName {
  users = 'users',
  howtos = 'howtos',
}

export const fillSignupForm = (user) => {
  const { username, email, password } = user

  cy.get('[data-cy=username]').clear().type(username)
  cy.get('[data-cy=email]').clear().type(email)
  cy.get('[data-cy=password]').clear().type(password)
  cy.get('[data-cy=confirm-password]').clear().type(password)
  cy.get('[data-cy=consent]').check()
}

export const signUpNewUser = (newUser?) => {
  const user = newUser || generateNewUserDetails()

  cy.step(`Sign up new user - ${user.username}`)
  cy.visit('/sign-up')
  fillSignupForm(user)
  cy.get('[data-cy=submit]').click()
  cy.url().should('include', 'sign-up-message')
}

export const generateNewUserDetails = () => {
  return {
    username: `CI_${generateAlphaNumeric(5)}`.toLocaleLowerCase(),
    email: `CI_${generateAlphaNumeric(5)}@test.com`.toLocaleLowerCase(),
    password: 'test1234',
  }
}
