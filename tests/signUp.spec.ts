import { test, expect } from '@playwright/test'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { randomUUID } from 'crypto'
import { FRIENDLY_MESSAGES } from 'oa-shared'

test.describe('[Sign Up]', () => {
  test('prevent duplicate username', async ({ page, context }) => {
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

    await page.goto('/sign-up')

    const username = await page.$('input[name="displayName"]')
    username?.fill('demo_user')

    const email = await page.$('input[name="email"]')
    email?.fill('demo_user_001@example.com')

    const password = await page.$('input[name="password"]')
    password?.fill('demo_user')

    const confirmPassword = await page.$('input[name="confirm-password"]')
    confirmPassword?.fill('demo_user')

    const checkbox = await page.$('input[name="consent"]')
    checkbox?.check()

    const btn = await page.$('button[type="submit"]')
    await btn?.click()

    await expect(
      page.getByText(FRIENDLY_MESSAGES['sign-up username taken']),
    ).toBeVisible()
  })

  test('prevent duplicate email', async ({ page }) => {
    await TestDB.seedDB('db_' + randomUUID())
    await page.goto('/sign-up')

    const username = await page.$('input[name="displayName"]')
    username?.fill('demo_user_' + randomUUID())

    const email = await page.$('input[name="email"]')
    email?.fill('demo_user@example.com')

    const password = await page.$('input[name="password"]')
    password?.fill('demo_user')

    const confirmPassword = await page.$('input[name="confirm-password"]')
    confirmPassword?.fill('demo_user')

    const checkbox = await page.$('input[name="consent"]')
    checkbox?.check()

    const btn = await page.$('button[type="submit"]')
    await btn?.click()

    await expect(
      page.getByText('The email address is already in use by another account.'),
    ).toBeVisible()
  })

  test('create new account', async ({ page }) => {
    await TestDB.seedDB('db_' + randomUUID())
    await page.goto('/sign-up')

    const newUserEmail = 'demo_user_' + randomUUID() + '@example.com'

    const username = await page.$('input[name="displayName"]')
    username?.fill('demo_user_' + randomUUID())

    const email = await page.$('input[name="email"]')
    email?.fill(newUserEmail)

    const password = await page.$('input[name="password"]')
    password?.fill('demo_user')

    const confirmPassword = await page.$('input[name="confirm-password"]')
    confirmPassword?.fill('demo_user')

    const checkbox = await page.$('input[name="consent"]')
    checkbox?.check()

    const btn = await page.$('button[type="submit"]')
    await btn?.click()

    await expect(page.getByText('Sign up successful')).toBeVisible()

    await page.goto('/sign-in')

    const loginEmail = await page.$('input[name="email"]')
    loginEmail?.fill(newUserEmail)

    const loginPassword = await page.$('input[name="password"]')
    loginPassword?.fill('demo_user')

    const loginBtn = await page.$('button[type="submit"]')
    loginBtn?.click()
  })
})
