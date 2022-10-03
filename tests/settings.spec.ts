import { test, expect } from '@playwright/test'
import db from '../src/store/indexedDb'

const testData = [
  { id: 1, name: 'test' },
  { id: 2, name: 'second test' },
]

test.describe('Settings', () => {
  test.beforeAll(async ({ page }) => {
    // todo: seed the database
    // const aWindowHandle = await page.evaluateHandle(() =>
    //   Promise.resolve(window)
    // )
    //aWindowHandle.
    //const windowHandle = await page.evaluateHandle(() => window)
    //console.log(windowHandle)
    //const win = windowHandle.asElement() as Window
    //let ib = win.indexeddb
    // let win = await page.evaluate(() => window)
    // let ib = win.indexedDB
    // console.log('indexedDB enabled:', ib)
    console.log(db.accounts)
    await db.accounts.put({ name: 'account1' })
    console.log(db.accounts)

    await page.evaluate(() => {
      // seed
      console.log('yo')
    })
  })

  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('http://localhost:9200/')
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
    await expect(page.locator('[aria-label="Main Currency"]')).toHaveValue(
      'EUR'
    )
  })
})
