// PawDee — Auth Module
// ก่อนใช้งาน: Firebase Console → Authentication → Get started
//   1. Enable Email/Password provider
//   2. Enable Google provider
//   3. เพิ่ม localhost ใน Authorized domains (Settings → Authorized domains)

import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const googleProvider   = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// ── Auth actions ──────────────────────────────────────────────
export const signInWithGoogle   = () => signInWithPopup(auth, googleProvider);
export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);

export const signInWithEmail  = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail  = (email, password, displayName) =>
  createUserWithEmailAndPassword(auth, email, password).then(async cred => {
    await updateProfile(cred.user, { displayName });
    return cred;
  });

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export const signOut = () => fbSignOut(auth);

export const getCurrentUser = () => auth.currentUser;

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// ── Navbar updater (เรียกจากทุกหน้า) ─────────────────────────
export function initNavAuth() {
  onAuthStateChanged(auth, user => {
    const navAuth = document.getElementById('navAuth');
    if (!navAuth) return;

    if (user) {
      const avatar = user.photoURL
        ? `<img src="${user.photoURL}" class="w-8 h-8 rounded-full object-cover border-2 border-orange-200"/>`
        : `<div class="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center text-sm font-bold">${(user.displayName || user.email || 'U')[0].toUpperCase()}</div>`;

      navAuth.innerHTML = `
        <div class="flex items-center gap-3">
          <a href="/register-business.html" class="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-orange transition-colors">
            + ลงทะเบียนร้าน
          </a>
          <div class="relative">
            <button id="navAvatarBtn" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
              ${avatar}
              <svg class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
            <div id="navDropdown" class="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 hidden z-50">
              <div class="px-4 py-2 border-b border-gray-100">
                <div class="text-xs font-semibold text-gray-900 truncate">${user.displayName || 'ผู้ใช้'}</div>
                <div class="text-xs text-gray-400 truncate">${user.email}</div>
              </div>
              <a href="/profile.html" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors">👤 โปรไฟล์ของฉัน</a>
              <a href="/register-business.html" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors">🏪 ลงทะเบียนร้าน</a>
              <div id="navAdminSlot"></div>
              <div class="border-t border-gray-100 mt-1 pt-1">
                <button id="navSignOut" class="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">🚪 ออกจากระบบ</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Toggle dropdown on click
      document.getElementById('navAvatarBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('navDropdown')?.classList.toggle('hidden');
      });
      // ปิด dropdown เมื่อคลิกที่อื่น
      document.addEventListener('click', () => {
        document.getElementById('navDropdown')?.classList.add('hidden');
      }, { once: false });
      document.getElementById('navSignOut')?.addEventListener('click', () => signOut());

      // ตรวจสอบ admin แบบ async — ใส่ลิงก์เพิ่มถ้าเป็น admin
      getDoc(doc(db, 'admins', user.uid)).then(snap => {
        if (!snap.exists()) return;
        const slot = document.getElementById('navAdminSlot');
        if (!slot) return;
        slot.innerHTML = `
          <div class="border-t border-gray-100 my-1"></div>
          <a href="/admin.html" class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-orange hover:bg-orange-50 transition-colors">
            🛡️ Admin Dashboard
          </a>`;
      }).catch(() => {});
    } else {
      navAuth.innerHTML = `
        <div class="flex items-center gap-2">
          <a href="/login.html" class="text-sm font-medium text-gray-600 hover:text-brand-orange transition-colors">เข้าสู่ระบบ</a>
          <a href="/login.html?tab=signup" class="hidden sm:inline-flex items-center bg-brand-orange text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-orange-deep transition-all shadow-md">
            เข้าร่วม Waitlist ✨
          </a>
        </div>
      `;
    }
  });
}
