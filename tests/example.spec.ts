/*
  Playwright example.
*/
import { test, expect, Page } from '@playwright/test'
//import { firefox } from 'playwright'

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
