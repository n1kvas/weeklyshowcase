"use client";

import React, { useState, useEffect, useRef } from "react";
import { TimerType } from "../models/Types";

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
      // Double click - skip timer
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
        return "text-blue-500 stroke-blue-500";
      case TimerType.STUDENT_FEEDBACK:
        return "text-green-500 stroke-green-500";
      case TimerType.LECTURER_FEEDBACK:
        return "text-purple-500 stroke-purple-500";
      case TimerType.REFLECTION:
        return "text-orange-500 stroke-orange-500";
      default:
        return "text-gray-500 stroke-gray-500";
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
      <div className="text-lg mb-2">{getTimerLabel()}</div>
      <div
        className="relative w-64 h-64 flex items-center justify-center cursor-pointer"
        onClick={handleTimerClick}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Gray background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="#e6e6e6"
            strokeWidth="5"
          />
          {/* Colored progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={getTimerColor()}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className={`absolute ${getTimerColor()} text-4xl font-bold`}>
          {formatTime(timeLeft)}
        </div>
      </div>
      <div className="mt-4">
        {!isRunning && timeLeft === duration ? (
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-blue-600"
            onClick={() => setIsRunning(true)}
          >
            Start
          </button>
        ) : (
          <p className="text-sm text-gray-600">
            {isRunning
              ? "Tap once to pause, double tap to skip"
              : timeLeft > 0
              ? "Tap to resume"
              : "Completed"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Timer;
