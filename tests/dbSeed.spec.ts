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
    console.log('seeding the database...')
  })
})
