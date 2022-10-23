/**
 * Asset Allocation tests
 */

import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Create demo data.

  await page.goto('http://localhost:9200/')
  expect(page).toHaveURL('http://localhost:9200/#/home')

  await page.getByRole('button', { name: 'Yes' }).click()
  await expect(page).toHaveURL('http://localhost:9200/#/demoData')

  await page.getByRole('button', { name: 'Create' }).click()

  expect(page.getByText('Asset Allocation created')).toBeVisible()

  //   await page.locator('a[role="listitem"]:has-text("Home")').click()
  //   await expect(page).toHaveURL('http://localhost:9200/#/home')
})

test('testDiningAccountBalance', async ({ page }) => {
  await page.locator('a[role="listitem"]:has-text("Asset Allocation")').click()
  await expect(page).toHaveURL('http://localhost:9200/#/assetallocation')

  await page.getByRole('button').nth(2).click()
  await page.getByText('Validate').click()

  expect(page.getByText('The allocation is valid.')).toBeVisible()
})
