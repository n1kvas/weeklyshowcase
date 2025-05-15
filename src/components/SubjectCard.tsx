"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaUsers, FaChartBar } from "react-icons/fa";
import { Subject } from "../models/Types";

interface SubjectCardProps {
  subject: Subject;
  onDelete: (id: string) => void;
  onManageStudents: (id: string) => void;
  onViewReports: (id: string) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onDelete,
  onManageStudents,
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
    onManageStudents(subject.id);
  };

  const handleViewReports = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewReports(subject.id);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{subject.name}</h3>
        <div className="flex space-x-2">
          <button
            className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
            onClick={handleManageStudents}
            title="Manage Students"
          >
            <FaUsers />
          </button>
          <button
            className="p-2 text-green-500 hover:bg-green-100 rounded-full"
            onClick={handleViewReports}
            title="View Reports"
          >
            <FaChartBar />
          </button>
          <button
            className="p-2 text-red-500 hover:bg-red-100 rounded-full"
            onClick={handleDelete}
            title="Delete Subject"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mt-2">
        {subject.classes.length}{" "}
        {subject.classes.length === 1 ? "class" : "classes"}
      </p>
    </div>
  );
};

export default SubjectCard;
