import { test, expect } from './support'
import { users } from './data/index'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { setDatabasePrefix } from './support/setDatabasePrefix'
import { generateDatabasePrefix } from './support/db/generateDatabasePrefix'

const { subscriber, admin } = users

test.describe('[Profile]', () => {
  test('[Can view public profile]', async ({ page, context }) => {
    // Arrange
    const DB_PREFIX = generateDatabasePrefix()
    await TestDB.seedDB(DB_PREFIX, ['users'])
    await context.addInitScript(setDatabasePrefix, DB_PREFIX)

    // Act
    await page.goto(`/u/${subscriber.userName}`)
    await expect(page.getByText(subscriber.userName).last()).toBeVisible()
  })

  test.describe('[By User]', () => {
    test('[Cannot edit another user profile]', async ({
      signIn,
      page,
      context,
    }) => {
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['users'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      await signIn.withEmailAndPassword(subscriber.email, subscriber.password)

      // Act
      await page.goto(`/u/${admin.userName}`)

      await expect(page.getByText(admin.userName).last()).toBeVisible()

      await expect(await page.getByText('Edit')).not.toBeVisible()

      await page.goto(`/u/${admin.userName}/edit`)

      await expect(
        page.getByText('admin role required to access this page'),
      ).toBeVisible()
    })
  })

  test.describe('[By Admin]', () => {
    test('[Can edit another user profile]', async ({
      signIn,
      page,
      context,
    }) => {
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['users'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)

      await signIn.withEmailAndPassword(admin.email, admin.password)

      // Act

      await page.goto(`/u/${subscriber.userName}`)

      await page.getByText(subscriber.displayName)

      await page.getByText('Edit').click()

      await page.waitForURL(`/u/${subscriber.userName}/edit`)

      // Avoid using timeout here
      await page.waitForTimeout(1000 * 7)

      const inputElement = await page.$('input[name="displayName"]')

      await inputElement?.fill(`EDITED ${subscriber.displayName}`)

      await expect(await inputElement?.getAttribute('value')).toBe(
        `EDITED ${subscriber.displayName}`,
      )

      await page.getByText('Save').click()

      await page.waitForTimeout(1000 * 2)

      await page.goto(`/u/${subscriber.userName}`)

      await expect(
        page.getByText(`EDITED ${subscriber.displayName}`),
      ).toBeVisible()
    })
  })
})
