import { test, expect } from './support'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { generateDatabasePrefix } from './support/db/generateDatabasePrefix'
import { setDatabasePrefix } from './support/setDatabasePrefix'
import { users } from './data'

const { subscriber } = users

test.describe('[Common]', () => {
  test('Default Page', async ({ page }) => {
    await page.goto('/')
    expect(page.url()).toContain('/academy')
  })

  test('Not-Found Page', async ({ page }) => {
    const unknownUrl = '/abcdefghijklm'
    await page.goto(unknownUrl)

    await expect(page.getByText('home page')).toHaveAttribute('href', '/')
    await expect(page.getByText('Nada, page not found 💩')).toBeVisible()
  })

  test('Page Navigation', async ({ page }) => {
    await page.goto('/how-to')
    await page.getByText('Events').click()
    await expect(page.url()).toContain('/events')

    await page.getByText('Map').click()
    await expect(page.url()).toContain('/map')

    await page.getByText('Academy').click()
    await expect(page.url()).toContain('/academy')

    await page.getByText('How-to').click()
    await expect(page.url()).toContain('/how-to')
  })
})

test.describe('[User Menu]', () => {
  test('By Anonymous', async ({ page }) => {
    await page.goto('/how-to')
    await expect(page.locator('[data-cy=login]')).toBeVisible()
    await expect(page.locator('[data-cy=join]')).toBeVisible()
    await expect(page.locator('[data-cy=user-menu]')).not.toBeVisible()
  })

  test('By Authenticated', async ({ page, signIn, context }) => {
    const DB_PREFIX = generateDatabasePrefix()
    await TestDB.seedDB(DB_PREFIX, ['users'])
    await context.addInitScript(setDatabasePrefix, DB_PREFIX)

    await signIn.withEmailAndPassword(subscriber.email, subscriber.password)

    await page.goto(`/u/${subscriber.userName}`)

    await expect(await page.locator('[data-cy=login]')).not.toBeVisible()
    await expect(await page.locator('[data-cy=join]')).not.toBeVisible()

    const triggerMenu = await page.locator('[data-cy=user-menu]')
    await triggerMenu.click()

    await expect(await page.locator('[data-cy=user-menu-list]')).toBeVisible()

    const triggerMenu2 = await page.locator('[data-cy=user-menu]')
    await triggerMenu2.click()

    await page.getByText(`Profile`).click()
    await page.waitForURL(`/u/${subscriber.userName}`)

    const triggerMenu3 = await page.locator('[data-cy=user-menu]')
    await triggerMenu3.click()

    await page.getByText(`Settings`).click()
    await page.waitForURL('settings')

    const triggerMenu4 = await page.locator('[data-cy=user-menu]')
    await triggerMenu4.click()

    await page.getByText(`Log out`).click()
    await expect(page.locator('[data-cy=login]')).toBeVisible()
    await expect(page.locator('[data-cy=join]')).toBeVisible()
  })
})
