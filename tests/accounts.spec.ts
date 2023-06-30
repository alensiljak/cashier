/**
 * Accounts tests
 */

import { test, expect } from '@playwright/test'
import { create_demo_data } from './test-infrastructure'

test.beforeEach(async ({ page }) => {
  await create_demo_data(page)
})

test('testDiningAccountBalance', async ({ page }) => {
  await page.locator('a[role="listitem"]:has-text("Accounts")').click()
  await expect(page).toHaveURL('/#/accounts')
  await page.getByLabel('').click()
  await page.getByLabel('').fill('din')
  //await page.getByText('256 EUR').nth(1)
  expect(page.getByText('256 EUR').nth(1)).toHaveText('256 EUR')
})
