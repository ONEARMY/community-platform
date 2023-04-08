import { test, expect } from './support'
import { users } from './data'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { generateDatabasePrefix } from './support/db/generateDatabasePrefix'
import { setDatabasePrefix } from './support/setDatabasePrefix'

const { admin, mapview_testing_rejected } = users

test.describe('[Maps]', () => {
  test('should render an `accepted` pin', async ({ page, context }) => {
    const DB_PREFIX = generateDatabasePrefix()
    await TestDB.seedDB(DB_PREFIX, ['mappins'])
    await context.addInitScript(setDatabasePrefix, DB_PREFIX)

    await page.goto('/map')

    await expect(
      await page.locator('[class*="leaflet-marker-icon"]'),
    ).toBeVisible()
  })

  test.describe('[By Admin]', () => {
    test('should show option to moderate pins for admin users', async ({
      page,
      context,
      signIn,
    }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['mappins', 'users'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)
      await signIn.withEmailAndPassword(admin.email, admin.password)

      // Act
      await page.goto('/map#settings_plastic_new')

      // Assert
      await expect(
        await page.locator('[data-cy="MapMemberCard: accept"]'),
      ).toBeVisible()
      await expect(
        await page.locator('[data-cy="MapMemberCard: reject"]'),
      ).toBeVisible()
    })

    test('should approve a map pin', async ({ page, context, signIn }) => {
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['mappins', 'users'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      await signIn.withEmailAndPassword(admin.email, admin.password)
      await page.goto('/map#settings_plastic_new')

      await page.locator('[data-cy="MapMemberCard: accept"]').click()
      await expect(
        await page.locator('[data-cy="MapMemberCard: moderation status"]'),
      ).not.toBeVisible()
    })

    test('should delete a map pin', async ({ page, context, signIn }) => {
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['mappins', 'users'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      await signIn.withEmailAndPassword(admin.email, admin.password)
      await page.goto('/map#settings_workplace_new')

      await page.locator('[data-cy="MapMemberCard: reject"]').click()

      await expect(
        await page.locator('[data-cy="MapMemberCard"]'),
      ).not.toBeVisible()
    })
  })

  test.describe('[By User]', () => {
    test('should show the user a message stating their pin is rejected', async ({
      page,
      context,
      signIn,
    }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['mappins', 'users'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)
      await signIn.withEmailAndPassword(
        mapview_testing_rejected.email,
        mapview_testing_rejected.password,
      )

      // Act
      await page.goto(`/map#${mapview_testing_rejected._id}`)

      // Assert
      await expect(
        await page.locator('[data-cy="MapMemberCard: moderation status"]'),
      ).toBeVisible()
    })
  })
})
