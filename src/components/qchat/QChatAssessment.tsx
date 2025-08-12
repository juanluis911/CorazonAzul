// src/components/qchat/QChatAssessment.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface QChatQuestion {
  id: number;
  question: string;
  options: string[];
  riskPoints: number[]; // Puntos de riesgo por opción (0-4)
}

interface QChatResult {
  id?: string;
  userId: string;
  childName: string;
  childAge: number;
  completedDate: Date;
  answers: { [key: number]: number };
  totalScore: number;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  recommendations: string[];
}

const QChatAssessment: React.FC = () => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [childInfo, setChildInfo] = useState({ name: '', age: '' });
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<QChatResult | null>(null);
  const [previousResults, setPreviousResults] = useState<QChatResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  // Preguntas oficiales del Q-CHAT
  const questions: QChatQuestion[] = [
    {
      id: 1,
      question: "¿Su hijo/a mira hacia donde usted está mirando cuando usted señala algo?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 2,
      question: "¿Alguna vez se ha preguntado si su hijo/a podría ser sordo/a?",
      options: ["Nunca", "Raramente", "A veces", "Usualmente", "Siempre"],
      riskPoints: [0, 1, 2, 3, 4]
    },
    {
      id: 3,
      question: "¿Su hijo/a juega juegos de fantasía o imaginativos?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 4,
      question: "¿A su hijo/a le gusta trepar cosas?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 3]
    },
    {
      id: 5,
      question: "¿Su hijo/a hace movimientos inusuales con los dedos cerca de sus ojos?",
      options: ["Nunca", "Raramente", "A veces", "Usualmente", "Siempre"],
      riskPoints: [0, 1, 2, 3, 4]
    },
    {
      id: 6,
      question: "¿Su hijo/a señala con el dedo índice para pedir algo?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 7,
      question: "¿Su hijo/a señala con el dedo índice para mostrar interés en algo?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 8,
      question: "¿Su hijo/a puede jugar apropiadamente con juguetes pequeños sin solo llevárselos a la boca, manosearlos o tirarlos?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 9,
      question: "¿Su hijo/a le trae objetos para mostrárselos?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 10,
      question: "¿Su hijo/a lo mira a los ojos por más de uno o dos segundos?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 11,
      question: "¿Su hijo/a parece ser muy sensible al ruido?",
      options: ["Nunca", "Raramente", "A veces", "Usualmente", "Siempre"],
      riskPoints: [0, 1, 2, 3, 4]
    },
    {
      id: 12,
      question: "¿Su hijo/a sonríe como respuesta a su cara o su sonrisa?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 13,
      question: "¿Su hijo/a imita sus acciones?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 14,
      question: "¿Su hijo/a responde a su nombre cuando lo llama?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 15,
      question: "Si usted señala un juguete al otro lado del cuarto, ¿su hijo/a lo mira?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 16,
      question: "¿Su hijo/a camina?",
      options: ["Sí", "No"],
      riskPoints: [0, 2]
    },
    {
      id: 17,
      question: "¿Su hijo/a mira las cosas que usted está mirando?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 18,
      question: "¿Su hijo/a hace movimientos inusuales cerca de su cara?",
      options: ["Nunca", "Raramente", "A veces", "Usualmente", "Siempre"],
      riskPoints: [0, 1, 2, 3, 4]
    },
    {
      id: 19,
      question: "¿Su hijo/a trata de llamar su atención hacia su propia actividad?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 20,
      question: "¿Alguna vez se ha preguntado si su hijo/a tiene problemas de audición?",
      options: ["Nunca", "Raramente", "A veces", "Usualmente", "Siempre"],
      riskPoints: [0, 1, 2, 3, 4]
    },
    {
      id: 21,
      question: "¿Su hijo/a entiende lo que la gente dice?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 22,
      question: "¿Su hijo/a a veces se queda mirando al vacío o deambula sin propósito?",
      options: ["Nunca", "Raramente", "A veces", "Usualmente", "Siempre"],
      riskPoints: [0, 1, 2, 3, 4]
    },
    {
      id: 23,
      question: "¿Su hijo/a mira su cara para ver su reacción cuando se enfrenta con algo extraño?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    },
    {
      id: 24,
      question: "¿A su hijo/a le gusta las actividades de movimiento?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 3]
    },
    {
      id: 25,
      question: "¿Su hijo/a mantiene contacto visual con usted?",
      options: ["Siempre", "Usualmente", "A veces", "Raramente", "Nunca"],
      riskPoints: [0, 0, 1, 2, 4]
    }
  ];

  // Cargar historial de resultados
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'qchat_results'),
      where('userId', '==', user.uid),
      orderBy('completedDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const results: QChatResult[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({
          id: doc.id,
          ...data,
          completedDate: data.completedDate.toDate()
        } as QChatResult);
      });
      setPreviousResults(results);
    });

    return () => unsubscribe();
  }, [user]);

  const calculateScore = (answers: { [key: number]: number }): number => {
    let totalScore = 0;
    Object.keys(answers).forEach(questionId => {
      const qId = parseInt(questionId);
      const answerIndex = answers[qId];
      const question = questions.find(q => q.id === qId);
      if (question) {
        totalScore += question.riskPoints[answerIndex];
      }
    });
    return totalScore;
  };

  const getRiskLevel = (score: number): 'Bajo' | 'Medio' | 'Alto' => {
    if (score <= 39) return 'Bajo';
    if (score <= 50) return 'Medio';
    return 'Alto';
  };

  const getRecommendations = (score: number, riskLevel: string): string[] => {
    const base = [
      "Continúe estimulando el desarrollo de su hijo/a con actividades apropiadas para su edad",
      "Mantenga comunicación regular con el pediatra sobre el desarrollo"
    ];

    if (riskLevel === 'Medio') {
      return [
        ...base,
        "Se recomienda una evaluación más detallada con un especialista en desarrollo infantil",
        "Considere una consulta con un pediatra especializado en neurodesarrollo",
        "Documente comportamientos específicos para compartir con profesionales"
      ];
    }

    if (riskLevel === 'Alto') {
      return [
        "Se recomienda encarecidamente una evaluación profesional inmediata",
        "Consulte con un especialista en TEA (Trastorno del Espectro Autista)",
        "Contacte servicios de intervención temprana en su área",
        "Mantenga un registro detallado de comportamientos y desarrollo",
        "Busque apoyo de grupos de padres y recursos especializados"
      ];
    }

    return base;
  };

  const handleStart = () => {
    if (childInfo.name.trim() && childInfo.age.trim()) {
      setIsStarted(true);
      setCurrentQuestion(0);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answerIndex };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeAssessment(newAnswers);
    }
  };

  const completeAssessment = async (finalAnswers: { [key: number]: number }) => {
    setLoading(true);
    
    const totalScore = calculateScore(finalAnswers);
    const riskLevel = getRiskLevel(totalScore);
    const recommendations = getRecommendations(totalScore, riskLevel);

    const result: QChatResult = {
      userId: user!.uid,
      childName: childInfo.name.trim(),
      childAge: parseInt(childInfo.age),
      completedDate: new Date(),
      answers: finalAnswers,
      totalScore,
      riskLevel,
      recommendations
    };

    try {
      const docRef = await addDoc(collection(db, 'qchat_results'), {
        ...result,
        completedDate: new Date()
      });
      
      result.id = docRef.id;
      setResult(result);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error guardando resultado:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setChildInfo({ name: '', age: '' });
    setIsStarted(false);
    setIsCompleted(false);
    setResult(null);
    setLoading(false);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '30px',
      borderRadius: '12px',
      textAlign: 'center' as const,
      marginBottom: '30px'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    },
    questionCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '40px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      textAlign: 'center' as const
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e9ecef',
      borderRadius: '4px',
      marginBottom: '30px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #667eea, #764ba2)',
      borderRadius: '4px',
      transition: 'width 0.3s ease'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      margin: '5px'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    secondaryButton: {
      background: '#f8f9fa',
      color: '#495057',
      border: '2px solid #dee2e6'
    },
    optionButton: {
      background: 'white',
      border: '2px solid #e9ecef',
      color: '#495057',
      padding: '15px 25px',
      margin: '8px',
      borderRadius: '10px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '200px'
    },
    input: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '2px solid #e9ecef',
      fontSize: '16px',
      width: '100%',
      marginBottom: '15px'
    },
    riskLow: { color: '#28a745', backgroundColor: '#d4edda', padding: '10px', borderRadius: '8px' },
    riskMedium: { color: '#856404', backgroundColor: '#fff3cd', padding: '10px', borderRadius: '8px' },
    riskHigh: { color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '8px' }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Acceso restringido</h2>
          <p>Debe estar autenticado para acceder al Q-CHAT.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🧩 Q-CHAT</h1>
        <p>Cuestionario Cuantitativo para Autismo en Niños Pequeños</p>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>
          Herramienta de detección temprana para niños de 18-24 meses
        </p>
      </div>

      {!isStarted && !isCompleted && (
        <div style={styles.card}>
          <h2>Información del niño/a</h2>
          <p style={{ color: '#666', marginBottom: '25px' }}>
            Este cuestionario está diseñado para identificar signos tempranos del espectro autista.
            <strong> No es un diagnóstico</strong>, sino una herramienta de detección.
          </p>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Nombre del niño/a:
            </label>
            <input
              style={styles.input}
              type="text"
              value={childInfo.name}
              onChange={(e) => setChildInfo({ ...childInfo, name: e.target.value })}
              placeholder="Nombre del niño/a"
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Edad en meses:
            </label>
            <input
              style={styles.input}
              type="number"
              min="12"
              max="36"
              value={childInfo.age}
              onChange={(e) => setChildInfo({ ...childInfo, age: e.target.value })}
              placeholder="Edad en meses (ej: 18)"
            />
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleStart}
              disabled={!childInfo.name.trim() || !childInfo.age.trim()}
            >
              Comenzar Evaluación
            </button>

            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Ocultar Historial' : 'Ver Historial'}
            </button>
          </div>
        </div>
      )}

      {showHistory && (
        <div style={styles.card}>
          <h3>Historial de Evaluaciones</h3>
          {previousResults.length === 0 ? (
            <p style={{ color: '#666' }}>No hay evaluaciones previas.</p>
          ) : (
            <div>
              {previousResults.map((result) => (
                <div key={result.id} style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{result.childName}</h4>
                      <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                        {result.completedDate.toLocaleDateString()} • {result.childAge} meses
                      </p>
                    </div>
                    <div>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        ...(result.riskLevel === 'Bajo' ? styles.riskLow :
                           result.riskLevel === 'Medio' ? styles.riskMedium : styles.riskHigh),
                        padding: '4px 12px',
                        borderRadius: '20px'
                      }}>
                        Riesgo {result.riskLevel} • {result.totalScore} puntos
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isStarted && !isCompleted && (
        <div style={styles.questionCard}>
          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
            }}></div>
          </div>

          <p style={{ color: '#666', marginBottom: '10px' }}>
            Pregunta {currentQuestion + 1} de {questions.length}
          </p>

          <h2 style={{ color: '#2c5aa0', marginBottom: '30px', lineHeight: '1.4' }}>
            {questions[currentQuestion].question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                style={{
                  ...styles.optionButton,
                  ...(answers[questions[currentQuestion].id] === index ? {
                    borderColor: '#667eea',
                    backgroundColor: '#f0f4ff',
                    color: '#667eea'
                  } : {})
                }}
                onClick={() => handleAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
            {currentQuestion > 0 && (
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={goToPreviousQuestion}
              >
                ← Anterior
              </button>
            )}
            
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={resetAssessment}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {isCompleted && result && (
        <div style={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#2c5aa0' }}>Resultado de la Evaluación</h2>
            <h3>{result.childName} • {result.childAge} meses</h3>
          </div>

          <div style={{
            textAlign: 'center',
            marginBottom: '30px',
            ...(result.riskLevel === 'Bajo' ? styles.riskLow :
               result.riskLevel === 'Medio' ? styles.riskMedium : styles.riskHigh),
            padding: '20px',
            borderRadius: '12px'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>
              Nivel de Riesgo: {result.riskLevel}
            </h3>
            <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>
              Puntuación total: {result.totalScore} / 100
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h4>Recomendaciones:</h4>
            <ul style={{ lineHeight: '1.6' }}>
              {result.recommendations.map((rec, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>{rec}</li>
              ))}
            </ul>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#2c5aa0' }}>Importante:</h4>
            <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.5' }}>
              Este cuestionario es una herramienta de detección, <strong>no un diagnóstico definitivo</strong>. 
              Si tiene preocupaciones sobre el desarrollo de su hijo/a, consulte con un profesional 
              de la salud especializado en desarrollo infantil.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={resetAssessment}
            >
              Nueva Evaluación
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Guardando resultado...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }
      `}</style>
    </div>
  );
};

export default QChatAssessment;