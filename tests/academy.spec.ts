import { test, expect } from '@playwright/test'

test('academy content loaded', async ({ page }) => {
  await page.goto('/academy')

  await expect(page).toHaveTitle(/Academy/)

  // Wait for iframe to load
  const iframe = await page.waitForSelector('iframe')
  const iframeUrl = await iframe.getAttribute('src')

  await expect(iframeUrl).toBe('https://onearmy.github.io/academy/')
})
