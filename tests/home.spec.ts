/*
    Homepage tests
*/

import { test, expect } from '@playwright/test'
import { create_demo_data } from './test-infrastructure'

test.beforeEach(async ({ page }) => {
  await create_demo_data(page)
})

// Can open Favourites
test('testSignButton', async ({ page }) => {
  // click on the first accound in the Favourites panel
  await page.getByText('Assets:Cash').click()
  // the title
  await expect(page.getByRole('main').getByText('Favourites')).toHaveText(
    'Favourites'
  )
  await expect(page.getByText('Assets:Cash')).toBeInViewport()
  await expect(page.getByText('Assets:Bank Accounts:Checking')).toBeInViewport()
})
