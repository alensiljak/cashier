/*
    Provides caching for CashierSync data.
*/
import ky from 'ky'

class CashierCache {
  constructor(cacheName) {
    this.cacheName = cacheName
  }

  async cache(url) {
    // get the response from CashierSync
    const response = await ky(url, {
      timeout: 20000
    })

    // don't cache invalid responses
    if (!response.ok) return

    // cache the response
    const cache = await caches.open(this.cacheName)
    await cache.put(url, response.clone())
  }

  async clearCache(url) {
    const cache = await caches.open(this.cacheName)
    return cache.delete(url)
  }
}

export default CashierCache
