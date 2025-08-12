// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuración de Firebase para MenteAzul
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validar que todas las variables necesarias estén presentes
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes para Firebase:', missingVars);
  throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`);
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics solo en producción
export const analytics = typeof window !== 'undefined' && process.env.NODE_ENV === 'production' 
  ? getAnalytics(app) 
  : null;

// Configuración de reglas de Firestore para el proyecto
export const firestoreRules = {
  // Estructura de colecciones para MenteAzul
  collections: {
    users: 'users/{userId}',
    gameProgress: 'users/{userId}/gameProgress/{gameId}',
    achievements: 'users/{userId}/achievements/{achievementId}',
    sessions: 'users/{userId}/sessions/{sessionId}',
    feedback: 'feedback/{feedbackId}',
    content: 'content/{contentId}',
    analytics: 'analytics/{analyticsId}'
  },
  
  // Indices recomendados
  indexes: [
    {
      collection: 'users',
      fields: ['email', 'role', 'subscription.status']
    },
    {
      collection: 'gameProgress',
      fields: ['userId', 'gameId', 'completedAt']
    },
    {
      collection: 'sessions',
      fields: ['userId', 'startTime', 'endTime']
    }
  ]
};

// Configuración de seguridad para autenticación
export const authConfig = {
  // Dominios permitidos para registro
  allowedDomains: process.env.NODE_ENV === 'production' 
    ? ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'] 
    : null, // En desarrollo permitir todos
    
  // Configuración de providers
  providers: {
    google: {
      enabled: true,
      scopes: ['email', 'profile']
    },
    email: {
      enabled: true,
      requireEmailVerification: process.env.NODE_ENV === 'production'
    }
  },
  
  // Configuración de seguridad
  security: {
    minPasswordLength: 8,
    requireSpecialChar: false, // Para accesibilidad
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutos
  }
};

// Utilidades para manejo de errores de Firebase
export const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'No encontramos una cuenta con este email.',
    'auth/wrong-password': 'La contraseña es incorrecta.',
    'auth/email-already-in-use': 'Ya existe una cuenta con este email.',
    'auth/weak-password': 'La contraseña debe tener al menos 8 caracteres.',
    'auth/invalid-email': 'El formato del email no es válido.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
    'auth/popup-closed-by-user': 'El proceso de inicio de sesión fue cancelado.',
    'auth/cancelled-popup-request': 'Solo se puede abrir una ventana de inicio de sesión a la vez.',
    'permission-denied': 'No tienes permisos para realizar esta acción.',
    'unavailable': 'El servicio no está disponible temporalmente.',
    'deadline-exceeded': 'La operación tardó demasiado tiempo. Intenta de nuevo.'
  };

  return errorMessages[errorCode] || 'Ha ocurrido un error inesperado. Intenta de nuevo.';
};

// Configuración de colecciones de Firestore
export const collections = {
  USERS: 'users',
  GAME_PROGRESS: 'gameProgress',
  ACHIEVEMENTS: 'achievements',
  SESSIONS: 'sessions',
  FEEDBACK: 'feedback',
  CONTENT: 'content',
  ANALYTICS: 'analytics'
} as const;

console.log('✅ Firebase configurado correctamente para MenteAzul');

export default app;