<template>
  <q-page padding class="bg-colour1 text-colour2">
    <div>
      <q-input label="Remote location" dark v-model="url" />

      <q-btn label="test" @click="login" />
    </div>
  </q-page>
</template>

<script>
import { MAIN_TOOLBAR, SET_TITLE } from "../mutations";
import pCloudSdk from "pcloud-sdk-js";
const CLIENT_ID = 'swX3uGCh15u';

export default {
  data() {
    return {
      url: null,
      access_token: false,
      client: false
    };
  },

  created() {
    this.$store.commit(MAIN_TOOLBAR, true);
    this.$store.commit(SET_TITLE, "WebDAV");
  },

  methods: {
    children(metadata) {
      return Promise.resolve(metadata.contents);
    },
    files(metadata) {
      return this.children(metadata).then(this.filter(f => !f.isfolder));
    },
    filter(f) {
      return (iterable) => {
        var ret = [];
        for (var n in iterable) {
          if (f(iterable[n])) {
            ret.push(iterable[n]);
          }
        }
        return ret;
      }
    },
    flat(iterable) {
      var ret = 0;
      for (var n in iterable) {
        ret += iterable[n];
        console.log(iterable[n]);
      }
      return Promise.resolve(ret);
    },
    folderSize(folderid) {
      console.log(folderid);

      return this.client
        .listfolder(0)
        .then(this.files)
        .then(this.map(this.size))
        .then(this.flat);
    },
    folderItems(folderid) {
      console.log(folderid);

      return this.client
        .listfolder(0)
        .then(this.children)
        .then(this.map(this.name));
    },

    login() {
      //   let url = "https://webdav.pcloud.com";
    //   this.loginWithRedirect();
        this.loginWithoutRedirect();
    },

    loginWithRedirect() {
      pCloudSdk.oauth.initOauthToken({
        client_id: CLIENT_ID,
        redirect_uri: "http://127.0.0.1:8080/oauth.html",
        receiveToken: this.receiveTokenCb,
        onError: err => console.log(err)
      });
    },
    loginWithoutRedirect() {
      pCloudSdk.oauth.initOauthPollToken({
        client_id: CLIENT_ID,
        receiveToken: this.receiveTokenCb,
        onError: err => console.log(err)
      });
    },

    map(f) {
      return array => {
        return Promise.resolve(array.map(f));
      };
    },
    name(metadata) {
      return metadata.name;
    },

    receiveTokenCb(token) {
      console.log(token);
      this.access_token = token;
      this.client = pCloudSdk.createClient(token);
      this.folderSize(0).then(a => {
        console.log("Size: ", a);
      });
      this.folderItems(0).then(a => {
        console.log("Items: ", a);
      });
    },
    size(metadata) {
      return metadata.size;
    }
  }
};
</script>