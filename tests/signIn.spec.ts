import { test, expect } from '@playwright/test'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { randomUUID } from 'crypto'

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
  test('redirects to home page', async ({ page, context }) => {
    console.log(`Creates user:`)
    const DB_PREFIX = 'db_' + randomUUID()
    await TestDB.seedDB(DB_PREFIX)
    await context.addInitScript((args) => {
      console.log(`initScript`, window.location.hostname, { args })
      if (window.location.hostname === '127.0.0.1') {
        window.sessionStorage.setItem('DB_PREFIX', args)
        console.log(`Init script:`, {
          DB_PREFIX: window.sessionStorage.getItem('DB_PREFIX'),
        })
      }
    }, DB_PREFIX)
    await page.goto('/sign-in')

    const email = await page.$('input[name="email"]')
    email?.fill('demo_user@example.com')

    const password = await page.$('input[name="password"]')
    password?.fill('demo_user')

    const btn = await page.$('button[type="submit"]')
    await btn?.click()

    await page.waitForResponse((request) =>
      request.url().includes('/identitytoolkit/v3/relyingparty/getAccountInfo'),
    )

    // What else is happening here? Removing this timeout entirely introduces flakiness
    await page.waitForTimeout(250)

    await page.goto('/sign-in')

    await page.waitForURL('/')

    await expect(new URL(page.url()).pathname).toBe('/')
  })
})
