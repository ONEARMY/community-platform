import { test, expect } from '@playwright/test'

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

  // test.todo('By Authenticated', async ({ page }) => {
  //     const username = 'howto_reader';
  //     await page.goto('/how-to');
  //     await page.login({ username: `${username}@test.com`, password: 'test1234' });
  //     await expect(page.locator('[data-cy=login]')).not.toBeVisible();
  //     await expect(page.locator('[data-cy=join]')).not.toBeVisible();

  //     await page.click('[data-cy=user-menu]');
  //     await expect(page.locator('[data-cy=user-menu-list]')).toBeVisible();

  //     await page.click(`[data-cy=${UserMenuItem.Profile}]`);
  //     await expect(page.url()).toContain(`/u/${username}`);

  //     await page.click(`[data-cy=${UserMenuItem.Settings}]`);
  //     await expect(page.url()).toContain('settings');

  //     await page.click(`[data-cy=${UserMenuItem.LogOut}]`);
  //     await expect(page.locator('[data-cy=login]')).toBeVisible();
  //     await expect(page.locator('[data-cy=join]')).toBeVisible();
  // });
})
