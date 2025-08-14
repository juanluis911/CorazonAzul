import React, { useState } from 'react';
import QCHAT_DATA from '../../qchat-quiz';
import './QChatForm.css';

type AgeGroupKey = keyof typeof QCHAT_DATA.ageGroups;
type Question = typeof QCHAT_DATA.questions.toddlers[number];
type AnswerMap = Record<string, number>;
type Result = { score: number; risk: string; categories: Record<string, number> };

export default function QChatForm() {
  const [screen, setScreen] = useState<'welcome' | 'quiz' | 'results'>('welcome');
  const [ageGroup, setAgeGroup] = useState<AgeGroupKey | ''>('');
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const handleSelectAgeGroup = (group: AgeGroupKey) => {
    setAgeGroup(group);
  };

  const startQuiz = () => {
    if (ageGroup) {
      setScreen('quiz');
    }
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateScore();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    const total = Object.values(answers).reduce((sum: number, val) => sum + Number(val), 0);
    const thresholds = QCHAT_DATA.ageGroups[ageGroup as AgeGroupKey].scoringThreshold;
    let riskLevel = '';

    if (total <= thresholds.lowRisk.max) riskLevel = 'Bajo';
    else if (total <= thresholds.moderateRisk.max) riskLevel = 'Moderado';
    else riskLevel = 'Alto';

    const categories: Record<string, number> = {};
    questions.forEach((q) => {
      if (!categories[q.category]) categories[q.category] = 0;
      categories[q.category] += answers[String(q.id)] || 0;
    });

    setResult({ score: total, risk: riskLevel, categories });
    setScreen('results');
  };

  const questions: Question[] = ageGroup ? QCHAT_DATA.questions[ageGroup] : [];
  const progress = questions.length > 0 ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="qchat-container">
      {screen === 'welcome' && (
        <div className="welcome-card">
          <h1 className="qchat-title">Q-CHAT</h1>
          <p className="welcome-description">
            El Q-CHAT es una herramienta de detección temprana para el Trastorno del Espectro Autista (TEA).
          </p>
          <div className="age-selection">
            <h3>Selecciona el grupo de edad del niño:</h3>
            <div className="age-buttons">
              {Object.values(QCHAT_DATA.ageGroups).map((group) => (
                <button key={group.id} onClick={() => handleSelectAgeGroup(group.id as AgeGroupKey)} className={`age-btn ${ageGroup === group.id ? 'selected' : ''}`}>
                  {group.name} ({group.ageRange})
                </button>
              ))}
            </div>
          </div>
          <button onClick={startQuiz} className="start-btn" disabled={!ageGroup}>Comenzar Cuestionario</button>
        </div>
      )}

      {screen === 'quiz' && (
        <div className="quiz-screen">
          <div className="progress-container">
            <span>{currentQuestionIndex + 1} / {questions.length}</span>
            <div className="progress-bar">
              <div className="qchat-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className="qchat-question-card">
            <p className="qchat-question-text">{questions[currentQuestionIndex].text}</p>
            {questions[currentQuestionIndex].options.map((opt, idx) => (
              <label key={idx} className="qchat-option">
                <input
                  type="radio"
                  name={`q-${questions[currentQuestionIndex].id}`}
                  value={opt.value}
                  checked={answers[String(questions[currentQuestionIndex].id)] === opt.value}
                  onChange={() => handleAnswer(questions[currentQuestionIndex].id, opt.value)}
                />
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
          <div className="navigation-controls">
            <button onClick={prevQuestion} disabled={currentQuestionIndex === 0}>Anterior</button>
            <button onClick={nextQuestion}>{currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}</button>
          </div>
        </div>
      )}

      {screen === 'results' && result && (
        <div className="qchat-result">
          <h2>Resultados del Q-CHAT</h2>
          <p>Puntuación total: <span>{result.score}</span></p>
          <p>Nivel de riesgo: <span>{result.risk}</span></p>
          <div>
            <h3>Análisis por Áreas</h3>
            <ul>
              {Object.entries(result.categories).map(([cat, val]) => (
                <li key={cat}>{cat}: {val}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => window.print()}>Imprimir Resultados</button>
          <button onClick={() => window.location.reload()}>Nueva Evaluación</button>
        </div>
      )}
    </div>
  );
}
