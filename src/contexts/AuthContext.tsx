// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Definir tipos de usuario
export interface UserProfile {
  childName?: string;
  childAge?: number;
  diagnosis?: 'tea' | 'asperger' | 'autismo' | 'otro';
  preferences: {
    theme: 'light' | 'dark' | 'high-contrast';
    fontSize: 'small' | 'medium' | 'large';
    reduceMotion: boolean;
    soundEnabled: boolean;
  };
  progress: {
    gamesCompleted: number;
    totalTimeSpent: number;
    lastActivity: Date;
    achievements: string[];
  };
}

export interface MenteAzulUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'parent' | 'therapist' | 'educator';
  profile: UserProfile;
  createdAt: Date;
  lastLoginAt: Date;
}

interface AuthContextType {
  user: MenteAzulUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  // Métodos de autenticación
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, userData: Partial<MenteAzulUser>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

// Declarar tipos para window
declare global {
  interface Window {
    announceToScreenReader?: (message: string) => void;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<MenteAzulUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const createDefaultProfile = (firebaseUser: FirebaseUser, role: MenteAzulUser['role'] = 'parent'): Omit<MenteAzulUser, 'uid'> => ({
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
    photoURL: firebaseUser.photoURL || undefined,
    role,
    profile: {
      preferences: {
        theme: 'light',
        fontSize: 'medium',
        reduceMotion: false,
        soundEnabled: true
      },
      progress: {
        gamesCompleted: 0,
        totalTimeSpent: 0,
        lastActivity: new Date(),
        achievements: []
      }
    },
    createdAt: new Date(),
    lastLoginAt: new Date()
  });

  const saveUserToFirestore = async (userData: MenteAzulUser) => {
    try {
      const userRef = doc(db, 'users', userData.uid);
      const dataToSave = {
        ...userData,
        createdAt: Timestamp.fromDate(userData.createdAt),
        lastLoginAt: Timestamp.fromDate(userData.lastLoginAt),
        'profile.progress.lastActivity': Timestamp.fromDate(userData.profile.progress.lastActivity)
      };
      await setDoc(userRef, dataToSave, { merge: true });
    } catch (error) {
      console.error('Error guardando usuario en Firestore:', error);
      throw error;
    }
  };

  const loadUserFromFirestore = async (firebaseUser: FirebaseUser): Promise<MenteAzulUser> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        ...userData,
        uid: firebaseUser.uid,
        createdAt: userData.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData.createdAt,
        lastLoginAt: new Date()
      } as MenteAzulUser;
    } else {
      const newUserData = {
        uid: firebaseUser.uid,
        ...createDefaultProfile(firebaseUser)
      };
      await saveUserToFirestore(newUserData);
      return newUserData;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const userData = await loadUserFromFirestore(result.user);
      
      setUser(userData);
      setFirebaseUser(result.user);
      
      // Anunciar a lectores de pantalla
      if (window.announceToScreenReader) {
        window.announceToScreenReader(`Bienvenido a MenteAzul, ${userData.displayName}`);
      }
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      setError(error.message || 'Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: Partial<MenteAzulUser>) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Actualizar perfil de Firebase si se proporciona displayName
      if (userData.displayName) {
        await updateProfile(firebaseUser, { displayName: userData.displayName });
      }
      
      const newUserData: MenteAzulUser = {
        uid: firebaseUser.uid,
        ...createDefaultProfile(firebaseUser, userData.role),
        ...userData,
        email: firebaseUser.email || email,
        displayName: userData.displayName || firebaseUser.email?.split('@')[0] || 'Usuario'
      };
      
      await saveUserToFirestore(newUserData);
      setUser(newUserData);
      setFirebaseUser(firebaseUser);
      
      console.log('✅ Usuario registrado exitosamente:', newUserData.email);
      
      if (window.announceToScreenReader) {
        window.announceToScreenReader(`¡Bienvenido a MenteAzul, ${newUserData.displayName}! Tu cuenta ha sido creada exitosamente.`);
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      setError(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await loadUserFromFirestore(userCredential.user);
      
      setUser(userData);
      setFirebaseUser(userCredential.user);
      
      if (window.announceToScreenReader) {
        window.announceToScreenReader(`Bienvenido de vuelta, ${userData.displayName}`);
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      
      if (window.announceToScreenReader) {
        window.announceToScreenReader('Sesión cerrada correctamente');
      }
    } catch (error: any) {
      console.error('Error en logout:', error);
      setError(error.message || 'Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Error en reset password:', error);
      setError(error.message || 'Error al enviar email de recuperación');
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !firebaseUser) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData: any = {};
      
      // Construir update data de forma segura
      Object.keys(updates).forEach(key => {
        const value = updates[key as keyof UserProfile];
        if (value !== undefined) {
          updateData[`profile.${key}`] = value;
        }
      });
      
      await updateDoc(userRef, updateData);
      
      // Actualizar estado local
      setUser(prevUser => prevUser ? {
        ...prevUser,
        profile: { ...prevUser.profile, ...updates }
      } : null);
      
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  };

  // Listener de cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        
        if (firebaseUser) {
          const userData = await loadUserFromFirestore(firebaseUser);
          setUser(userData);
          setFirebaseUser(firebaseUser);
        } else {
          setUser(null);
          setFirebaseUser(null);
        }
      } catch (error) {
        console.error('Error en auth state change:', error);
        setError('Error al cargar datos del usuario');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    error,
    loginWithGoogle,
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};