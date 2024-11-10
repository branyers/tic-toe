import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CategoryFilter } from './CategoryFilter';

// Función para decodificar entidades HTML
const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export const QuestionModal = ({ isOpen, onClose, onCorrectAnswer, onIncorrectAnswer, activePlayer }) => {
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    if (isOpen && isGameStarted && !hasFetched && selectedCategory) {
      const baseUrl = selectedCategory === 'pro'
        ? 'https://opentdb.com/api.php?amount=1&difficulty=hard&type=multiple'
        : `https://api.quiz-contest.xyz/questions?limit=1&page=${page}&category=${selectedCategory}`;

      const fetchConfig = selectedCategory === 'pro' ? {} : {
        headers: {
          'Authorization': '$2b$12$3Ts419AMUySDKlRYK8Q59eKQkfgTs1dCpmwamsGk5pkaPKadJLB9S',
        }
      };

      fetch(baseUrl, fetchConfig)
        .then((response) => response.json())
        .then((data) => {
          console.log("API Data:", data); // Para debugging

          if (selectedCategory === 'pro') {
            // Handling Open Trivia Database API response
            if (data.results && data.results.length > 0) {
              const question = data.results[0];
              setQuestionData({
                question: decodeHTML(question.question), // Decodificando la pregunta
                correct_answer: decodeHTML(question.correct_answer), // Decodificando la respuesta correcta
                incorrect_answers: question.incorrect_answers.map(decodeHTML), // Decodificando respuestas incorrectas
              });
            }
          } else {
            // Handling quiz-contest API response
            if (data.questions && data.questions.length > 0) {
              const question = data.questions[0];
              setQuestionData({
                question: decodeHTML(question.question), // Decodificando la pregunta
                correct_answer: decodeHTML(question.correctAnswers), // Decodificando la respuesta correcta
                incorrect_answers: question.incorrectAnswers?.map(decodeHTML) || [], // Asegurando que sea un array y decodificando
              });
            }
          }

          setSelectedAnswer('');
          setPage((prevPage) => prevPage + 1);
          setHasFetched(true);
        })
        .catch((error) => {
          console.error('Error fetching the question:', error);
        });
    }
  }, [isOpen, hasFetched, page, selectedCategory, isGameStarted]);

  const handleAnswerSelection = (answer) => setSelectedAnswer(answer);

  const handleSubmit = () => {
    if (selectedAnswer === questionData.correct_answer) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        duration: 3000,
      });
      onCorrectAnswer();
    } else {
      onIncorrectAnswer();
    }
    setHasFetched(false);
    setSelectedAnswer('');
    setQuestionData(null);
    onClose();
  };

  const startGame = () => {
    setIsGameStarted(true);
    setPage(1);
    setHasFetched(false);
    setQuestionData(null);
  };

  if (!isOpen) return null;

  if (!isGameStarted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <CategoryFilter
            setSelectedCategory={setSelectedCategory}
            startGame={startGame}
          />
        </div>
      </div>
    );
  }

  if (!questionData) return <p>Loading question...</p>;

  // Aseguramos que incorrect_answers sea siempre un array
  const incorrectAnswers = Array.isArray(questionData.incorrect_answers) 
    ? questionData.incorrect_answers 
    : [];

  // Aseguramos que allAnswers contenga todas las respuestas
  const allAnswers = [
    ...incorrectAnswers,
    questionData.correct_answer
  ].filter(answer => answer !== null && answer !== undefined).sort();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{questionData.question}</h2>
        <div className="answers">
          {allAnswers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelection(answer)}
              style={{
                backgroundColor: selectedAnswer === answer ? '#f4f6f7' : '#fff',
                color: '#000',
                borderColor: selectedAnswer === answer ? '#000' : '#ccc',
                padding: '10px', 
                textAlign: 'center',
                width: '100%',
                maxWidth: '300px',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                borderRadius: '5px',
                marginBottom: '10px',
                cursor: 'pointer',
              }}
            >
              {answer}
            </button>
          ))}
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={!selectedAnswer}
          style={{ 
            color: '#040101',
            opacity: !selectedAnswer ? 0.5 : 1,
            cursor: !selectedAnswer ? 'not-allowed' : 'pointer'
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
