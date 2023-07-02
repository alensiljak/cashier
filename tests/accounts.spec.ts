/**
 * Accounts tests
 */

import { test, expect } from '@playwright/test'
import { create_demo_data } from './test-infrastructure'

test.beforeEach(async ({ page }) => {
  await create_demo_data(page)
})

test('testDiningAccountBalance', async ({ page }) => {
  await page.getByRole('listitem').filter({ hasText: 'Accounts' }).click()
  await expect(page).toHaveURL('/#/accounts')

  await page.getByLabel('', { exact: true }).click()
  await page.getByLabel('', { exact: true }).fill('din')

  await expect(page.getByText('256 EUR')).toBeInViewport()
  await expect(page.getByText('256 EUR')).toHaveText('256 EUR')
})
