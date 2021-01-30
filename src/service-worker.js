self.__precacheManifest = [].concat(self.__precacheManifest || [])

workbox.setConfig({
  debug: true
})

workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

let clickOpenUrl

self.addEventListener('push', event => {
  clickOpenUrl = 'https://goal-alert.herokuapp.com'
  const options = {
    body: event.data.text(),
    icon: './img/icons/apple-touch-icon.png',
    image: './test.jpg',
    vibrate: [200, 100, 200, 100, 200],
    tag: 'vibration-sample'
  }
  event.waitUntil(
    self.registration.showNotification('title', options)
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
