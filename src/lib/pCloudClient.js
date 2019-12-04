/*
    Client that communicates to pCloud service.
*/
import pCloudSdk from "pcloud-sdk-js";
const CLIENT_ID = "swX3uGCh15u";

class PcloudClient {
  constructor() {
    this.access_token = null;
    this.client = null;
  }

  loginWithRedirect() {
    pCloudSdk.oauth.initOauthToken({
      client_id: CLIENT_ID,
      redirect_uri: "http://127.0.0.1:8080/oauth.html",
      receiveToken: this.receiveTokenCb,
      onError: err => console.log(err)
    });
  }
  loginWithoutRedirect() {
      let that = this
    pCloudSdk.oauth.initOauthPollToken({
      client_id: CLIENT_ID,
    //   receiveToken: this.receiveTokenCb,
        receiveToken: function(token) {
            // that.access_token = token
            // console.log(that.access_token)
            that.receiveTokenCb(token)
        },
      onError: err => console.log(err)
    });
  }

  fetch() {
    this.ensureLoggedIn();
    // todo fetch the backup file
    return this.access_token;
  }
  store(content) {
    this.ensureLoggedIn();

    console.log(content)
    // remoteupload(url: string, folderid: number, options: UploadOptions): Promise<metadata>
    //this.client.remoteUpload('url', 0, {}, false)
    //this.client.upload('file', 0, null, false)
    return "incomplete";
  }

  ensureLoggedIn() {
    if (!this.access_token) {
      this.loginWithoutRedirect();
    }
  }

  children(metadata) {
    return Promise.resolve(metadata.contents);
  }
  files(metadata) {
    return this.children(metadata).then(this.filter(f => !f.isfolder));
  }
  filter(f) {
    return iterable => {
      var ret = [];
      for (var n in iterable) {
        if (f(iterable[n])) {
          ret.push(iterable[n]);
        }
      }
      return ret;
    };
  }
  flat(iterable) {
    var ret = 0;
    for (var n in iterable) {
      ret += iterable[n];
      console.log(iterable[n]);
    }
    return Promise.resolve(ret);
  }
  folderSize(folderid) {
    console.log(folderid);

    return this.client
      .listfolder(0)
      .then(this.files)
      .then(this.map(this.size))
      .then(this.flat);
  }
  folderItems(folderid) {
    console.log(folderid);

    return this.client
      .listfolder(0)
      .then(this.children)
      .then(this.map(this.name));
  }
  map(f) {
    return array => {
      return Promise.resolve(array.map(f));
    };
  }
  name(metadata) {
    return metadata.name;
  }
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
  }
  size(metadata) {
    return metadata.size;
  }
}

export default PcloudClient;
