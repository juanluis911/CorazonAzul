// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserProfile } from '../../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
  displayName: string;
  role: 'parent' | 'therapist' | 'educator';
  childName: string;
  childAge: string;
  diagnosis: 'tea' | 'asperger' | 'autismo' | 'otro';
}

const LoginForm: React.FC = () => {
  const { login, register, loginWithGoogle, resetPassword, loading, error, clearError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    displayName: '',
    role: 'parent',
    childName: '',
    childAge: '',
    diagnosis: 'tea'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isRegister) {
        const profile: UserProfile = {
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
            achievements: [],
            currentLevel: 1
          }
        };

        if (formData.role === 'parent') {
          if (formData.childName.trim()) {
            profile.childName = formData.childName.trim();
          }
          if (formData.childAge && !isNaN(parseInt(formData.childAge))) {
            profile.childAge = parseInt(formData.childAge);
          }
          if (formData.diagnosis) {
            profile.diagnosis = formData.diagnosis;
          }
        }

        await register(formData.email, formData.password, {
          displayName: formData.displayName,
          role: formData.role,
          profile
        });
      } else {
        await login(formData.email, formData.password);
      }
    } catch (error) {
      console.error('Error en formulario:', error);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      alert('Por favor ingresa tu email');
      return;
    }
    
    try {
      await resetPassword(formData.email);
      alert('Email de recuperación enviado');
      setShowForgotPassword(false);
    } catch (error) {
      console.error('Error enviando email de recuperación:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Error en login con Google:', error);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '450px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '30px'
    },
    logo: {
      fontSize: '48px',
      marginBottom: '10px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#2c3e50',
      margin: '0 0 8px 0'
    },
    subtitle: {
      color: '#7f8c8d',
      fontSize: '16px',
      margin: 0
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px'
    },
    label: {
      color: '#2c3e50',
      fontSize: '14px',
      fontWeight: '600'
    },
    input: {
      padding: '12px 16px',
      border: '2px solid #e1e8ed',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    select: {
      padding: '12px 16px',
      border: '2px solid #e1e8ed',
      borderRadius: '12px',
      fontSize: '16px',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none'
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '14px 24px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '10px'
    },
    googleBtn: {
      background: 'white',
      color: '#2c3e50',
      border: '2px solid #e1e8ed',
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.3s ease'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '20px 0',
      color: '#7f8c8d'
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: '#e1e8ed'
    },
    dividerText: {
      padding: '0 15px',
      fontSize: '14px'
    },
    linkBtn: {
      background: 'none',
      border: 'none',
      color: '#667eea',
      fontSize: '14px',
      cursor: 'pointer',
      textDecoration: 'underline',
      padding: '5px 0'
    },
    footer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '10px',
      alignItems: 'center',
      marginTop: '20px'
    },
    errorMessage: {
      background: '#ffe6e6',
      color: '#c0392b',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      border: '1px solid #ffcccb'
    },
    roleSection: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e9ecef'
    },
    roleSectionTitle: {
      color: '#495057',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '15px',
      textAlign: 'center' as const
    }
  };

  if (showForgotPassword) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>🧠💙</div>
            <h2 style={styles.title}>Recuperar Contraseña</h2>
            <p style={styles.subtitle}>Te enviaremos un enlace de recuperación</p>
          </div>
          
          <form onSubmit={handleForgotPassword} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="tu@email.com"
                style={styles.input}
              />
            </div>
            
            {error && <div style={styles.errorMessage}>{error}</div>}
            
            <button 
              type="submit" 
              disabled={loading} 
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Enviando...' : 'Enviar Email de Recuperación'}
            </button>
            
            <button 
              type="button" 
              onClick={() => setShowForgotPassword(false)}
              style={styles.linkBtn}
            >
              ← Volver al login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>🧠💙</div>
          <h2 style={styles.title}>MenteAzul</h2>
          <p style={styles.subtitle}>
            {isRegister ? 'Crea tu cuenta para comenzar' : 'Bienvenido de vuelta'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre completo *</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                  placeholder="Tu nombre completo"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>¿Cuál es tu rol? *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  style={styles.select}
                >
                  <option value="parent">👨‍👩‍👧‍👦 Padre/Madre</option>
                  <option value="therapist">🩺 Terapeuta</option>
                  <option value="educator">👩‍🏫 Educador</option>
                </select>
              </div>

              {formData.role === 'parent' && (
                <div style={styles.roleSection}>
                  <h4 style={styles.roleSectionTitle}>Información del niño/a (opcional)</h4>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nombre del niño/a</label>
                    <input
                      type="text"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                      placeholder="Nombre del niño/a"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Edad</label>
                    <input
                      type="number"
                      name="childAge"
                      min="2"
                      max="18"
                      value={formData.childAge}
                      onChange={handleInputChange}
                      placeholder="Edad en años"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Diagnóstico</label>
                    <select
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                      style={styles.select}
                    >
                      <option value="tea">🧩 TEA (Trastorno del Espectro Autista)</option>
                      <option value="asperger">🎯 Síndrome de Asperger</option>
                      <option value="autismo">🌟 Autismo Clásico</option>
                      <option value="otro">📋 Otro</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="tu@email.com"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              style={styles.input}
            />
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              transform: loading ? 'scale(0.98)' : 'scale(1)'
            }}
          >
            {loading ? (
              <span>⏳ Procesando...</span>
            ) : (
              isRegister ? '🚀 Crear Cuenta' : '🔓 Iniciar Sesión'
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>o</span>
          <div style={styles.dividerLine}></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={{
            ...styles.googleBtn,
            opacity: loading ? 0.7 : 1
          }}
        >
          <span style={{ fontSize: '20px' }}>🔑</span>
          Continuar con Google
        </button>

        <div style={styles.footer}>
          <button 
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              clearError();
            }}
            style={styles.linkBtn}
          >
            {isRegister 
              ? '¿Ya tienes cuenta? Inicia sesión aquí' 
              : '¿No tienes cuenta? Regístrate gratis'
            }
          </button>
          
          {!isRegister && (
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              style={styles.linkBtn}
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;