/*
    The proxy class that communicates to the remote storage.
*/
import PcloudClient from './pCloudClient'

let client = new PcloudClient()

class RemoteStorage {
  fetch() {
    // todo retrieve from the remote storage
    return client.fetch()
  }
  store(content) {
    // todo store to remote storage
    return client.store(content)
  }
}

export default RemoteStorage
