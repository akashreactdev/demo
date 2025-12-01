importScripts(
  "https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyASJTtjRFVnEbLR5MLXiltGTYOx-IQ2Iso",
  authDomain: "zorbee-health.firebaseapp.com",
  projectId: "zorbee-health",
  storageBucket: "zorbee-health.firebasestorage.app",
  messagingSenderId: "198615154587",
  appId: "1:198615154587:web:6a041ffd6bb4dfcabfab3e",
  measurementId: "G-484Q24M0C3",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // console.log(
  //   "[firebase-messaging-sw.js] Received background message ",
  //   payload
  // );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
