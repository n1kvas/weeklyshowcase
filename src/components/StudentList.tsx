"use client";

import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Student } from "../models/Types";
import { generateId } from "../utils/helpers";

interface StudentListProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onRemoveStudent: (studentId: string) => void;
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
      const newStudent = {
        id: generateId(),
        name: newStudentName.trim(),
      };
      onAddStudent(newStudent);
      setNewStudentName("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Manage Students</h2>

      <form onSubmit={handleAddStudent} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            placeholder="Enter student name"
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {students.length === 0 ? (
          <p className="text-gray-500">No students added yet.</p>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <span>{student.name}</span>
              <button
                onClick={() => onRemoveStudent(student.id)}
                className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                title="Remove Student"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentList;
