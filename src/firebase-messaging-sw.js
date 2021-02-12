importScripts("https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.4.0/firebase-messaging.js");
importScripts("https://www.gstatic.com/firebasejs/7.4.0/firebase-analytics.js");

firebase.initializeApp({
  apiKey: "AIzaSyC8dNCldCiiRt_IUnX5VrYuerU8_l_DRLc",
  authDomain: "emoha-app.firebaseapp.com",
  databaseURL: "https://emoha-app.firebaseio.com",
  projectId: "emoha-app",
  storageBucket: "emoha-app.appspot.com",
  messagingSenderId: "735433530594",
  appId: "1:735433530594:web:16bff850ed4a1fb390d2bb",
  measurementId: "G-3S99RMNFLC"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  return self.registration.showNotification(
    payload.data.title,
    Object.assign({ data: payload.data }, payload.data)
  );
});

self.onnotificationclick = function(event) {
  
  let url = event.notification.data.tag;
  event.notification.close();
  const promiseChain = clients
       .matchAll({
           type: "window",
           includeUncontrolled: true
        })
       .then(windowClients => {
        console.log(windowClients)
           let matchingClient = null;
           for (let i = 0; i < windowClients.length; i++) {
               const windowClient = windowClients[i];
               console.log(windowClient.url, url)
               if (windowClient.url === url) {
                   matchingClient = windowClient;
                   break;
               }
           }
           if (matchingClient) {
             console.log('match')
               return matchingClient.focus();
           } else {
             console.log('not match')
               return clients.openWindow(url);
           }
       });
       event.waitUntil(promiseChain);
};
