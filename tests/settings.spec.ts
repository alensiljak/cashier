import { test, expect } from '@playwright/test'

test('savingDefaultCurrency', async ({ page }) => {
  // Go to http://localhost:9200/
  await page.goto('http://localhost:9200/')

  await expect(page).toHaveURL('http://localhost:9200/#/home')

  // Click text=Settings >> nth=1
  await page.locator('text=Settings').nth(1).click()
  await expect(page).toHaveURL('http://localhost:9200/#/settings')

  // Click [aria-label="Main Currency"]
  await page.locator('[aria-label="Main Currency"]').click()

  // Fill [aria-label="Main Currency"]
  await page.locator('[aria-label="Main Currency"]').fill('EUR')

  // Click text=Home >> nth=1
  await page.locator('text=Home').nth(1).click()
  await expect(page).toHaveURL('http://localhost:9200/#/home')

  // Click text=Settings >> nth=1
  await page.locator('text=Settings').nth(1).click()
  await expect(page).toHaveURL('http://localhost:9200/#/settings')

  // If not saved, the value is not persisted!
  await expect(page.locator('[aria-label="Main Currency"]')).toHaveValue('')

  // Click [aria-label="Main Currency"]
  await page.locator('[aria-label="Main Currency"]').click()

  // Fill [aria-label="Main Currency"]
  await page.locator('[aria-label="Main Currency"]').fill('EUR')

  // Save settings.
  await page.locator('button:has-text("save")').click()

  // Go away from Settings.
  await page.locator('text=Home').nth(1).click()
  await expect(page).toHaveURL('http://localhost:9200/#/home')

  // Click text=Settings >> nth=1
  await page.locator('text=Settings').nth(1).click()
  await expect(page).toHaveURL('http://localhost:9200/#/settings')

  // Assert that the value has been saved.
  await expect(page.locator('[aria-label="Main Currency"]')).toHaveValue('EUR')
})
