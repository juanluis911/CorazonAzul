// src/pages/ParentGuidesPage.tsx
import React, { useState } from 'react';
import QChatAssessment from '../components/qchat/QChatAssessment';
import QChatForm from '../components/qchat/QChatQuiz';

// Definir tipos para los recursos
interface ResourceWithUrl {
  name: string;
  url: string;
  description?: string;
}

interface ResourceWithDescription {
  name: string;
  description: string;
  url?: string;
}

type Resource = ResourceWithUrl | ResourceWithDescription;

interface ResourceCategory {
  category: string;
  resources: Resource[];
}

const ParentGuidesPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Recursos Generales', icon: '📚' },
    { id: 'qchat', title: 'Q-CHAT (Detección Temprana)', icon: '🧩' },
    { id: 'development', title: 'Hitos del Desarrollo', icon: '📈' },
    { id: 'communication', title: 'Estrategias de Comunicación', icon: '💬' },
    { id: 'behavior', title: 'Manejo Conductual', icon: '🎯' },
    { id: 'resources', title: 'Recursos Externos', icon: '🌐' }
  ];

  const developmentMilestones = [
    {
      age: '12-18 meses',
      milestones: [
        'Camina solo',
        'Dice 2-6 palabras',
        'Señala para pedir',
        'Imita acciones simples',
        'Busca objetos escondidos'
      ]
    },
    {
      age: '18-24 meses',
      milestones: [
        'Corre y salta',
        'Combina 2 palabras',
        'Señala partes del cuerpo',
        'Juego simbólico simple',
        'Sigue instrucciones de 2 pasos'
      ]
    },
    {
      age: '2-3 años',
      milestones: [
        'Sube escaleras alternando pies',
        'Frases de 3-4 palabras',
        'Juego imaginativo',
        'Muestra emppatía básica',
        'Agrupa objetos por color/forma'
      ]
    }
  ];

  const communicationStrategies = [
    {
      title: 'Comunicación Visual',
      description: 'Uso de pictogramas y apoyos visuales',
      techniques: [
        'Crear horarios visuales',
        'Usar tarjetas de comunicación',
        'Implementar sistemas PECS',
        'Señalización clara en casa'
      ]
    },
    {
      title: 'Rutinas Estructuradas',
      description: 'Crear predictibilidad y seguridad',
      techniques: [
        'Horarios consistentes',
        'Transiciones graduales',
        'Anticipar cambios',
        'Refuerzo positivo'
      ]
    },
    {
      title: 'Estimulación del Lenguaje',
      description: 'Técnicas para fomentar la comunicación',
      techniques: [
        'Narrar actividades',
        'Tiempo de espera',
        'Repetir y expandir',
        'Cantar y leer juntos'
      ]
    }
  ];

  const behaviorStrategies = [
    {
      title: 'Prevención de Crisis',
      tips: [
        'Identificar desencadenantes',
        'Mantener rutinas predecibles',
        'Ofrecer opciones limitadas',
        'Usar temporizadores visuales'
      ]
    },
    {
      title: 'Durante la Crisis',
      tips: [
        'Mantener la calma',
        'Garantizar seguridad',
        'Reducir estímulos',
        'Ofrecer estrategias de autorregulación'
      ]
    },
    {
      title: 'Después de la Crisis',
      tips: [
        'Reconectar emocionalmente',
        'Analizar qué funcionó',
        'Planificar para el futuro',
        'Celebrar la recuperación'
      ]
    }
  ];

  const externalResources: ResourceCategory[] = [
    {
      category: 'Organizaciones Profesionales',
      resources: [
        { name: 'Confederación Autismo España', url: 'https://www.autismo.org.es', description: 'Organización nacional de apoyo al autismo' },
        { name: 'Federación Asperger España', url: 'https://www.asperger.es', description: 'Apoyo especializado en Síndrome de Asperger' },
        { name: 'AETAPI', url: 'https://aetapi.org', description: 'Asociación Española de Profesionales del Autismo' }
      ]
    },
    {
      category: 'Recursos Educativos',
      resources: [
        { name: 'ARASAAC (Pictogramas)', url: 'https://arasaac.org', description: 'Pictogramas gratuitos para comunicación' },
        { name: 'Proyecto PEANA', url: 'https://peana.es', description: 'Plataforma educativa especializada' },
        { name: 'Canal Autismo', url: 'https://canalautismo.com', description: 'Recursos y formación online' }
      ]
    },
    {
      category: 'Apps Recomendadas',
      resources: [
        { name: 'PECS IV+', description: 'Sistema de comunicación por intercambio de imágenes' },
        { name: 'Proloquo2Go', description: 'Comunicación aumentativa y alternativa' },
        { name: 'LetMe Talk', description: 'Comunicador gratuito con pictogramas' }
      ]
    }
  ];

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '30px',
      borderRadius: '12px',
      textAlign: 'center' as const,
      marginBottom: '30px'
    },
    navigation: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      flexWrap: 'wrap' as const,
      justifyContent: 'center'
    },
    navButton: {
      padding: '12px 20px',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    navButtonActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
    },
    navButtonInactive: {
      background: 'white',
      color: '#495057',
      border: '2px solid #e9ecef'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    milestoneCard: {
      background: 'white',
      border: '2px solid #e9ecef',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.3s ease'
    },
    strategyCard: {
      background: '#f8f9fa',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '15px'
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    listItem: {
      padding: '8px 0',
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }
  };

  const renderOverview = () => (
    <div>
      <div style={styles.card}>
        <h2 style={{ color: '#2c5aa0', marginBottom: '20px' }}>Bienvenido a las Guías para Padres</h2>
        <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
          Esta sección está diseñada para proporcionar a los padres y cuidadores herramientas prácticas, 
          información basada en evidencia y recursos para apoyar el desarrollo de niños con TEA.
        </p>
        
        <div style={styles.grid}>
          <div style={{ ...styles.milestoneCard, borderColor: '#28a745' }}>
            <h3 style={{ color: '#28a745', marginBottom: '15px' }}>🧩 Detección Temprana</h3>
            <p>El Q-CHAT es una herramienta de detección para niños de 18-24 meses que ayuda a identificar signos tempranos del TEA.</p>
            <button 
              style={styles.button}
              onClick={() => setActiveSection('qchat')}
            >
              Realizar Q-CHAT
            </button>
          </div>
          
          <div style={{ ...styles.milestoneCard, borderColor: '#17a2b8' }}>
            <h3 style={{ color: '#17a2b8', marginBottom: '15px' }}>📈 Seguimiento del Desarrollo</h3>
            <p>Conoce los hitos del desarrollo típico y qué esperar en cada etapa de crecimiento de tu hijo/a.</p>
            <button 
              style={styles.button}
              onClick={() => setActiveSection('development')}
            >
              Ver Hitos
            </button>
          </div>
          
          <div style={{ ...styles.milestoneCard, borderColor: '#6f42c1' }}>
            <h3 style={{ color: '#6f42c1', marginBottom: '15px' }}>💬 Comunicación</h3>
            <p>Estrategias efectivas para fomentar la comunicación y el lenguaje en niños con TEA.</p>
            <button 
              style={styles.button}
              onClick={() => setActiveSection('communication')}
            >
              Explorar Estrategias
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDevelopment = () => (
    <div>
      <div style={styles.card}>
        <h2 style={{ color: '#2c5aa0', marginBottom: '20px' }}>Hitos del Desarrollo</h2>
        <p style={{ marginBottom: '30px' }}>
          Estos hitos son una guía general. Cada niño se desarrolla a su propio ritmo.
        </p>
        
        <div style={styles.grid}>
          {developmentMilestones.map((milestone, index) => (
            <div key={index} style={styles.milestoneCard}>
              <h3 style={{ color: '#667eea', marginBottom: '15px' }}>{milestone.age}</h3>
              <ul style={styles.list}>
                {milestone.milestones.map((item, itemIndex) => (
                  <li key={itemIndex} style={styles.listItem}>
                    <span style={{ color: '#28a745' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div style={{ 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '8px', 
          padding: '20px' 
        }}>
          <h4 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ Señales de Alerta</h4>
          <p style={{ color: '#856404', margin: 0 }}>
            Si notas que tu hijo no está alcanzando varios hitos o has observado pérdida de habilidades 
            previamente adquiridas, consulta con un profesional de la salud.
          </p>
        </div>
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div>
      <div style={styles.card}>
        <h2 style={{ color: '#2c5aa0', marginBottom: '20px' }}>Estrategias de Comunicación</h2>
        
        {communicationStrategies.map((strategy, index) => (
          <div key={index} style={styles.strategyCard}>
            <h3 style={{ color: '#667eea', marginBottom: '10px' }}>{strategy.title}</h3>
            <p style={{ marginBottom: '15px', color: '#666' }}>{strategy.description}</p>
            <ul style={styles.list}>
              {strategy.techniques.map((technique, techIndex) => (
                <li key={techIndex} style={styles.listItem}>
                  <span style={{ color: '#667eea' }}>•</span>
                  {technique}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBehavior = () => (
    <div>
      <div style={styles.card}>
        <h2 style={{ color: '#2c5aa0', marginBottom: '20px' }}>Manejo Conductual</h2>
        <p style={{ marginBottom: '30px' }}>
          Estrategias basadas en evidencia para manejar comportamientos desafiantes.
        </p>
        
        <div style={styles.grid}>
          {behaviorStrategies.map((strategy, index) => (
            <div key={index} style={styles.milestoneCard}>
              <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>{strategy.title}</h3>
              <ul style={styles.list}>
                {strategy.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} style={styles.listItem}>
                    <span style={{ color: '#e74c3c' }}>→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div style={{ 
          background: '#d4edda', 
          border: '1px solid #c3e6cb', 
          borderRadius: '8px', 
          padding: '20px',
          marginTop: '20px'
        }}>
          <h4 style={{ color: '#155724', marginBottom: '10px' }}>💡 Recuerda</h4>
          <p style={{ color: '#155724', margin: 0 }}>
            La consistencia y la paciencia son clave. Si las estrategias no funcionan después de un tiempo 
            razonable, considera buscar apoyo profesional especializado.
          </p>
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div>
      <div style={styles.card}>
        <h2 style={{ color: '#2c5aa0', marginBottom: '20px' }}>Recursos Externos</h2>
        
        {externalResources.map((category, index) => (
          <div key={index} style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>{category.category}</h3>
            <div style={styles.strategyCard}>
              {category.resources.map((resource, resIndex) => (
                <div key={resIndex} style={{
                  padding: '10px 0',
                  borderBottom: resIndex < category.resources.length - 1 ? '1px solid #e9ecef' : 'none'
                }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#2c5aa0' }}>{resource.name}</h4>
                  {'description' in resource && resource.description && (
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                      {resource.description}
                    </p>
                  )}
                  {'url' in resource && resource.url && (
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}
                    >
                      🔗 Visitar sitio web
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>👨‍👩‍👧‍👦 Guías para Padres</h1>
        <p>Recursos, herramientas y estrategias para apoyar a tu hijo/a con TEA</p>
      </div>

      <nav style={styles.navigation}>
        {sections.map((section) => (
          <button
            key={section.id}
            style={{
              ...styles.navButton,
              ...(activeSection === section.id ? styles.navButtonActive : styles.navButtonInactive)
            }}
            onClick={() => setActiveSection(section.id)}
          >
            <span>{section.icon}</span>
            {section.title}
          </button>
        ))}
      </nav>

      <main>
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'qchat' && <QChatForm />}
        {activeSection === 'development' && renderDevelopment()}
        {activeSection === 'communication' && renderCommunication()}
        {activeSection === 'behavior' && renderBehavior()}
        {activeSection === 'resources' && renderResources()}
      </main>

      <style>{`
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .milestone-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
        }
        
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ParentGuidesPage;