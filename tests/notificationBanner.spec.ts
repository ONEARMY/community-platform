import { test, expect } from './support'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { generateDatabasePrefix } from './support/db/generateDatabasePrefix'
import { setDatabasePrefix } from './support/setDatabasePrefix'
import { users } from './data'

const { subscriber } = users

test.describe('[Notification Banner]', () => {
  test('[By unregistered user]', async ({ page }) => {
    await page.goto('/')

    await expect(
      await page.locator('[data-cy=notificationBanner]'),
    ).not.toBeVisible()
  })

  test('[By Authenticated user with blank profile]', async ({
    page,
    signIn,
    context,
  }) => {
    // Arrange
    const DB_PREFIX = generateDatabasePrefix()
    await TestDB.seedDB(DB_PREFIX, ['users'])
    await context.addInitScript(setDatabasePrefix, DB_PREFIX)

    await signIn.withEmailAndPassword('howto_reader@test.com', 'test1234')

    // Act
    await page.goto('/')

    // Arrange
    await expect(
      await page.locator('[data-cy=notificationBanner]'),
    ).toBeVisible()
  })

  test.describe('[By Authenticated user with filled profile]', () => {
    test('[Notification Banner is visible for user with blank profile]', async ({
      page,
      signIn,
      context,
    }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['users'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      await signIn.withEmailAndPassword(subscriber.email, subscriber.password)

      // Go to User Settings
      await page.goto('/settings')

      await expect(
        await page.locator('[data-cy=notificationBanner]'),
      ).not.toBeVisible()
    })
  })
})
