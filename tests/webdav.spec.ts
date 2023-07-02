/*
WebDAV page
*/

import { test, expect } from '@playwright/test'
import { create_demo_data } from './test-infrastructure'

test.beforeEach(async ({ page }) => {
  await create_demo_data(page)
})

test('testOpenWebdavPage', async ({ page }) => {
  await page.getByRole('listitem').filter({ hasText: 'Settings' }).click()

  await page.getByRole('main').getByRole('button').nth(1).click()
  await page.getByText('WebDAV Experiment').click()

  // Assert
  await expect(page.getByText('WebDAV')).toBeInViewport()
})
