import { createPinia } from 'pinia'

export default ({ app, router, store }) => {
  app.use(createPinia()) // Create the root store
}
