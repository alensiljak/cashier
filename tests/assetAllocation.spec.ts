/**
 * Asset Allocation tests
 */

import { test, expect } from '@playwright/test'
import { createDemoData } from './seedDb'

test.beforeEach(async ({ page }) => {
  // Create demo data.

  await page.goto('http://localhost:9200/')
  expect(page).toHaveURL('http://localhost:9200/#/home')

  await createDemoData(page)

  await page.locator('a[role="listitem"]:has-text("Asset Allocation")').click()
  await expect(page).toHaveURL('http://localhost:9200/#/assetallocation')
})

test('testValidation', async ({ page }) => {
  await page.getByRole('button').nth(2).click()
  await page.getByText('Validate').click()

  expect(page.getByText('The allocation is valid.')).toBeVisible()
})

test('testCashAmounts', async ({ page }) => {
  // current allocation
  expect(page.getByRole('cell', { name: '37.70' })).toBeVisible()
  // allocated value
  expect(page.getByRole('cell', { name: '159.16' })).toBeVisible()
  // difference
  expect(page.getByRole('cell', { name: '1,840.84' })).toBeVisible()
})
