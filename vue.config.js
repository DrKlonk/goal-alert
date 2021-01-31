module.exports = {
  pwa: {
    name: 'Atalanta Goal Alert',
    short_name: 'Atalantaaaa!',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    }
  }
}
