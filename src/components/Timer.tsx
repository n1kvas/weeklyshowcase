"use client";

import React, { useState, useEffect, useRef } from "react";
import { TimerType } from "../models/Types";
import { motion, AnimatePresence } from "framer-motion";

interface TimerProps {
  duration: number; // in seconds
  timerType: TimerType;
  onComplete: () => void;
  autoStart?: boolean;
}

const Timer: React.FC<TimerProps> = ({
  duration,
  timerType,
  onComplete,
  autoStart = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const doubleClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCount = useRef(0);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(autoStart);
  }, [duration, autoStart]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage = (timeLeft / duration) * 100;
  const circumference = 2 * Math.PI * 45; // Circle radius is 45
  const dashOffset = circumference * (1 - progressPercentage / 100);

  const handleTimerClick = () => {
    clickCount.current += 1;

    if (clickCount.current === 1) {
      // Single click - pause/resume
      doubleClickTimeoutRef.current = setTimeout(() => {
        setIsRunning((prev) => !prev);
        clickCount.current = 0;
      }, 300);
    } else if (clickCount.current === 2) {
      // Double click - skip
      if (doubleClickTimeoutRef.current) {
        clearTimeout(doubleClickTimeoutRef.current);
      }
      setTimeLeft(0);
      setIsRunning(false);
      onComplete();
      clickCount.current = 0;
    }
  };

  // Get color based on timer type
  const getTimerColor = () => {
    switch (timerType) {
      case TimerType.PRESENTATION:
        return "text-primary-500 stroke-primary-500";
      case TimerType.STUDENT_FEEDBACK:
        return "text-success-500 stroke-success-500";
      case TimerType.LECTURER_FEEDBACK:
        return "text-secondary-500 stroke-secondary-500";
      case TimerType.REFLECTION:
        return "text-warning-500 stroke-warning-500";
      default:
        return "text-neutral-500 stroke-neutral-500";
    }
  };

  const getTimerBgColor = () => {
    switch (timerType) {
      case TimerType.PRESENTATION:
        return "bg-primary-50";
      case TimerType.STUDENT_FEEDBACK:
        return "bg-success-50";
      case TimerType.LECTURER_FEEDBACK:
        return "bg-secondary-50";
      case TimerType.REFLECTION:
        return "bg-warning-50";
      default:
        return "bg-neutral-50";
    }
  };

  const getTimerLabel = () => {
    switch (timerType) {
      case TimerType.PRESENTATION:
        return "Presentation";
      case TimerType.STUDENT_FEEDBACK:
        return "Student Feedback";
      case TimerType.LECTURER_FEEDBACK:
        return "Lecturer Feedback";
      case TimerType.REFLECTION:
        return "Reflection";
      default:
        return "Timer";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`text-lg font-medium mb-4 px-4 py-2 rounded-full ${getTimerBgColor()} ${getTimerColor().replace(
          "stroke-",
          "text-"
        )}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {getTimerLabel()}
      </motion.div>

      <motion.div
        className="relative w-72 h-72 flex items-center justify-center cursor-pointer"
        onClick={handleTimerClick}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <svg className="w-full h-full drop-shadow-md" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="white"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="2"
          />

          {/* Background track circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="#e6e6e6"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Colored progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={getTimerColor()}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>

        <motion.div
          className={`absolute ${getTimerColor()} text-5xl font-bold`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          {formatTime(timeLeft)}
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 text-sm text-neutral-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {isRunning
          ? "Tap to pause"
          : timeLeft === 0
          ? "Completed"
          : "Tap to start • Double-tap to skip"}
      </motion.div>
    </div>
  );
};

export default Timer;
