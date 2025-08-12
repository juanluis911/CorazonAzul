// src/components/common/UserProfile.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { MenteAzulUser } from '../../contexts/AuthContext';
import './UserProfile.css';

interface UserProfileProps {
  user: MenteAzulUser;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  const { updateUserProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    childName: user.profile.childName || '',
    childAge: user.profile.childAge || '',
    diagnosis: user.profile.diagnosis || 'tea',
    preferences: {
      theme: user.profile.preferences.theme,
      fontSize: user.profile.preferences.fontSize,
      reduceMotion: user.profile.preferences.reduceMotion,
      soundEnabled: user.profile.preferences.soundEnabled
    }
  });

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1] as keyof typeof formData.preferences;
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    setError('');
    setSuccess('');
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      const updates = {
        childName: user.role === 'parent' ? formData.childName : undefined,
        childAge: user.role === 'parent' && formData.childAge ? parseInt(formData.childAge.toString()) : undefined,
        diagnosis: user.role === 'parent' ? formData.diagnosis as 'tea' | 'asperger' | 'autismo' | 'otro' : undefined,
        preferences: formData.preferences
      };

      await updateUserProfile(updates);
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
      
      // Auto-cerrar mensaje de éxito
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error: any) {
      setError(error.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setFormData({
      childName: user.profile.childName || '',
      childAge: user.profile.childAge || '',
      diagnosis: user.profile.diagnosis || 'tea',
      preferences: user.profile.preferences
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="user-profile-overlay" onClick={onClose}>
      <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header del perfil */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Avatar del usuario" 
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="profile-basic-info">
              <h2>{user.displayName}</h2>
              <p className="profile-email">{user.email}</p>
              <span className={`role-badge ${user.role}`}>
                {user.role === 'parent' ? 'Padre/Madre' : 'Educador'}
              </span>
            </div>
          </div>
          
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Cerrar perfil"
          >
            ✕
          </button>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="message error" role="alert">
            {error}
          </div>
        )}
        
        {success && (
          <div className="message success" role="alert">
            {success}
          </div>
        )}

        {/* Contenido del perfil */}
        <div className="profile-content">
          
          {/* Información de la cuenta */}
          <section className="profile-section">
            <h3>Información de la Cuenta</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Fecha de registro:</label>
                <span>
                  {user.createdAt.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="info-item">
                <label>Último acceso:</label>
                <span>
                  {user.lastLoginAt.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="info-item">
                <label>Plan de suscripción:</label>
                <span className={`subscription-badge ${user.subscription.plan}`}>
                  {user.subscription.plan === 'free' ? 'Gratuito' : 'Premium'}
                </span>
              </div>
            </div>
          </section>

          {/* Información del niño (solo para padres) */}
          {user.role === 'parent' && (
            <section className="profile-section">
              <div className="section-header">
                <h3>Información del Niño/a</h3>
                {!isEditing && (
                  <button 
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label htmlFor="childName">Nombre del niño/a:</label>
                    <input
                      type="text"
                      id="childName"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                      placeholder="Nombre del niño/a"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="childAge">Edad:</label>
                    <input
                      type="number"
                      id="childAge"
                      name="childAge"
                      value={formData.childAge}
                      onChange={handleInputChange}
                      min="2"
                      max="18"
                      placeholder="Edad"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="diagnosis">Diagnóstico:</label>
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
                </div>
              ) : (
                <div className="info-display">
                  <div className="info-item">
                    <label>Nombre:</label>
                    <span>{user.profile.childName || 'No especificado'}</span>
                  </div>
                  <div className="info-item">
                    <label>Edad:</label>
                    <span>{user.profile.childAge ? `${user.profile.childAge} años` : 'No especificada'}</span>
                  </div>
                  <div className="info-item">
                    <label>Diagnóstico:</label>
                    <span>
                      {user.profile.diagnosis === 'tea' && 'Trastorno del Espectro Autista (TEA)'}
                      {user.profile.diagnosis === 'asperger' && 'Síndrome de Asperger'}
                      {user.profile.diagnosis === 'autismo' && 'Autismo'}
                      {user.profile.diagnosis === 'otro' && 'Otro'}
                      {!user.profile.diagnosis && 'No especificado'}
                    </span>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Preferencias de accesibilidad */}
          <section className="profile-section">
            <div className="section-header">
              <h3>Preferencias de Accesibilidad</h3>
              {!isEditing && (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="theme">Tema visual:</label>
                  <select
                    id="theme"
                    name="preferences.theme"
                    value={formData.preferences.theme}
                    onChange={handleInputChange}
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="high-contrast">Alto contraste</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="fontSize">Tamaño de texto:</label>
                  <select
                    id="fontSize"
                    name="preferences.fontSize"
                    value={formData.preferences.fontSize}
                    onChange={handleInputChange}
                  >
                    <option value="small">Pequeño</option>
                    <option value="medium">Mediano</option>
                    <option value="large">Grande</option>
                  </select>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="preferences.reduceMotion"
                      checked={formData.preferences.reduceMotion}
                      onChange={handleInputChange}
                    />
                    Reducir animaciones
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="preferences.soundEnabled"
                      checked={formData.preferences.soundEnabled}
                      onChange={handleInputChange}
                    />
                    Habilitar sonidos
                  </label>
                </div>
              </div>
            ) : (
              <div className="preferences-display">
                <div className="preference-item">
                  <span className="preference-label">Tema:</span>
                  <span className="preference-value">
                    {user.profile.preferences.theme === 'light' && 'Claro'}
                    {user.profile.preferences.theme === 'dark' && 'Oscuro'}
                    {user.profile.preferences.theme === 'high-contrast' && 'Alto contraste'}
                  </span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Tamaño de texto:</span>
                  <span className="preference-value">
                    {user.profile.preferences.fontSize === 'small' && 'Pequeño'}
                    {user.profile.preferences.fontSize === 'medium' && 'Mediano'}
                    {user.profile.preferences.fontSize === 'large' && 'Grande'}
                  </span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Animaciones:</span>
                  <span className="preference-value">
                    {user.profile.preferences.reduceMotion ? 'Reducidas' : 'Normales'}
                  </span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">Sonidos:</span>
                  <span className="preference-value">
                    {user.profile.preferences.soundEnabled ? 'Habilitados' : 'Deshabilitados'}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Progreso del usuario */}
          <section className="profile-section">
            <h3>Progreso de Aprendizaje</h3>
            <div className="progress-stats">
              <div className="stat-item">
                <div className="stat-value">{user.profile.progress.gamesCompleted}</div>
                <div className="stat-label">Juegos Completados</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{user.profile.progress.currentLevel}</div>
                <div className="stat-label">Nivel Actual</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {Math.floor(user.profile.progress.totalPlayTime / 60)}min
                </div>
                <div className="stat-label">Tiempo Total</div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer del perfil */}
        <div className="profile-footer">
          {isEditing ? (
            <div className="edit-actions">
              <button 
                className="save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              <button 
                className="cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="profile-actions">
              <button 
                className="logout-btn"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;