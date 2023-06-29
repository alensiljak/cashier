/*
Tests for the New Transaction screen
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

/**
 * Test changing the Posting amount sign
 */
test('testSignButton', async ({ page }) => {
  await page.getByRole('listitem').filter({ hasText: 'Home' }).click()
  await page.getByRole('main').getByRole('button').nth(4).click()
  await page.getByLabel('Amount').first().click()
  await page.getByLabel('Amount').first().fill('25')
  await page
    .locator('div')
    .filter({
      hasText:
        /^DatePayeeNotePostingsSum: 25\.00AccountAmountCurrencyAccountAmountCurrency$/,
    })
    .getByRole('button')
    .nth(3)
    .click()
  await page
    .locator('div')
    .filter({
      hasText:
        /^DatePayeeNotePostingsSum: -25\.00AccountAmountCurrencyAccountAmountCurrency$/,
    })
    .getByRole('button')
    .nth(3)
    .click()
})
