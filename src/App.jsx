import { useState, useEffect } from 'react';
import './App.css';
import { Squared } from './components/Squared';
import { QuestionModal } from './components/QuestionModal';
import confetti from 'canvas-confetti';

const TURN = {
  X: 'X',
  O: 'O',
};

const WINNER_COMBINATIONS = [
  // Filas (5 filas de 5 posiciones cada una)
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],

  // Columnas (5 columnas de 5 posiciones cada una)
  [0, 5, 10, 15, 20], // Columna 1
  [1, 6, 11, 16, 21], // Columna 2
  [2, 7, 12, 17, 22], // Columna 3
  [3, 8, 13, 18, 23], // Columna 4
  [4, 9, 14, 19, 24], // Columna 5

  // Diagonales principales (de izquierda a derecha)
  [0, 6, 12, 18, 24],  // Diagonal principal 1
  [4, 8, 12, 16, 20],  // Diagonal principal inversa
];

function App() {
  const [board, setBoard] = useState(Array(25).fill(null));
  const [turn, setTurn] = useState(TURN.X);
  const [winner, setWinner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Efecto para aplicar la clase de dark mode al body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const checkWinner = (boardToCheck) => {
    for (let combo of WINNER_COMBINATIONS) {
      const values = combo.map(index => boardToCheck[index]);
      
      // Verificar que todos los valores sean iguales y no sean null
      if (values.every(val => val !== null && val === values[0])) {
        return values[0]; // Retorna el ganador ("X" o "O")
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(25).fill(null));
    setTurn(TURN.X);
    setWinner(null);
    window.location.reload();
  };

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null);
  };

  const handleSquareClick = (index) => {
    if (board[index] || winner) return;
    setPendingMove(index);
    setIsModalOpen(true);
  };

  const handleCorrectAnswer = () => {
    const newBoard = [...board];
    newBoard[pendingMove] = turn;
    setBoard(newBoard);
    const newTurn = turn === TURN.X ? TURN.O : TURN.X;
    setTurn(newTurn);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      triggerConfetti();
      setIsModalOpen(false);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
      setIsModalOpen(false);
    } else {
      setIsModalOpen(false);
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + (3 * 1000);
    const colors = ['#bb0000', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleIncorrectAnswer = () => {
    const newTurn = turn === TURN.X ? TURN.O : TURN.X;
    setTurn(newTurn);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="app">
      <main className="board">
        <h1>Tic Tac Toe</h1>
        <button className="reset-button" onClick={resetGame}>Resetear Juego</button>
        <button className="toggle" onClick={toggleDarkMode}>
          {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
        <section className="game">
          {board.map((_, index) => (
            <Squared key={index} index={index} updatedBoard={() => handleSquareClick(index)}>
              {board[index]}
            </Squared>
          ))}
        </section>

        <section className="turn" style={{display:"flex", gap:"10px"}}>
          <Squared isSelected={turn === TURN.X} color="blue">{TURN.X}</Squared>
          <Squared isSelected={turn === TURN.O} color="red">{TURN.O}</Squared>
        </section>

        {winner !== null && (
          <section className="winner">
            <div className="text">
              <h2>{winner === false ? 'Empate' : `Ganó: ${winner}`}</h2>
              <footer>
                <button onClick={resetGame}>Empezar de nuevo</button>
              </footer>
            </div>
          </section>
        )}

        <QuestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCorrectAnswer={handleCorrectAnswer}
          onIncorrectAnswer={handleIncorrectAnswer}
        />
      </main>
    </div>
  );
}

export default App;