import { expect, test } from './support'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { generateDatabasePrefix } from './support/db/generateDatabasePrefix'
import { setDatabasePrefix } from './support/setDatabasePrefix'

test.describe('[Research Comments]', () => {
  test.describe('[Open comments]', () => {
    test('using UI elements', async ({ page, context }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['research'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      // Act
      page.goto('/research/qwerty')

      // Assert
      await page
        .locator('[data-cy="ResearchComments: button open-comments"]')
        .first()
        .click()

      await expect(await page.locator('[data-cy="comment"]')).toHaveCount(1)

      await page.locator('[data-cy="comment-submit"]').isDisabled()
    })

    test('using URL', async ({ page, context }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['research'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      // Act
      page.goto('/research/qwerty#update-12-comment:abc123')

      // Assert
      await expect(await page.locator('[data-cy="comment"]')).toHaveCount(1)

      await expect(
        await page.locator('[data-cy="comment-submit"]'),
      ).toBeInViewport()
    })
  })

  test.describe('[By Authenticated]', () => {
    test('has active comment button for logged in user', async ({
      page,
      signIn,
      context,
    }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['research'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)
      await signIn.withEmailAndPassword('howto_creator@test.com', 'test1234')

      // Act
      await page.goto('/research/qwerty')
      await page
        .locator('[data-cy="ResearchComments: button open-comments"]')
        .first()
        .click()
      await page.locator('[data-cy="comments-form"]').type('An example comment')

      // Assert
      await page.locator('[data-cy="comment-submit"]').isEnabled()
    })

    test('allows logged in user to post a commment', async ({
      page,
      signIn,
      context,
    }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['research', 'users'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)
      await signIn.withEmailAndPassword('howto_creator@test.com', 'test1234')

      // Act
      await page.goto('/research/qwerty')
      await page
        .locator('[data-cy="ResearchComments: button open-comments"]')
        .first()
        .click()
      await page.locator('[data-cy="comments-form"]').type('An example comment')
      await page.locator('[data-cy="comment-submit"]').click()

      // Assert
      await page.waitForSelector('[data-cy="comment"]')
      const comments = await page.locator('[data-cy="comment"]')
      await expect(comments).toHaveCount(2)
      expect(await page.getByText('An example comment')).toBeVisible()

      // Comment author can edit their comment
      expect(
        await page.locator(`[data-cy="CommentItem: edit button"]`),
      ).toHaveCount(1)

      // Comment author can delete their comment
      await page
        .locator('[data-cy="comment"]')
        .last()
        .locator(`[data-cy="CommentItem: delete button"]`)
        .click()

      await expect(
        await page.locator('[data-cy="Confirm.modal: Confirm"]'),
      ).toBeVisible()
    })
  })
})
