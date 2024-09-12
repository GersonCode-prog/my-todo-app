// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Reemplaza con tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAsDmNgPtm4KvieVAwkqX5MBt0wcTGfrBI",
    authDomain: "to-do-list-56af4.firebaseapp.com",
    projectId: "to-do-list-56af4",
    storageBucket: "to-do-list-56af4.appspot.com",
    messagingSenderId: "405541997361",
    appId: "1:405541997361:web:43c59187a24a66cfd6be10"
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
