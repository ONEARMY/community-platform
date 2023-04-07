import { test as base } from '@playwright/test'
import { SignInPage } from '../fixtures/SignInPage'

type MyFixtures = {
  signIn: SignInPage
}

export const test = base.extend<MyFixtures>({
  signIn: async ({ page }, use) => {
    // Setup the fixture.
    const signInPage = new SignInPage(page)

    // Expose the fixture value here for the test.
    await use(signInPage)

    // Clean up after the test.
  },
})

export { expect } from '@playwright/test'
