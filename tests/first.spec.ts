import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  // Go to http://localhost:9200/
  await page.goto('http://localhost:9200/')

  // Go to http://localhost:9200/#/
  await page.goto('http://localhost:9200/#/')

  // Go to http://localhost:9200/#/home
  await page.goto('http://localhost:9200/#/home')

  // Click button:has-text("add")
  await page.locator('button:has-text("add")').click()
  await expect(page).toHaveURL('http://localhost:9200/#/tx')

  // Click [aria-label="Payee"]
  page.once('dialog', (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`)
    dialog.dismiss().catch(() => {})
  })
  await page.locator('[aria-label="Payee"]').click()
  await expect(page).toHaveURL('http://localhost:9200/#/payees')

  // Fill input[type="text"]
  page.once('dialog', (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`)
    dialog.dismiss().catch(() => {})
  })
  await page.locator('input[type="text"]').fill('some payee')

  // Click button:has-text("check")
  await page.locator('button:has-text("check")').click()
  await expect(page).toHaveURL('http://localhost:9200/#/tx')
})
