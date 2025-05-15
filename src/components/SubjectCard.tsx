"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaUsers, FaChartBar } from "react-icons/fa";
import { motion } from "framer-motion";
import { Subject } from "../models/Types";

interface SubjectCardProps {
  subject: Subject;
  onDelete?: (id: string) => void;
  onViewReports: (id: string) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onDelete,
  onViewReports,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/subject/${subject.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(subject.id);
    }
  };

  const handleManageStudents = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/subject/${subject.id}/students`);
  };

  const handleViewReports = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewReports(subject.id);
  };

  return (
    <motion.div
      className="card p-6 cursor-pointer hover:shadow-elevation transition-shadow overflow-hidden relative dark:border-neutral-700"
      onClick={handleClick}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-700 dark:to-secondary-700"></div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-xl text-neutral-800 dark:text-neutral-100 mb-1">
            {subject.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              {subject.classes.length}{" "}
              {subject.classes.length === 1 ? "class" : "classes"}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-50 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300">
              {subject.students.length}{" "}
              {subject.students.length === 1 ? "student" : "students"}
            </span>
          </div>
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
            className="p-2 text-neutral-500 hover:text-secondary-600 hover:bg-secondary-50 dark:text-neutral-400 dark:hover:text-secondary-400 dark:hover:bg-secondary-900 rounded-lg transition-colors"
            onClick={handleViewReports}
            title="View Reports"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChartBar className="text-lg" />
          </motion.button>
          {onDelete && (
            <motion.button
              className="p-2 text-neutral-500 hover:text-danger-600 hover:bg-danger-50 dark:text-neutral-400 dark:hover:text-danger-400 dark:hover:bg-danger-900 rounded-lg transition-colors"
              onClick={handleDelete}
              title="Delete Subject"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTrash className="text-lg" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-700">
        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>
            Last session: {subject.classes.length > 0 ? "2 days ago" : "Never"}
          </span>
          <motion.span
            className="text-primary-600 dark:text-primary-400 font-medium cursor-pointer"
            whileHover={{ x: 2 }}
          >
            Manage →
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectCard;
