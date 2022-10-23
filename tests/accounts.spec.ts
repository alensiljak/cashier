/**
 * Accounts tests
 */

import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Create demo data.

  await page.goto('/')
  expect(page).toHaveURL('/#/home')

  await page.getByRole('button', { name: 'Yes' }).click()
  await expect(page).toHaveURL('/#/demoData')

  await page.getByRole('button', { name: 'Create' }).click()

  expect(page.getByText('Asset Allocation created')).toBeVisible()

  // await page.locator('a[role="listitem"]:has-text("Home")').click()
  // await expect(page).toHaveURL('/#/home')
})

test('testDiningAccountBalance', async ({ page }) => {
  await page.locator('a[role="listitem"]:has-text("Accounts")').click()
  await expect(page).toHaveURL('/#/accounts')
  await page.getByLabel('').click()
  await page.getByLabel('').fill('din')
  //await page.getByText('256 EUR').nth(1)
  expect(page.getByText('256 EUR').nth(1)).toHaveText('256 EUR')
})
