import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyD4zbojj4o8SOv-bDnxZIHlZpaTfBo0R7U",

    authDomain: "staff-preparation-app.firebaseapp.com",

    projectId: "staff-preparation-app",

    storageBucket: "staff-preparation-app.firebasestorage.app",

    messagingSenderId: "399159951833",

    appId: "1:399159951833:web:d8cc5cbd7bdef09d1499c8"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };