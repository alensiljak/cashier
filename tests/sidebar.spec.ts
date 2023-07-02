/*
Tests for the sidebar navigation and opening of the main pages
*/

import { test, expect } from '@playwright/test'
import { create_demo_data } from './test-infrastructure'

test.beforeEach(async ({ page }) => {
  await create_demo_data(page)
})

test('testOpenJournal', async ({ page }) => {
  await page.getByRole('listitem').filter({ hasText: 'Device Journal' }).click()

  await expect(
    page.getByRole('main').getByText('Device Journal')
  ).toBeInViewport()
  await expect(page.getByText('2023-01-05 Cash Withdrawal')).toBeInViewport()
})

test('testOpenFavourites', async ({ page }) => {
  // Act
  await page.getByRole('listitem').filter({ hasText: 'Favourites' }).click()

  // Assert
  // the title
  await expect(page.getByRole('main').getByText('Favourites')).toHaveText(
    'Favourites'
  )
  await expect(page.getByText('Assets:Cash')).toBeInViewport()
  await expect(page.getByText('Assets:Bank Accounts:Checking')).toBeInViewport()
})

/// Accounts
test('testOpenAccounts', async ({ page }) => {
  await page.getByRole('listitem').filter({ hasText: 'Accounts' }).click()

  // Assert
  await expect(page.getByRole('main').getByText('Accounts')).toBeInViewport()
  await expect(page.getByText('Assets:Cash')).toBeInViewport()
})

/// Payees
test('testOpenPayees', async ({ page }) => {
  await page.getByRole('listitem').filter({ hasText: 'Payees' }).click()

  // Assert
  await expect(page.getByRole('main').getByText('Payees')).toBeInViewport()
  await expect(page.getByText('Salary')).toBeInViewport()
})

/// Asset Allocation
test('testOpenAssetAllocation', async ({ page }) => {
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Asset Allocation' })
    .click()

  // Assert
  await expect(
    page.getByRole('main').getByText('Asset Allocation')
  ).toBeInViewport()
  await expect(
    page
      .getByRole('row', {
        name: 'Allocation 100.00 100.00 0.00 0.00 5,305.42 5,305.42 0.00',
      })
      .getByRole('cell', { name: 'Allocation' })
  ).toBeInViewport()
})

/// Scheduled Transactions
test('testOpenScheduledTransactions', async ({ page }) => {
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Scheduled Transactions' })
    .click()

  // Assert
  await expect(
    page.getByRole('main').getByText('Scheduled Transactions', { exact: true })
  ).toBeInViewport()
  await expect(
    page.getByText('There are no scheduled transactions')
  ).toBeInViewport()
})
