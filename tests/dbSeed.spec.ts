/**
 * Demo on how to seed the IndexedDb database.
 */

import { test, expect } from '@playwright/test'

test.describe('db seed', () => {
  test.beforeAll(async ({ page }) => {
    await page.goto('http://localhost:9200/')

    let x = await page.evaluate(async () => {
      const idb = window.indexedDB

      //let dbInfo = await idb.databases()
      //return dbInfo

      async function openDb(): Promise<IDBDatabase> {
        return new Promise(function (resolve, reject) {
          const request = idb.open('cashier')
          request.onerror = function (e) {
            reject(e)
          }
          request.onsuccess = function (e) {
            let db: IDBDatabase = request.result
            resolve(db)
          }
        })
      }

      const db = await openDb()
      return db.objectStoreNames
      //const tx = db.transaction()
      //return db
    })

    console.log(x)
    //
  })

  test('seedDb', async ({ page }) => {
    await page.goto('http://localhost:9200/')
    // await page.goto('http://localhost:9200/#/')
    // await page.goto('http://localhost:9200/#/home')
    await expect(page).toHaveURL('http://localhost:9200/#/home')

    await page.getByRole('link', { name: 'Settings' }).click()
    await expect(page).toHaveURL('http://localhost:9200/#/settings')

    // Click the menu
    await page.locator('button:has-text("more_vert")').click()

    await page.getByText('Create demo data').click()
    await expect(page).toHaveURL('http://localhost:9200/#/demoData')

    await page.getByRole('checkbox', { name: 'Create All' }).click()

    await page.getByRole('button', { name: 'Create' }).click()

    const alert = page.locator('div[role="alert"]')
    await alert.waitFor()
    await expect(alert).toHaveText('not (yet) implemented')
  })
})
