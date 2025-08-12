// src/config/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Configuración de Firebase con validación de variables de entorno
const requiredEnvVars = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validar que todas las variables requeridas estén definidas
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno de Firebase faltantes:', missingVars);
  throw new Error(`Variables de entorno de Firebase faltantes: ${missingVars.join(', ')}`);
}

// Configuración de Firebase con tipos seguros
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey!,
  authDomain: requiredEnvVars.authDomain!,
  projectId: requiredEnvVars.projectId!,
  storageBucket: requiredEnvVars.storageBucket!,
  messagingSenderId: requiredEnvVars.messagingSenderId!,
  appId: requiredEnvVars.appId!,
  measurementId: requiredEnvVars.measurementId!
};

// Inicializar Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | null = null;
let storage: FirebaseStorage;

try {
  // Inicializar aplicación de Firebase
  app = initializeApp(firebaseConfig);
  
  // Inicializar servicios de Firebase
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Inicializar Analytics solo en producción y si está disponible
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('⚠️ Analytics no disponible:', error);
    }
  }
  
  console.log('✅ Firebase inicializado correctamente');
  console.log('📊 Proyecto:', firebaseConfig.projectId);
  
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error);
  throw error;
}

// Configurar persistencia de autenticación
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('✅ Persistencia de autenticación configurada');
  })
  .catch((error) => {
    console.error('❌ Error configurando persistencia:', error);
  });

// Exportar servicios
export { app, auth, db, analytics, storage };

// Exportar configuración para referencia
export const firebaseProject = firebaseConfig.projectId;

// Utilidades para desarrollo
export const isEmulator = process.env.NODE_ENV === 'development' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

if (isEmulator) {
  console.log('🔧 Modo desarrollo detectado');
  // Aquí podrías conectar a emuladores si los usas
  // import { connectAuthEmulator } from 'firebase/auth';
  // import { connectFirestoreEmulator } from 'firebase/firestore';
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
}