import React, { useState, useEffect, useRef } from "react";
import jumpSound from "../../public/jump.wav";
import gameOverSound from "../../public/crash.wav";
import backgroundMusic from "../../public/bg.mp3";
import { BikeIcon, Bitcoin, CogIcon } from "lucide-react";

const StockSurfer = () => {
  const [position, setPosition] = useState(250);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef(null);
  const audioRef = useRef(new Audio(backgroundMusic));
  const jumpAudioRef = useRef(new Audio(jumpSound));
  const gameOverAudioRef = useRef(new Audio(gameOverSound));

  const gravity = 2;
  const jumpStrength = 50;
  const obstacleWidth = 50;
  const gap = 160;
  const obstacleSpeed = 4;

  useEffect(() => {
    if (!gameOver) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [gameOver]);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setPosition((prev) => {
          if (!gameAreaRef.current) return prev;
          const newPosition = prev + gravity;
          if (newPosition >= gameAreaRef.current.clientHeight - 30 || newPosition <= 0) {
            triggerGameOver();
            clearInterval(interval);
          }
          return newPosition;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [gameOver]);

  useEffect(() => {
    if (!gameOver) {
      const obstacleInterval = setInterval(() => {
        if (!gameAreaRef.current) return;
        setObstacles((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: gameAreaRef.current.clientWidth,
            height: Math.floor(Math.random() * (gameAreaRef.current.clientHeight - gap)),
          },
        ]);
      }, 1800);
      return () => clearInterval(obstacleInterval);
    }
  }, [gameOver]);

  useEffect(() => {
    if (!gameOver) {
      const moveInterval = setInterval(() => {
        setObstacles((prev) =>
          prev
            .map((obstacle) => ({
              ...obstacle,
              x: obstacle.x - obstacleSpeed,
            }))
            .filter((obstacle) => obstacle.x > -obstacleWidth)
        );
      }, 20);
      return () => clearInterval(moveInterval);
    }
  }, [gameOver]);

  useEffect(() => {
    if (!gameOver) {
      const checkCollision = () => {
        const playerRect = {
          top: position,
          bottom: position + 30,
          left: 50,
          right: 80,
        };

        obstacles.forEach((obstacle) => {
          const topObstacle = {
            top: 0,
            bottom: obstacle.height,
            left: obstacle.x,
            right: obstacle.x + obstacleWidth,
          };

          const bottomObstacle = {
            top: obstacle.height + gap,
            bottom: gameAreaRef.current?.clientHeight,
            left: obstacle.x,
            right: obstacle.x + obstacleWidth,
          };

          if (
            (playerRect.right > topObstacle.left &&
              playerRect.left < topObstacle.right &&
              (playerRect.top < topObstacle.bottom || playerRect.bottom > bottomObstacle.top)) ||
            playerRect.bottom > gameAreaRef.current.clientHeight
          ) {
            triggerGameOver();
          }
        });
      };
      const collisionInterval = setInterval(checkCollision, 20);
      return () => clearInterval(collisionInterval);
    }
  }, [position, obstacles, gameOver]);

  useEffect(() => {
    if (!gameOver) {
      const scoreInterval = setInterval(() => {
        setScore((prev) => prev + 1);
      }, 800);
      return () => clearInterval(scoreInterval);
    }
  }, [gameOver]);

  const handleJump = () => {
    if (!gameOver) {
      setPosition((prev) => Math.max(prev - jumpStrength, 0));
      jumpAudioRef.current.currentTime = 0;
      jumpAudioRef.current.play();
    }
  };

  const triggerGameOver = () => {
    setGameOver(true);
    gameOverAudioRef.current.currentTime = 0;
    gameOverAudioRef.current.play();
  };

  const handleRestart = () => {
    setPosition(250);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    audioRef.current.play();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
      <div
        className="relative w-[400px] h-[600px] bg-gray-900 border-2 border-gray-700 rounded-xl shadow-2xl overflow-hidden"
        ref={gameAreaRef}
        onClick={handleJump}
      >
        <div className="absolute inset-0 bg-grid opacity-10"></div>

        <div
          className="absolute w-18 p-1 h-18 bg-yellow-600 rounded-full shadow-md"
          style={{ top: `${position}px`, left: "90px" }}
        ><Bitcoin/></div>

        {obstacles.map((obstacle) => (
          <React.Fragment key={obstacle.id}>
            <div
              className="absolute bg-red-500 shadow-lg"
              style={{
                left: `${obstacle.x}px`,
                height: `${obstacle.height}px`,
                width: `${obstacleWidth}px`,
              }}
            ></div>
            <div
              className="absolute bg-red-500 shadow-lg"
              style={{
                left: `${obstacle.x}px`,
                top: `${obstacle.height + gap}px`,
                height: `${gameAreaRef.current?.clientHeight - obstacle.height - gap}px`,
                width: `${obstacleWidth}px`,
              }}
            ></div>
          </React.Fragment>
        ))}

        <div className="absolute top-4 left-4 text-lg text-yellow-400 font-semibold">Score: {score}</div>

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <div className="text-3xl text-white font-bold mb-4">Game Over!</div>
            <button
              className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-all"
              onClick={handleRestart}
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockSurfer;