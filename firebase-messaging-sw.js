importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCsYwhMwrFahVQwUG3fbjVW7zoG7g6weLk",
    authDomain: "hiweb-c92a4.firebaseapp.com",
    projectId: "hiweb-c92a4",
    storageBucket: "hiweb-c92a4.firebasestorage.app",
    messagingSenderId: "323046508146",
    appId: "1:323046508146:web:edf5b391033a237943e4eb",
    measurementId: "G-P0Q4KHLELH"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification?.title || 'Thông báo mới';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/assets/img/logo.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
