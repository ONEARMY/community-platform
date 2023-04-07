import { test, expect } from './support'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { generateDatabasePrefix } from './support/db/generateDatabasePrefix'
import { setDatabasePrefix } from './support/setDatabasePrefix'
import { users } from './data'

const { subscriber } = users

test.describe('[Events]', () => {
  test.describe('[List events]', () => {
    test('[By Everyone]', async ({ page, context }) => {
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['events'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      await page.goto('/events')

      await expect(await page.locator('[data-cy=card]')).toHaveCount(7)

      await expect(await page.getByText('More Events')).not.toBeVisible()
      await expect(await page.getByText('SURA BAYA Exhibition')).toBeVisible()

      const card = await page.locator('[data-eventid="jdp8AQWAdMXRybNQ97Ix"]')

      await expect(card).toContainText('18')
      await expect(card).toContainText('Aug')
      await expect(card).toContainText('SURA BAYA Exhibition')
      await expect(card).toContainText('event_creator')
      await expect(card).toContainText('East Java')
      await expect(
        await card.locator('a[target=_blank]').getAttribute('href'),
      ).toBe('https://www.instagram.com/p/B1N6zVUjj0M/')
    })

    test('[By Authenticated]', async ({ context, page, signIn }) => {
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['events'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      await signIn.withEmailAndPassword(subscriber.email, subscriber.password)

      await page.goto('/events')

      await page.getByText('Create an event').click()
    })
  })

  test.describe('[Filter Events]', () => {
    test('[By Everyone]', async ({ page, context }) => {
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['events', 'tags'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      await page.goto('/events')

      await expect(await page.locator('[data-cy=card]')).toHaveCount(7)

      await selectTag(page, 'workshop')
      await expect(await page.locator('[data-cy=card]')).toHaveCount(2)

      await selectTag(page, 'screening')
      await expect(await page.locator('[data-cy=card]')).toHaveCount(1)

      await page.click('.data-cy__multi-value__remove')
      await expect(await page.locator('[data-cy=card]')).toHaveCount(2)

      await page.click('.data-cy__clear-indicator')
      await expect(
        await page.locator('.data-cy__multi-value__label'),
      ).not.toBeVisible()
      await expect(await page.locator('[data-cy=card]')).toHaveCount(7)
    })
  })

  async function selectTag(page, tagName: string) {
    const tags = await page.locator('[data-cy="tag-select"]')
    await tags.click()
    await page.locator('[data-cy=tag-select] input').fill(tagName)
    await page.keyboard.press('Enter')
    await page.waitForSelector('.data-cy__multi-value__label')
  }

  test.describe('[Create an event]', () => {
    test('[By Authenticated]', async ({ page, context, signIn }) => {
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['subscribers', 'tags'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      await signIn.withEmailAndPassword('event_creator@test.com', 'test1234')

      await page.goto('/events/create')

      const inputTitle = await page.locator('[data-cy=title]')
      await inputTitle.fill('Create a test event')

      const d = new Date(new Date().setDate(new Date().getDate() + 2))
      const dateString = `${d.getFullYear()}-${String(
        d.getMonth() + 1,
      ).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
      const inputDate = await page.locator('[data-cy=input-date]')
      await inputDate.fill(dateString)

      await page.locator('[data-cy=tag-select]').click()
      // await expect(await page.locator('[data-cy=tag-option]').count()).toBeGreaterThan(0)
      // await page.click(`[data-cy=tag-option]:has-text('event_testing')`)

      await page.locator('[data-cy=osm-geocoding-input]').fill('Atucucho')
      await page.waitForSelector('[data-cy=osm-geocoding-results] li')
      await page.locator('[data-cy=osm-geocoding-results] li').first().click()

      await page
        .locator('[data-cy=url]')
        .fill('https://www.meetup.com/pt-BR/cities/br/rio_de_janeiro/')

      const publishButton = await page.getByText('Publish')
      await publishButton.click()

      await page.goto('/events')

      await page.waitForTimeout(2000)

      await expect(await page.getByText('Create a test event')).toBeVisible()
    })
  })
})
