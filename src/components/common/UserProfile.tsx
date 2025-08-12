// src/components/common/UserProfile.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserProfile as UserProfileType } from '../../contexts/AuthContext';
import './UserProfile.css';

interface UserProfileProps {
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, updateUserProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [editData, setEditData] = useState({
    childName: user?.profile.childName || '',
    childAge: user?.profile.childAge?.toString() || '',
    diagnosis: user?.profile.diagnosis || 'tea',
    theme: user?.profile.preferences.theme || 'light',
    fontSize: user?.profile.preferences.fontSize || 'medium',
    reduceMotion: Boolean(user?.profile.preferences.reduceMotion || false),
    soundEnabled: Boolean(user?.profile.preferences.soundEnabled ?? true)
  });

  if (!user) {
    return <div>No hay usuario autenticado</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditData(prev => ({ ...prev, [name]: checked }));
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Crear el objeto de actualización con tipos seguros
      const updates: Partial<UserProfileType> = {
        preferences: {
          theme: editData.theme as 'light' | 'dark' | 'high-contrast',
          fontSize: editData.fontSize as 'small' | 'medium' | 'large',
          reduceMotion: editData.reduceMotion,
          soundEnabled: editData.soundEnabled
        }
      };

      // Solo agregar campos opcionales si tienen valor válido
      if (editData.childName.trim()) {
        updates.childName = editData.childName.trim();
      }
      
      if (editData.childAge && !isNaN(parseInt(editData.childAge))) {
        updates.childAge = parseInt(editData.childAge);
      }
      
      if (editData.diagnosis) {
        updates.diagnosis = editData.diagnosis as 'tea' | 'asperger' | 'autismo' | 'otro';
      }

      await updateUserProfile(updates);
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setError('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      childName: user.profile.childName || '',
      childAge: user.profile.childAge?.toString() || '',
      diagnosis: user.profile.diagnosis || 'tea',
      theme: user.profile.preferences.theme,
      fontSize: user.profile.preferences.fontSize,
      reduceMotion: Boolean(user.profile.preferences.reduceMotion),
      soundEnabled: Boolean(user.profile.preferences.soundEnabled)
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error en logout:', error);
      setError('Error al cerrar sesión');
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="user-info">
          {user.photoURL && (
            <img 
              src={user.photoURL} 
              alt="Foto de perfil" 
              className="profile-photo"
            />
          )}
          <div>
            <h3>{user.displayName}</h3>
            <p className="user-email">{user.email}</p>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
        
        {onClose && (
          <button onClick={onClose} className="close-btn" aria-label="Cerrar perfil">
            ✕
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        {isEditing ? (
          <div className="edit-form">
            <h4>Editar Perfil</h4>
            
            {user.role === 'parent' && (
              <>
                <div className="form-group">
                  <label htmlFor="childName">Nombre del niño/a:</label>
                  <input
                    id="childName"
                    name="childName"
                    type="text"
                    value={editData.childName}
                    onChange={handleInputChange}
                    placeholder="Nombre del niño/a"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="childAge">Edad:</label>
                  <input
                    id="childAge"
                    name="childAge"
                    type="number"
                    min="2"
                    max="18"
                    value={editData.childAge}
                    onChange={handleInputChange}
                    placeholder="Edad"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="diagnosis">Diagnóstico:</label>
                  <select
                    id="diagnosis"
                    name="diagnosis"
                    value={editData.diagnosis}
                    onChange={handleInputChange}
                  >
                    <option value="tea">TEA</option>
                    <option value="asperger">Asperger</option>
                    <option value="autismo">Autismo Clásico</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </>
            )}

            <h5>Preferencias</h5>
            
            <div className="form-group">
              <label htmlFor="theme">Tema:</label>
              <select
                id="theme"
                name="theme"
                value={editData.theme}
                onChange={handleInputChange}
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="high-contrast">Alto Contraste</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fontSize">Tamaño de fuente:</label>
              <select
                id="fontSize"
                name="fontSize"
                value={editData.fontSize}
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
                  name="reduceMotion"
                  checked={editData.reduceMotion}
                  onChange={handleInputChange}
                />
                Reducir animaciones
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="soundEnabled"
                  checked={editData.soundEnabled}
                  onChange={handleInputChange}
                />
                Habilitar sonidos
              </label>
            </div>

            <div className="form-actions">
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="save-btn"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              
              <button 
                onClick={handleCancel}
                disabled={loading}
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <h4>Información del Perfil</h4>
            
            {user.role === 'parent' && (
              <div className="child-info">
                <h5>Información del niño/a</h5>
                <p><strong>Nombre:</strong> {user.profile.childName || 'No especificado'}</p>
                <p><strong>Edad:</strong> {user.profile.childAge || 'No especificada'}</p>
                <p><strong>Diagnóstico:</strong> {user.profile.diagnosis || 'No especificado'}</p>
              </div>
            )}

            <div className="preferences-info">
              <h5>Preferencias</h5>
              <p><strong>Tema:</strong> {user.profile.preferences.theme}</p>
              <p><strong>Tamaño de fuente:</strong> {user.profile.preferences.fontSize}</p>
              <p><strong>Reducir animaciones:</strong> {user.profile.preferences.reduceMotion ? 'Sí' : 'No'}</p>
              <p><strong>Sonidos habilitados:</strong> {user.profile.preferences.soundEnabled ? 'Sí' : 'No'}</p>
            </div>

            <div className="progress-info">
              <h5>Progreso</h5>
              <p><strong>Juegos completados:</strong> {user.profile.progress.gamesCompleted}</p>
              <p><strong>Tiempo total:</strong> {Math.round(user.profile.progress.totalTimeSpent / 60)} minutos</p>
              <p><strong>Logros:</strong> {user.profile.progress.achievements.length}</p>
            </div>

            <div className="profile-actions">
              <button 
                onClick={() => setIsEditing(true)}
                className="edit-btn"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="profile-footer">
        <button 
          onClick={handleLogout}
          className="logout-btn"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default UserProfile;