import './App.css'
import {useCallback, useEffect, useState} from "react";

type Player = 1 | 2;

const players: Player[] = [1, 2];

function App() {
  const [board, setBoard] = useState(() => {
    return new Array(3).fill('').map(() => [0, 0, 0]);
  });

  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

  const [winner, setWinner] = useState<Player | 0>();

  const [countMoves, setCountMoves] = useState(0);

  const handleClick = useCallback((row: number, cell: number) => {
    if (winner) return;

    if (board[row][cell] > 0) return;

    setBoard(prev => {
      const newPrev = [...prev];
      newPrev[row][cell] = currentPlayer;
      return newPrev;
    });
    setCurrentPlayer(prev => prev === 1 ? 2 : 1);
    setCountMoves(prev => prev + 1);
  }, [winner, currentPlayer, board]);

  const findWinner = useCallback((result: number[]) => {
    const winner = players.find(player => {
      return result.every(cell => cell === player);
    });
    if (!winner) return;
    setWinner(winner);
  }, []);

  const isVictoryMove = useCallback(() => {
    board.forEach(row => {
      findWinner(row);
    });

    board.forEach((_, cellIndex) => {
      let col: number[] = [];
      board.forEach((_, rowIndex) => {
        col.push(board[rowIndex][cellIndex]);
      })
      findWinner(col);
      col = [];
    });

    let diagonal: number[] = [];
    board.forEach((_, rowIndex) => {
      diagonal.push(board[rowIndex][rowIndex]);
    });
    findWinner(diagonal);

    diagonal = [];
    board.forEach((row, rowIndex) => {
      diagonal.push(board[(row.length - 1) - rowIndex][rowIndex]);
    });
    findWinner(diagonal);
  }, [board]);

  useEffect(() => {
    if (countMoves < 5) return;

    isVictoryMove();
  }, [board, countMoves, isVictoryMove]);

  return (
    <div>
      {!winner &&
          <h2>Player <strong>{currentPlayer}</strong> turn</h2>
      }
      <div className={'board'}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={'row'}>
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className={'cell'}>
                <button onClick={() => handleClick(rowIndex, cellIndex)}>
                  {cell}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      {winner && (
        <div>
          Winner: {winner}
        </div>
      )}
    </div>
  )
}

export default App
