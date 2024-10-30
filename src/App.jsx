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
  // Filas
  [0, 1, 2, 3],
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [6, 7, 8, 9],
  [10, 11, 12, 13],
  [11, 12, 13, 14],
  [15, 16, 17, 18],
  [16, 17, 18, 19],
  // Columnas
  [0, 5, 10, 15],
  [1, 6, 11, 16],
  [2, 7, 12, 17],
  [3, 8, 13, 18],
  [4, 9, 14, 19],
  // Diagonales
  [0, 6, 12, 18],
  [4, 8, 12, 16],
  [3, 7, 11, 15],
  [19, 13, 7, 1],
];

function App() {
  const [board, setBoard] = useState(Array(20).fill(null));
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
      const [a, b, c, d] = combo;
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c] &&
        boardToCheck[a] === boardToCheck[d]
      ) {
        return boardToCheck[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(20).fill(null));
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
      setIsModalOpen(false); // Cerrar el modal si hay un ganador
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
      setIsModalOpen(false); // Cerrar el modal si hay empate
    } else {
      setIsModalOpen(false); // Cerrar el modal si no hay ganador
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + (3 * 1000); // Confeti por 3 segundos
    const colors = ['#bb0000', '#ffffff']; // Colores personalizados

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
