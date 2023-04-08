import { test, expect } from './support'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { setDatabasePrefix } from './support/setDatabasePrefix'
import { generateDatabasePrefix } from './support/db/generateDatabasePrefix'
import { users } from './data'

const { subscriber } = users

test.describe('[How to]', () => {
  test.describe('[List howtos]', () => {
    test('[By everyone]', async ({ page, context }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['howtos'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      // Act
      await page.goto(`/how-to`)

      // Assert
      await expect(await page.locator('[data-cy=card]')).toHaveCount(8)

      // How-to cards has basic info
      await page.getByText('Make glass-like beams')
      await page.getByText('howto_creator')
      await page.locator('img[src*=/howto-beams-glass-0-3.jpg')
      await page.getByText('extrusion')

      // Open how-to details when click on a how-to ${howtoUrl}
      await page.getByText(`Make glass-like beams`).click()
      await page.waitForURL('/how-to/make-glass-like-beams')
    })

    test('[By Authenticated user]', async ({ page, context, signIn }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['howtos', 'users'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)
      await signIn.withEmailAndPassword(subscriber.email, subscriber.password)

      // Act
      await page.goto('/how-to')

      // Assert
      await expect(await page.getByText('Create a How-to')).toBeVisible()
    })
  })

  test.describe('[Filter by category]', () => {
    test('[By Everyone]', async ({ page, context }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['howtos', 'categories'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)
      await page.goto('/how-to')

      // Act
      selectTag(page, 'product')

      // Assert
      await expect(await page.locator('[data-cy=card]')).toHaveCount(3)
    })
  })

  test.describe('[Read a how-to]', () => {
    test('[By everyone]', async ({ page, context }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['howtos', 'tags', 'categories'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      // Act
      await page.goto('/how-to/make-an-interlocking-brick')

      // Assert
      await expect(await page.locator('[data-cy=edit]')).not.toBeVisible()

      const howToText = await page
        .locator('[data-cy=how-to-basis]')
        .textContent()
      expect(howToText).toContain('Make an interlocking brick')
      expect(howToText).toContain('howto_creator')
      expect(howToText).toContain('Last edit on')
      expect(howToText).toContain(
        'show you how to make a brick using the injection machine',
      )
      expect(howToText).toContain('12 steps')
      expect(howToText).toContain('3-4 weeks')
      expect(howToText).toContain('Hard')

      // Attachments are opened in a new tab
      await expect(
        await page
          .locator('[download="art final 1.skp"]')
          .getAttribute('target'),
      ).toBe('_blank')

      // All steps are shown
      expect(await page.locator('[data-cy*=step]')).toHaveCount(12)

      // All step info is shown
      const step = await page.locator('[data-cy=step_11]')
      const stepText = await page.locator('[data-cy=step_11]').textContent()

      expect(stepText).toContain('12')
      expect(stepText).toContain('Explore the possibilities!')
      expect(stepText).toContain('more for a partition or the wall')

      // Step image is updated on thumbnail click
      expect(
        await step.locator('[data-cy="active-image"]').getAttribute('src'),
      ).toContain('brick-12-1.jpg')

      await step.locator('[data-cy=thumbnail]:nth-child(3)').click()

      expect(
        await step.locator('[data-cy="active-image"]').getAttribute('src'),
      ).toContain('brick-12.jpg')

      // Comment functionality prompts user to login
      expect(await page.getByText('to leave a comment')).toBeVisible()

      // Video embed exists
      const iframe = await page.waitForSelector('iframe')
      const iframeUrl = await iframe.getAttribute('src')

      await expect(iframeUrl).toContain('youtube.com/embed/')

      // Back button at top of page
      await page.locator('[data-cy="go-back"]').first().click()

      await page.waitForURL('/how-to/')

      await page.goto('/how-to/make-an-interlocking-brick')

      // Back button at bottom of page
      await page.locator('[data-cy="go-back"]').last().click()

      await page.waitForURL('/how-to/')

      // Views button is not visible
      expect(await page.locator('[data-cy="ViewsCounter"]')).not.toBeVisible()
    })

    test('[By beta-tester]', async ({ page, context, signIn }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['howtos', 'tags', 'categories', 'users'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)
      await signIn.withEmailAndPassword(
        users['beta-tester'].email,
        users['beta-tester'].password,
      )

      // Act
      await page.goto('/how-to/make-an-interlocking-brick')

      // Assert
      await expect(await page.locator('[data-cy="ViewsCounter"]')).toBeVisible()
    })

    test('[By owner]', async ({ page, context, signIn }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['howtos', 'tags', 'categories', 'users'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)
      await signIn.withEmailAndPassword(
        users['howto_creator'].email,
        users['howto_creator'].password,
      )

      // Act
      await page.goto('/how-to/make-an-interlocking-brick')

      // Assert
      await expect(await page.locator('[data-cy=edit]')).toBeVisible()

      await page.locator('[data-cy=edit]').click()

      await page.waitForURL('/how-to/make-an-interlocking-brick/edit')
    })
  })

  test.describe('[Fail to find a how-to]', () => {
    test('[Redirects to search page]', async ({ page, context }) => {
      // Arrange
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['howtos', 'tags', 'categories'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      // Act
      await page.goto('/how-to/does-not-exist')

      // Assert
      await expect(
        await page.getByText(
          "The page you were looking for was moved or doesn't exist.",
        ),
      ).toBeVisible()

      await expect(await page.url()).toContain(
        'search=does%20not%20exist&source=how-to-not-found',
      )
    })
  })
})

async function selectTag(page, tagName: string) {
  const tags = await page.locator('[data-cy="category-select"]')
  await tags.click()
  await page.locator('[data-cy=category-select] input').fill(tagName)
  await page.keyboard.press('Enter')
  await page.locator('.data-cy__option').click()
}
