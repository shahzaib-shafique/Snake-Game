import React, { useState, useEffect, useCallback } from "react";
import ScoreBoard from "./Components/ScoreBoard";
import GameBoard from "./Components/GameBoard";
import ArrowControls from "./Components/ArrowButtons";

const App = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("highScore")) || 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState([{ x: 8, y: 10 }]);
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState({ x: 5, y: 5 });
  const boardSize = 20;

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (boardSize - 2)) + 1,
        y: Math.floor(Math.random() * (boardSize - 2)) + 1,
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake, boardSize]);

  const handleRestart = useCallback(() => {
    setScore(0);
    setGameOver(false);
    const initialSnake = [{ x: 8, y: 10 }];
    setSnake(initialSnake);
    setDirection("RIGHT");

    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (boardSize - 2)) + 1,
        y: Math.floor(Math.random() * (boardSize - 2)) + 1,
      };
    } while (initialSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

    setFood(newFood);
  }, [boardSize]);

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;

      if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
      else if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
      else if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
      else if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction, gameOver]);

  useEffect(() => {
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
      setFood(generateFood());
    }
  }, [snake, food, generateFood]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-cyan-400 p-4 bg-gray-800 rounded-lg shadow-lg mt-4">
        🐍 Snake Game
      </h1>

      <ScoreBoard 
        score={score} 
        highScore={highScore} 
        onRestart={handleRestart} 
      />


      <GameBoard
        snake={snake}
        setSnake={setSnake}
        direction={direction}
        food={food}
        setFood={setFood}
        gameOver={gameOver}
        setGameOver={setGameOver}
        boardSize={boardSize}
        setScore={setScore}
      />

      <ArrowControls onDirectionChange={setDirection} gameOver={gameOver} />
    </div>
  );
};

export default App;
