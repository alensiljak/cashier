/*
    Run this with `node runCodegen.js`
 */

const { firefox } = require('playwright')

;(async () => {
  const browser = await firefox.launch({ headless: false })

  // Setup context however you like.
  const context = await browser.newContext({
    /* pass any options */
  })
  await context.route('**/*', (route) => route.continue())

  // Pause the page, and start recording manually.
  const page = await context.newPage()
  await page.pause()

  // Create pages, interact with UI elements, assert values
  await browser.close()
})()
