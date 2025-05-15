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

  // Random background gradients for the dice
  const gradients = [
    "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  ];

  const randomGradient =
    gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        Selecting Student...
      </motion.h2>

      <div className="relative w-40 h-40">
        <motion.div
          className="absolute inset-0 flex items-center justify-center rounded-2xl text-5xl font-extrabold text-white shadow-xl"
          style={{ background: randomGradient }}
          initial={{ rotateX: 0, rotateY: 0 }}
          animate={
            isRolling
              ? {
                  rotateX: randomNumbers.map((n) => n * 90),
                  rotateY: randomNumbers.map((n) => n * 90),
                  scale: [1, 1.1, 1, 1.15, 1],
                  borderRadius: ["16px", "24px", "16px", "24px", "16px"],
                }
              : {
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1.05,
                  borderRadius: "16px",
                }
          }
          transition={{
            duration: duration / 1000,
            ease: "easeInOut",
            times: randomNumbers.map((_, i) => i / randomNumbers.length),
          }}
        >
          <motion.span
            animate={
              isRolling
                ? { opacity: [1, 0.8, 1, 0.7, 1], scale: [1, 1.2, 0.9, 1.1, 1] }
                : { opacity: 1, scale: 1.1 }
            }
            transition={{ duration: 0.5 }}
          >
            ?
          </motion.span>
        </motion.div>
      </div>

      <motion.div
        className="mt-8 max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.p
          className="text-lg text-neutral-600"
          animate={isRolling ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
          transition={{ repeat: isRolling ? Infinity : 0, duration: 1.5 }}
        >
          Randomly selecting next presenter...
        </motion.p>
        <p className="text-sm text-neutral-500 mt-2">
          {isRolling ? "Shuffling through students..." : "Student found!"}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DiceRoll;
