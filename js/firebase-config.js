// ==========================================
//  PawDee — Firebase Configuration
//  วิธีใช้:
//  1. ไปที่ https://console.firebase.google.com
//  2. สร้าง project ใหม่ชื่อ "pawdee"
//  3. ไปที่ Project Settings > General > Your apps > Add app > Web (</>)
//  4. Copy firebaseConfig ด้านล่าง แล้ว paste แทนค่า placeholder
//  5. ไปที่ Firestore Database > Create database > Start in test mode
// ==========================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const firebaseConfig = {
  apiKey:            "AIzaSyABryVHH_TrpqXoBfxCLSK0eyxoMltq6pU",
  authDomain:        "www.pawdeepet.com",
  projectId:         "pawdee-f082e",
  storageBucket:     "pawdee-f082e.firebasestorage.app",
  messagingSenderId: "982501650315",
  appId:             "1:982501650315:web:0ba53f82a0b35018b9c98e",
  measurementId:     "G-N483DX9HY6"
};

// true เมื่อ apiKey เป็น key จริงจาก Firebase (ขึ้นต้นด้วย AIza)
const isConfigured = firebaseConfig.apiKey.startsWith('AIza');

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, isConfigured };
