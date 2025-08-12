// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserProfile } from '../../contexts/AuthContext';
import './LoginForm.css';

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
        // Crear perfil con tipos seguros
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
            achievements: []
          }
        };

        // Solo agregar datos del niño si el rol es 'parent' y los campos están llenos
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

  if (showForgotPassword) {
    return (
      <div className="login-form">
        <div className="form-container">
          <h2>Recuperar Contraseña</h2>
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="tu@email.com"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Enviando...' : 'Enviar Email de Recuperación'}
            </button>
            
            <button 
              type="button" 
              onClick={() => setShowForgotPassword(false)}
              className="link-btn"
            >
              Volver al login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-form">
      <div className="form-container">
        <h2>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label htmlFor="displayName">Nombre completo:</label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Rol:</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="parent">Padre/Madre</option>
                  <option value="therapist">Terapeuta</option>
                  <option value="educator">Educador</option>
                </select>
              </div>

              {formData.role === 'parent' && (
                <>
                  <div className="form-group">
                    <label htmlFor="childName">Nombre del niño/a (opcional):</label>
                    <input
                      id="childName"
                      name="childName"
                      type="text"
                      value={formData.childName}
                      onChange={handleInputChange}
                      placeholder="Nombre del niño/a"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="childAge">Edad del niño/a (opcional):</label>
                    <input
                      id="childAge"
                      name="childAge"
                      type="number"
                      min="2"
                      max="18"
                      value={formData.childAge}
                      onChange={handleInputChange}
                      placeholder="Edad"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="diagnosis">Diagnóstico (opcional):</label>
                    <select
                      id="diagnosis"
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                    >
                      <option value="tea">TEA (Trastorno del Espectro Autista)</option>
                      <option value="asperger">Síndrome de Asperger</option>
                      <option value="autismo">Autismo Clásico</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Tu contraseña"
              minLength={6}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Procesando...' : (isRegister ? 'Crear Cuenta' : 'Iniciar Sesión')}
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="google-btn"
        >
          <span>🔑</span>
          Continuar con Google
        </button>

        <div className="form-footer">
          <button 
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="link-btn"
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
          
          {!isRegister && (
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="link-btn"
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