import { test, expect } from '@playwright/test'

test.describe('Smoke test', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Daily Deen/)
  })

  test('navigation to settings works', async ({ page }) => {
    await page.goto('/')
    // Settings is accessible
    await page.goto('/settings')
    await expect(page.locator('text=Settings')).toBeVisible()
  })

  test('prayer settings route exists', async ({ page }) => {
    await page.goto('/settings/prayer')
    await expect(page.locator('text=Prayer time adjustments')).toBeVisible()
  })
})
