<template>
  <div>
    <img src="../assets/icons8-pcloud.svg" @click="onImgClick" />
  </div>
</template>

<script lang="ts">
import { SettingKeys, settings } from '../lib/settings'
import pCloudSdk from 'pcloud-sdk-js'

export default {
  props: {
    filename: {
      type: String,
      default: 'new file.txt',
    },
    content: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      app_id: 'swX3uGCh15u',
      token: null,
      client: null,
    }
  },

  watch: {
    async token() {
      // token updated
      //console.log('token updated:', this.token)

      if (!this.token) return

      // save
      await settings.set(SettingKeys.pCloudToken, this.token)

      // await this.upload()
    },
  },

  mounted() {
    // locationid is required, it seems
    window.locationid = 2
  },

  methods: {
    async authenticate(client_id): Promise<string> {
      let result = new Promise((resolve, reject) => {
        // initiate a call to pcloud auth.
        pCloudSdk.oauth.initOauthPollToken({
          client_id: client_id,
          receiveToken: function (access_token) {
            //console.log('authenticated:', access_token)
            //that.token = access_token
            resolve(access_token)
          },
          onError: function (err) {
            console.error(err)
            reject(err)
          },
        })
        //
      })
      return result
    },

    getClient() {
      if (this.client) {
        console.log('client:', this.client)
        return this.client
      }

      const client = pCloudSdk.createClient(this.token)

      this.client = client

      return client
    },

    async onImgClick() {
      // load token
      const token = await settings.get(SettingKeys.pCloudToken)
      this.token = token

      if (!token) {
        let newToken = await this.authenticate(this.app_id)
        this.token = newToken
      } else {
        // upload
        await this.upload()
      }
    },

    async upload() {
      const client = this.getClient()

      const file = new File([this.content], this.filename)

      const result = await client.upload(file, 0)

      const name = result.metadata.name
      this.$q.notify({ message: 'Uploaded: ' + name, color: 'primary' })
      console.log('upload:', result)
    },
  },
}
</script>
