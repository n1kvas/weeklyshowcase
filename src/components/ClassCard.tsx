"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaUsers } from "react-icons/fa";
import { Class } from "../models/Types";

interface ClassCardProps {
  classItem: Class;
  subjectId: string;
  onDelete: (id: string) => void;
  onManageStudents: (classId: string) => void;
}

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
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{classItem.name}</h3>
        <div className="flex space-x-2">
          <button
            className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
            onClick={handleManageStudents}
            title="Manage Students"
          >
            <FaUsers />
          </button>
          <button
            className="p-2 text-red-500 hover:bg-red-100 rounded-full"
            onClick={handleDelete}
            title="Delete Class"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mt-2">
        {classItem.students.length}{" "}
        {classItem.students.length === 1 ? "student" : "students"}
      </p>
    </div>
  );
};

export default ClassCard;
