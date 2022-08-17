/**
 * Global error handler
 */
export default ({ app, router, store }) => {
  app.config.errorHandler = (err) => {
    alert(err)
  }

  // Custom warning handler (only runs in development)
  app.config.warnHandler = (warn) => {
    console.warn(`[CUSTOM WARNING] ${warn}`)
  }
}
