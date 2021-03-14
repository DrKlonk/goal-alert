const VERSION_NUMBER = '1.5'

self.__precacheManifest = [].concat(self.__precacheManifest || [])

workbox.setConfig({
  debug: true
})

workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

let clickOpenUrl

self.addEventListener('push', event => {
  clickOpenUrl = 'https://goal-alert.herokuapp.com'
  const options = {
    body: 'Jenk me naar de app!!@!',
    icon: './img/icons/apple-touch-icon.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: 'vibration-sample'
  }
  event.waitUntil(
    self.registration.showNotification(event.data.text(), options)
  )
})

self.addEventListener('notificationclick', event => {
  const clickedNotification = event.notification
  clickedNotification.close()
  if (clickOpenUrl) {
    const promiseChain = clients.openWindow(clickOpenUrl)
    event.waitUntil(promiseChain)
  }
})

self.addEventListener('install', function (event) {
  // Make sure the new SW gets used immediately
  self.skipWaiting()
})
