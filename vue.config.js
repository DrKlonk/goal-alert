module.exports = {
  pwa: {
    name: 'Atalanta Goal Alert',
    shortName: 'Atalantaaaa!',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    },
    themeColor: '#0071BC'
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
        @import "@/scss/_variables.scss";
        @import "@/scss/_mixins.scss";
        `
      }
    }
  }
}
