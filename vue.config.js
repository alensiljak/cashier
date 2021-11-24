module.exports = {
  pluginOptions: {
    quasar: {
      treeShake: true
    }
  },
  transpileDependencies: [
    /[\\\/]node_modules[\\\/]quasar[\\\/]/
  ],
  pwa: {
  //   // configure the workbox plugin
  //   workboxPluginMode: 'InjectManifest',
    workboxOptions: {
  //       // swSrc is required in InjectManifest mode.
  //       swSrc: 'public/service-worker.js',
  //       // ...other Workbox options...
      skipWaiting: true
    }
  }
}
