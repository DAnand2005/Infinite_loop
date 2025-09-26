import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-4537167361-7fcf4",
  "appId": "1:380992317849:web:c76074b9062609f8a04b08",
  "apiKey": "AIzaSyB97-g4BlDOlxWJ-kRzy61ykKDHa4pqVR0",
  "authDomain": "studio-4537167361-7fcf4.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "380992317849"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
