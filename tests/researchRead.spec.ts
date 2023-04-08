import { test, expect } from './support'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { setDatabasePrefix } from './support/setDatabasePrefix'
import { generateDatabasePrefix } from './support/db/generateDatabasePrefix'

test.describe('[Research]', () => {
  test.describe('[List research articles]', () => {
    test('[By everyone]', async ({ page, context }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['research'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      // Act
      await page.goto(`/research`)
      await expect(
        await page.locator('[data-cy="ResearchListItem"]'),
      ).toHaveCount(2)
    })
  })

  test.describe('[Read a research article]', () => {
    test('[By everyone]', async ({ page, context }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['research'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      // Act
      await page.goto(`/research`)

      // Assert
      await expect(page.getByText('qwerty')).toBeVisible()

      await page.getByText('qwerty').click()

      await page.waitForURL('/research/qwerty')

      // ViewsCounter should not be visible for everyone
      await expect(
        await page.locator('[data-cy="ViewsCounter"]'),
      ).not.toBeVisible()
    })

    test.describe('[Beta-tester]', () => {
      test('[Views show on multiple research articles]', async ({
        signIn,
        context,
        page,
      }) => {
        const DB_PREFIX = generateDatabasePrefix()
        await TestDB.seedDB(DB_PREFIX, ['research', 'users'])
        await context.addInitScript(setDatabasePrefix, DB_PREFIX)
        await signIn.withEmailAndPassword(
          'demo_beta_tester@example.com',
          'demo_beta_tester',
        )

        // Views show on first research article
        await page.goto('/research/qwerty')
        await expect(page.locator('[data-cy="ViewsCounter"]')).toBeVisible()

        // Views show on second research article
        await page.goto('/research/A%20test%20research')
        await expect(page.locator('[data-cy="ViewsCounter"]')).toBeVisible()
      })
    })
  })
})
