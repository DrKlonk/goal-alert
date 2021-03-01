/* eslint-disable no-console */

import { register } from 'register-service-worker'

const publicKey = 'BNyoiU3hiaZIehXTmGaR5b-TznoGbqQZoG9uMaJ-0JNZIto-EHPeu-WN1TX2Wqj4HjuIduxm6QoxZZJimTmRjKo'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service workert.'
      )

      // Get permission for notifications on startup
      Notification.requestPermission(status => {
        if (status === 'granted') {
          // Add the permission to the database
          let reg
          navigator.serviceWorker.ready
            .then(swReg => {
              reg = swReg
              return swReg.pushManager.getSubscription()
            })
            .then(existingSub => {
              if (existingSub !== null) {
                console.log('Already subscribed')
                return null
              }
              console.log('Creating a new subscription')
              return reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey)
              })
            })
            .then(newSub => {
              if (newSub == null) {
                return
              }
              console.log('Adding new subscription to MongoDB')
              fetch(
                'https://buttercup-artistic-utahceratops.glitch.me/subscribe',
                {
                  method: 'POST',
                  body: JSON.stringify(newSub),
                  headers: { 'Content-Type': 'application/json' }
                }
              )
            })
            .catch(err => console.error(err))
        }
      })
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}

function urlBase64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
