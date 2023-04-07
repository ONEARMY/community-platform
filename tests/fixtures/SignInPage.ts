import type { Page } from '@playwright/test'

export class SignInPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  public async withEmailAndPassword(email: string, password: string) {
    await this.page.goto('/sign-in')

    const emailElement = await this.page.$('input[name="email"]')
    emailElement?.fill(email)

    const passwordElement = await this.page.$('input[name="password"]')
    passwordElement?.fill(password)

    const btn = await this.page.$('button[type="submit"]')
    await btn?.click()

    await this.page.waitForResponse((request) =>
      request.url().includes('/identitytoolkit/v3/relyingparty/getAccountInfo'),
    )

    // What else is happening here? Removing this timeout entirely introduces flakiness
    await this.page.waitForTimeout(250)

    return this.page
  }
}
