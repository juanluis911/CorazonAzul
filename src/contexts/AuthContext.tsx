// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Tipos para el usuario de MenteAzul
interface MenteAzulUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'parent' | 'educator' | 'admin';
  profile: {
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
      totalPlayTime: number;
      favoriteCategories: string[];
      currentLevel: number;
    };
  };
  subscription: {
    plan: 'free' | 'premium';
    status: 'active' | 'expired' | 'trial';
    expiresAt?: Date;
  };
  createdAt: Date;
  lastLoginAt: Date;
}

interface AuthContextType {
  user: MenteAzulUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, userData: Partial<MenteAzulUser>) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<MenteAzulUser['profile']>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
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

  // Configuración de Google Provider
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  // Crear perfil de usuario por defecto
  const createDefaultProfile = (firebaseUser: FirebaseUser, role: MenteAzulUser['role'] = 'parent'): Omit<MenteAzulUser, 'uid'> => ({
    email: firebaseUser.email!,
    displayName: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
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
        totalPlayTime: 0,
        favoriteCategories: [],
        currentLevel: 1
      }
    },
    subscription: {
      plan: 'free',
      status: 'active'
    },
    createdAt: new Date(),
    lastLoginAt: new Date()
  });

  // Obtener o crear usuario en Firestore
  const getOrCreateUser = async (firebaseUser: FirebaseUser): Promise<MenteAzulUser> => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Actualizar último login
      const userData = userDoc.data() as MenteAzulUser;
      await updateDoc(userDocRef, {
        lastLoginAt: new Date()
      });
      
      // Convertir timestamps de Firestore a Date
      return {
        ...userData,
        uid: firebaseUser.uid,
        createdAt: userData.createdAt.toDate ? userData.createdAt.toDate() : userData.createdAt,
        lastLoginAt: new Date()
      } as MenteAzulUser;
    } else {
      // Crear nuevo usuario
      const newUserData = {
        ...createDefaultProfile(firebaseUser),
        uid: firebaseUser.uid
      };

      await setDoc(userDocRef, {
        ...newUserData,
        createdAt: new Date(),
        lastLoginAt: new Date()
      });

      console.log('✅ Nuevo usuario creado en MenteAzul:', newUserData.email);
      return newUserData;
    }
  };

  // Iniciar sesión con Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const userData = await getOrCreateUser(result.user);
      setUser(userData);
      
      // Anunciar a lectores de pantalla
      if (window.announceToScreenReader) {
        window.announceToScreenReader(`Bienvenido a MenteAzul, ${userData.displayName}`);
      }
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      throw new Error(error.message || 'Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  // Registrarse con email y contraseña
  const signUpWithEmail = async (email: string, password: string, userData: Partial<MenteAzulUser>) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil de Firebase con nombre
      if (userData.displayName) {
        await updateProfile(result.user, {
          displayName: userData.displayName
        });
      }

      // Crear usuario en Firestore con datos personalizados
      const newUserData: MenteAzulUser = {
        ...createDefaultProfile(result.user),
        ...userData,
        uid: result.user.uid,
        email: result.user.email!
      };

      const userDocRef = doc(db, 'users', result.user.uid);
      await setDoc(userDocRef, {
        ...newUserData,
        createdAt: new Date(),
        lastLoginAt: new Date()
      });

      setUser(newUserData);
      
      console.log('✅ Usuario registrado exitosamente:', newUserData.email);
      
      if (window.announceToScreenReader) {
        window.announceToScreenReader(`¡Bienvenido a MenteAzul, ${newUserData.displayName}! Tu cuenta ha sido creada exitosamente.`);
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sesión con email y contraseña
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getOrCreateUser(result.user);
      setUser(userData);
      
      if (window.announceToScreenReader) {
        window.announceToScreenReader(`Bienvenido de vuelta, ${userData.displayName}`);
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      
      if (window.announceToScreenReader) {
        window.announceToScreenReader('Sesión cerrada correctamente');
      }
    } catch (error: any) {
      console.error('Error en logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  };

  // Actualizar perfil de usuario
  const updateUserProfile = async (updates: Partial<MenteAzulUser['profile']>) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedProfile = { ...user.profile, ...updates };
      
      await updateDoc(userDocRef, {
        profile: updatedProfile
      });

      setUser(prev => prev ? { ...prev, profile: updatedProfile } : null);
      
      console.log('✅ Perfil actualizado:', updates);
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      throw new Error('Error al actualizar el perfil');
    }
  };

  // Listener de cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setFirebaseUser(firebaseUser);
        
        if (firebaseUser) {
          const userData = await getOrCreateUser(firebaseUser);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error en listener de auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    logout,
    updateUserProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};