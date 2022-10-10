import { test, expect } from '@playwright/test'
import { DemoDataPage } from './seedDb'

const rootUrl = 'http://localhost:9200'

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto(rootUrl)
  await expect(page).toHaveURL(rootUrl + '/#/home')
})

test('savingDefaultCurrency', async ({ page }) => {
  await expect(page).toHaveURL('http://localhost:9200/#/home')

  // Click text=Settings >> nth=1
  await page.locator('text=Settings').nth(1).click()
  await expect(page).toHaveURL('http://localhost:9200/#/settings')

  // Click [aria-label="Main Currency"]
  await page.locator('[aria-label="Main Currency"]').click()

  // Fill [aria-label="Main Currency"]
  await page.locator('[aria-label="Main Currency"]').fill('EUR')

  // Click text=Home >> nth=1
  await page.locator('text=Home').nth(1).click()
  await expect(page).toHaveURL('http://localhost:9200/#/home')

  // Click text=Settings >> nth=1
  await page.locator('text=Settings').nth(1).click()
  await expect(page).toHaveURL('http://localhost:9200/#/settings')

  // If not saved, the value is not persisted!
  await expect(page.locator('[aria-label="Main Currency"]')).toHaveValue('')

  // Click [aria-label="Main Currency"]
  await page.locator('[aria-label="Main Currency"]').click()

  // Fill [aria-label="Main Currency"]
  await page.locator('[aria-label="Main Currency"]').fill('EUR')

  // Save settings.
  await page.locator('button:has-text("save")').click()

  // Go away from Settings.
  await page.locator('text=Home').nth(1).click()
  await expect(page).toHaveURL('http://localhost:9200/#/home')

  // Click text=Settings >> nth=1
  await page.locator('text=Settings').nth(1).click()
  await expect(page).toHaveURL('http://localhost:9200/#/settings')

  // Assert that the value has been saved.
  await expect(page.locator('[aria-label="Main Currency"]')).toHaveValue('EUR')
})

test('createDefaultAccounts', async ({ page }) => {
  const demoDataPage = new DemoDataPage(page)
  await demoDataPage.goto()
  await demoDataPage.createAccounts()

  const alertText = 'Chart of Accounst created'
  let alert = demoDataPage.alert
  if ((await alert.count()) > 1) {
    alert = alert.getByText(alertText)
  }
  await alert.waitFor()
  await expect(alert).toHaveText(alertText)

  // Check that the accounts are created

  await page.goto(rootUrl + '/#/accounts')
  await expect(page).toHaveURL('http://localhost:9200/#/accounts')
  const accountsList = page.getByText(
    'Assets:Bank Accounts Assets:Cash Assets:Fixed Assets Assets:Investments Assets:R'
  )
  await expect(accountsList).toContainText('Expenses:Culture:Music')
})
