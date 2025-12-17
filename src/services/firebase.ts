import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAwUSScaIu4EjE9gNXDE4Ye4gRwn6cJDAw",
  authDomain: "todoapp-native-275f6.firebaseapp.com",
  projectId: "todoapp-native-275f6",
  storageBucket: "todoapp-native-275f6.firebasestorage.app",
  messagingSenderId: "513393784710",
  appId: "1:513393784710:web:bcb50834000aca60ed5e07"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
