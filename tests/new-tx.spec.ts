/*
Tests for the New Transaction screen
*/

import { test, expect } from '@playwright/test'
import { create_demo_data } from './test-infrastructure'

test.beforeEach(async ({ page }) => {
  await create_demo_data(page)
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
