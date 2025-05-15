"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaUsers, FaChartBar } from "react-icons/fa";
import { motion } from "framer-motion";
import { Subject } from "../models/Types";

interface SubjectCardProps {
  subject: Subject;
  onDelete: (id: string) => void;
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
    onDelete(subject.id);
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
      className="card p-6 cursor-pointer hover:shadow-elevation transition-shadow overflow-hidden relative"
      onClick={handleClick}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Decorative element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-xl text-neutral-800 mb-1">
            {subject.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
              {subject.classes.length}{" "}
              {subject.classes.length === 1 ? "class" : "classes"}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-50 text-secondary-700">
              {subject.students.length}{" "}
              {subject.students.length === 1 ? "student" : "students"}
            </span>
          </div>
        </div>

        <div className="flex space-x-1">
          <motion.button
            className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            onClick={handleManageStudents}
            title="Manage Students"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUsers className="text-lg" />
          </motion.button>
          <motion.button
            className="p-2 text-neutral-500 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
            onClick={handleViewReports}
            title="View Reports"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChartBar className="text-lg" />
          </motion.button>
          <motion.button
            className="p-2 text-neutral-500 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
            onClick={handleDelete}
            title="Delete Subject"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTrash className="text-lg" />
          </motion.button>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-neutral-100">
        <div className="flex justify-between text-sm text-neutral-600">
          <span>
            Last session: {subject.classes.length > 0 ? "2 days ago" : "Never"}
          </span>
          <motion.span
            className="text-primary-600 font-medium cursor-pointer"
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
