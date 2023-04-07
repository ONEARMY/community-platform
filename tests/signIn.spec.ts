import { test, expect } from '@playwright/test'

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

    await page.getByText('Lost password?').click()

    const input = await page.$('input[name="email"]')

    input?.fill('what_is_mypassword@test.com')

    await page.getByText('Lost password?').click()

    await expect(
      page.getByText('Reset email sent, check your inbox/spam'),
    ).not.toBeVisible()
  })
})

test.describe('[Sign-in - authenticated user]', () => {
  test.skip('redirects to home page', async ({ page }) => {
    await page.goto('https://example.com/sign-in')
    await page.login('howto_reader@test.com', 'test1234')
    await page.goto('https://example.com/sign-in')
    await page.waitForURL((url) => url.includes('/'))
  })
})
