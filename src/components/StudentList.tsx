"use client";

import React, { useState } from "react";
import { FaTrash, FaPlus, FaUserGraduate } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Student } from "../models/Types";
import { generateId } from "../utils/helpers";

interface StudentListProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onRemoveStudent: (id: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({
  students,
  onAddStudent,
  onRemoveStudent,
}) => {
  const [newStudentName, setNewStudentName] = useState("");

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      const newStudent: Student = {
        id: generateId(),
        name: newStudentName.trim(),
      };
      onAddStudent(newStudent);
      setNewStudentName("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-xl font-semibold mb-6 text-neutral-800 flex items-center gap-2">
        <FaUserGraduate className="text-primary-500" />
        <span>Manage Students</span>
      </h2>

      <form onSubmit={handleAddStudent} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            placeholder="Student name"
            className="input rounded-r-none flex-1"
          />
          <motion.button
            type="submit"
            className="btn btn-primary rounded-l-none px-4"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!newStudentName.trim()}
          >
            <FaPlus className="mr-2" /> Add
          </motion.button>
        </div>
      </form>

      <div className="border-t border-neutral-100 pt-4">
        <h3 className="text-lg font-medium mb-4 text-neutral-700">
          Students ({students.length})
        </h3>

        {students.length === 0 ? (
          <motion.div
            className="bg-neutral-50 rounded-lg p-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-neutral-500">No students added yet.</p>
            <p className="text-neutral-400 text-sm mt-1">
              Add students using the form above.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {students.map((student) => (
                <motion.div
                  key={student.id}
                  className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg group hover:bg-primary-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  layout
                >
                  <span className="font-medium text-neutral-700 group-hover:text-primary-700">
                    {student.name}
                  </span>
                  <motion.button
                    onClick={() => onRemoveStudent(student.id)}
                    className="text-neutral-400 hover:text-danger-500 p-2 rounded-full hover:bg-danger-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTrash />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
