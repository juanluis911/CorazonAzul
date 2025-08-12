// src/types/global.d.ts
// Tipos globales para la aplicación

declare global {
  interface Window {
    announceToScreenReader?: (message: string) => void;
  }
}

// Tipos para Firestore Timestamp
export interface FirestoreTimestamp {
  toDate(): Date;
  seconds: number;
  nanoseconds: number;
}

// Extender tipos de datos de Firestore
export type FirestoreData<T> = {
  [K in keyof T]: T[K] extends Date 
    ? Date | FirestoreTimestamp 
    : T[K] extends object 
    ? FirestoreData<T[K]> 
    : T[K];
};

// Exportar para que TypeScript reconozca el módulo
export {};