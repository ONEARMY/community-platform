import { test, expect } from './support'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { randomUUID } from 'crypto'
import { setDatabasePrefix } from './support/setDatabasePrefix'

test.describe('[Sign in]', () => {
  test('[By Anonymous] can go to the sign-up page', async ({ page }) => {
    await page.goto('/sign-in')

    await page.getByText("Don't have an account?").click()

    await expect(page.url()).toContain('/sign-up')
    await expect(page.getByText('Create an account')).toBeVisible()
  })

  test('[By Anonymous] Lost Password requires email', async ({ page }) => {
    await page.goto('/sign-in')

    await page.getByText('Lost password?').click()

    await expect(page.getByText('Please provide a valid email')).toBeVisible()
  })

  test('[By Anonymous] Lost Password cannot sent a reset link on wrong email', async ({
    page,
  }) => {
    await page.goto('/sign-in')

    const input = await page.$('input[name="email"]')
    input?.fill('what_is_mypassword@test.com')

    await page.getByText('Lost password?').click()

    await expect(page.getByText('No account found, typo maybe?')).toBeVisible()
  })
})

test.describe('[User]', () => {
  test('redirects to home page', async ({ page, context, signIn }) => {
    const DB_PREFIX = 'db_' + randomUUID()
    await TestDB.seedDB(DB_PREFIX, ['users'])
    await context.addInitScript(setDatabasePrefix, DB_PREFIX)

    // Signin
    await signIn.withEmailAndPassword('demo_user@example.com', 'demo_user')

    await page.goto('/sign-in')

    await page.waitForURL('/')

    await expect(new URL(page.url()).pathname).toBe('/')
  })
})
