import { test, expect, Page } from '@playwright/test'
import { create_demo_data } from './test-infrastructure'

test.beforeEach(async ({ page }) => {
  await create_demo_data(page)
})

test('testDeletingPostings', async ({ page }) => {
  await page.goto('http://localhost:9200/#/home')
  await page.getByText('2023-02-01 My Bank').click()
  await page.getByText('2023-02-01 My Bank').click()
  await page.getByRole('button', { name: 'Edit' }).click()
  await page
    .locator('div')
    .filter({
      hasText:
        /^DatePayeeNotePostingsSum: 250\.00AccountAmountCurrencyAccountAmountCurrency$/,
    })
    .getByRole('button')
    .nth(2)
    .click()
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Assets:Bank Accounts:Checking' })
    .getByRole('img')
    .click()
  await page.getByRole('button', { name: 'Yes' }).click()
  await page.getByRole('button').nth(3).click()

  // assert
  await expect(page.getByLabel('Account')).toHaveCount(1)
})
