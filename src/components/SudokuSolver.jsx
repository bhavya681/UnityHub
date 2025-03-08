import React, { useState } from "react";

const SudokuSolver = () => {
  const emptyBoard = Array(9)
    .fill(null)
    .map(() => Array(9).fill(""));

  const [board, setBoard] = useState(emptyBoard);
  const [solved, setSolved] = useState(false);

  // Handle cell input
  const handleChange = (row, col, value) => {
    if (value === "" || (/^[1-9]$/.test(value) && !solved)) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = value;
      setBoard(newBoard);
    }
  };

  // Check if a number can be placed in a specific cell
  const isValid = (grid, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  };

  // Sudoku solving function using Backtracking Algorithm
  const solveSudoku = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === "") {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, `${num}`)) {
              grid[row][col] = `${num}`;
              if (solveSudoku(grid)) return true;
              grid[row][col] = "";
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  // Handle Solve button
  const handleSolve = () => {
    const newBoard = board.map((row) => [...row]);
    if (solveSudoku(newBoard)) {
      setBoard(newBoard);
      setSolved(true);
    } else {
      alert("No solution exists for this Sudoku puzzle!");
    }
  };

  // Handle Reset button
  const handleReset = () => {
    setBoard(emptyBoard);
    setSolved(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 animate-pulse">Sudoku Solver</h1>

      {/* Sudoku Grid */}
      <div className="grid grid-cols-9 gap-1 bg-gray-800 p-2 rounded-lg shadow-lg">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              maxLength="1"
              value={cell}
              className={`w-10 h-10 text-center text-lg font-bold bg-gray-100 text-gray-800 rounded-md border border-gray-400 
              ${solved ? "bg-green-300" : "focus:ring-2 focus:ring-blue-500"} transition-all`}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
            />
          ))
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSolve}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 font-bold text-white rounded-lg shadow-lg transition-all"
        >
          Solve Sudoku
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 font-bold text-white rounded-lg shadow-lg transition-all"
        >
          Reset Board
        </button>
      </div>
    </div>
  );
};

export default SudokuSolver;
