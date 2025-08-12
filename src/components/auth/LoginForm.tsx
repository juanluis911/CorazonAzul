// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../../config/firebase';
import './LoginForm.css';

interface LoginFormProps {
  onClose?: () => void;
}

type AuthMode = 'login' | 'register' | 'welcome';

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'parent' as 'parent' | 'educator',
    childName: '',
    childAge: '',
    diagnosis: 'tea' as 'tea' | 'asperger' | 'autismo' | 'otro'
  });

  // Manejar cambios en inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Limpiar error al escribir
  };

  // Validar formulario
  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Email y contraseña son requeridos');
      return false;
    }

    if (mode === 'register') {
      if (!formData.displayName) {
        setError('El nombre es requerido');
        return false;
      }
      
      if (formData.role === 'parent' && !formData.childName) {
        setError('El nombre del niño es requerido');
        return false;
      }
      
      if (formData.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return false;
      }
    }

    return true;
  };

  // Manejar login con Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (error: any) {
      setError(getFirebaseErrorMessage(error.code || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Manejar login con email
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      
      if (mode === 'register') {
        await signUpWithEmail(formData.email, formData.password, {
          displayName: formData.displayName,
          role: formData.role,
          profile: {
            childName: formData.role === 'parent' ? formData.childName : undefined,
            childAge: formData.role === 'parent' && formData.childAge ? parseInt(formData.childAge) : undefined,
            diagnosis: formData.role === 'parent' ? formData.diagnosis : undefined,
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
      } else {
        await signInWithEmail(formData.email, formData.password);
      }
    } catch (error: any) {
      setError(getFirebaseErrorMessage(error.code || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Render pantalla de bienvenida
  if (mode === 'welcome') {
    return (
      <div className="login-overlay">
        <div className="login-modal">
          <div className="login-header">
            <h2>¡Bienvenido a MenteAzul! 🧩</h2>
            <p className="welcome-subtitle">
              Para comenzar a usar nuestra plataforma educativa especializada, 
              necesitas crear una cuenta o iniciar sesión.
            </p>
          </div>

          <div className="auth-benefits">
            <h3>Con tu cuenta podrás:</h3>
            <ul>
              <li>🎮 Acceder a todos los juegos educativos</li>
              <li>📊 Seguir el progreso de aprendizaje</li>
              <li>⚙️ Personalizar la experiencia</li>
              <li>🏆 Desbloquear logros y recompensas</li>
              <li>📚 Acceder a recursos para padres</li>
            </ul>
          </div>

          <div className="auth-buttons">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="google-btn"
              aria-label="Iniciar sesión con Google"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Conectando...' : 'Continuar con Google'}
            </button>

            <div className="divider">
              <span>o</span>
            </div>

            <button
              onClick={() => setMode('login')}
              className="email-btn secondary"
            >
              Iniciar sesión con email
            </button>

            <button
              onClick={() => setMode('register')}
              className="email-btn primary"
            >
              Crear cuenta nueva
            </button>
          </div>

          <div className="privacy-notice">
            <p>
              <small>
                Al registrarte, aceptas nuestros términos de servicio y política de privacidad.
                MenteAzul está diseñado específicamente para la seguridad y privacidad de menores.
              </small>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render formulario de login/registro
  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button 
          className="back-btn"
          onClick={() => setMode('welcome')}
          aria-label="Volver a opciones de inicio"
        >
          ← Volver
        </button>

        <div className="login-header">
          <h2>
            {mode === 'login' ? '👋 Iniciar Sesión' : '🌟 Crear Cuenta'}
          </h2>
          <p>
            {mode === 'login' 
              ? 'Ingresa tus datos para acceder a MenteAzul'
              : 'Completa la información para crear tu cuenta'
            }
          </p>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="login-form">
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label htmlFor="displayName">Tu nombre *</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Ej: María García"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Eres... *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="parent">Padre/Madre/Cuidador</option>
                  <option value="educator">Educador/Terapeuta</option>
                </select>
              </div>

              {formData.role === 'parent' && (
                <>
                  <div className="form-group">
                    <label htmlFor="childName">Nombre del niño/a *</label>
                    <input
                      type="text"
                      id="childName"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="childAge">Edad del niño/a</label>
                    <input
                      type="number"
                      id="childAge"
                      name="childAge"
                      value={formData.childAge}
                      onChange={handleInputChange}
                      placeholder="Ej: 6"
                      min="2"
                      max="18"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="diagnosis">Diagnóstico (opcional)</label>
                    <select
                      id="diagnosis"
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                    >
                      <option value="tea">Trastorno del Espectro Autista (TEA)</option>
                      <option value="asperger">Síndrome de Asperger</option>
                      <option value="autismo">Autismo</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading 
              ? (mode === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...') 
              : (mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')
            }
          </button>

          <div className="form-footer">
            {mode === 'login' ? (
              <p>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="link-btn"
                >
                  Crear una aquí
                </button>
              </p>
            ) : (
              <p>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="link-btn"
                >
                  Iniciar sesión
                </button>
              </p>
            )}
          </div>
        </form>

        <div className="alternative-login">
          <div className="divider">
            <span>o</span>
          </div>
          
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="google-btn"
            aria-label="Iniciar sesión con Google"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Conectando...' : 'Continuar con Google'}
          </button>
        </div>

        {mode === 'register' && (
          <div className="register-notice">
            <p>
              <small>
                Al crear una cuenta, confirmas que eres mayor de edad y aceptas 
                nuestros términos de servicio. MenteAzul cumple con COPPA y 
                regulaciones de protección de menores.
              </small>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;