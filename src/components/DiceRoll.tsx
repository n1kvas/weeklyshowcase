"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DiceRollProps {
  onComplete: () => void;
  duration?: number; // duration in ms
}

const DiceRoll: React.FC<DiceRollProps> = ({ onComplete, duration = 2000 }) => {
  const [isRolling, setIsRolling] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRolling(false);
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  // Generate random numbers for the animation
  const generateRandomNumbers = () => {
    return Array.from({ length: 20 }, () => Math.floor(Math.random() * 6) + 1);
  };

  const [randomNumbers] = useState(generateRandomNumbers());

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-8">Selecting Student...</h2>
      <div className="relative w-32 h-32">
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-white rounded-lg shadow-xl text-5xl font-bold"
          initial={{ rotateX: 0, rotateY: 0 }}
          animate={
            isRolling
              ? {
                  rotateX: randomNumbers.map((n) => n * 90),
                  rotateY: randomNumbers.map((n) => n * 90),
                  scale: [1, 1.1, 1],
                }
              : {
                  rotateX: 360,
                  rotateY: 360,
                  scale: 1,
                }
          }
          transition={{
            duration: duration / 1000,
            ease: "easeInOut",
            times: randomNumbers.map((_, i) => i / randomNumbers.length),
          }}
        >
          ?
        </motion.div>
      </div>
      <p className="mt-4 text-lg">Randomly selecting next presenter...</p>
    </div>
  );
};

export default DiceRoll;
