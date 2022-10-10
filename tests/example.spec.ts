/*
  Playwright example.
*/
import { test, expect, Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

let page: Page

test.beforeAll(async ({ browser }) => {
  //const browser = await firefox.launch()
  page = await browser.newPage()

  await page.goto('http://localhost:9200/')
})
test.afterAll(async () => {
  // clean-up
  page.close()
})

test('some test', async () => {
  //
})

test('homepage has Playwright in title and get started link linking to the intro page', async ({
  page,
}) => {
  await page.goto('https://playwright.dev/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/)

  // create a locator
  const getStarted = page.locator('text=Get Started')

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute('href', '/docs/intro')

  // Click the get started link.
  await getStarted.click()

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/)
})

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

    // console.log(db.accounts)
    // await db.accounts.put({ name: 'account1' })
    // console.log(db.accounts)

    await page.goto('http://localhost:9200/')

    const result = await page.evaluate(() => {
      if (!window.indexedDB) {
        //window.alert("Your browser doesn't support a stable version of IndexedDB.")
        throw new Error('no support for indexeddb')
      }

      return new Promise(function (resolve, reject) {
        const storeName = 'cashier'
        //let db
        let openRequest = window.indexedDB.open(storeName)
        openRequest.onerror = function (event) {
          reject(Error('Error text'))
        }
        openRequest.onupgradeneeded = function (event) {
          // Objectstore does not exist. Nothing to load
          //event.target.transaction.abort();
          reject(Error('Data store not found ("upgrade needed" received)'))
        }
        openRequest.onsuccess = function (event) {
          // seed
          let db = openRequest.result
          const tx = db.transaction([storeName])
          const store = tx.objectStore(storeName)

          const objectRequest = store.put({ name: 'test account' })
          objectRequest.onerror = function (event) {
            reject(Error('Error text'))
          }

          objectRequest.onsuccess = function (event) {
            if (objectRequest.result) {
              resolve(objectRequest.result)
            } else {
              reject(Error('object not found'))
            }
          }

          //return db
        }
      })
    })
    console.log(result)
  })
})
