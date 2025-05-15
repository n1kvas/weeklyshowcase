"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaUsers, FaRegClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { Class } from "../models/Types";

interface ClassCardProps {
  classItem: Class;
  subjectId: string;
  onDelete: (id: string) => void;
  onManageStudents: (id: string) => void;
}

const formatTimeAgo = (timestamp: number | null | undefined): string => {
  if (!timestamp) return "Never";

  const now = Date.now();
  const seconds = Math.round((now - timestamp) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30);
  const years = Math.round(days / 365);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (weeks < 5) return `${weeks} wk${weeks === 1 ? "" : "s"} ago`;
  if (months < 12) return `${months} mo${months === 1 ? "" : "s"} ago`;
  return `${years} yr${years === 1 ? "" : "s"} ago`;
};

const ClassCard: React.FC<ClassCardProps> = ({
  classItem,
  subjectId,
  onDelete,
  onManageStudents,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/subject/${subjectId}/class/${classItem.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(classItem.id);
  };

  const handleManageStudents = (e: React.MouseEvent) => {
    e.stopPropagation();
    onManageStudents(classItem.id);
  };

  return (
    <motion.div
      className="card p-6 cursor-pointer overflow-hidden relative dark:border-neutral-700"
      onClick={handleClick}
      whileHover={{ y: -4, boxShadow: "0 12px 20px -10px rgba(0, 0, 0, 0.05)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-500 to-primary-500 dark:from-secondary-700 dark:to-primary-700"></div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-xl text-neutral-800 dark:text-neutral-100 mb-1">
            {classItem.name}
          </h3>
        </div>

        <div className="flex space-x-1">
          <motion.button
            className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 dark:text-neutral-400 dark:hover:text-primary-400 dark:hover:bg-primary-900 rounded-lg transition-colors"
            onClick={handleManageStudents}
            title="Manage Students"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUsers className="text-lg" />
          </motion.button>
          <motion.button
            className="p-2 text-neutral-500 hover:text-danger-600 hover:bg-danger-50 dark:text-neutral-400 dark:hover:text-danger-400 dark:hover:bg-danger-900 rounded-lg transition-colors"
            onClick={handleDelete}
            title="Delete Class"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTrash className="text-lg" />
          </motion.button>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
            <FaRegClock className="mr-1" />
            <span>
              Last session: {formatTimeAgo(classItem.lastSessionTimestamp)}
            </span>
          </div>
          <motion.div
            className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-medium"
            whileHover={{ scale: 1.05 }}
          >
            {"Start Session"}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClassCard;
