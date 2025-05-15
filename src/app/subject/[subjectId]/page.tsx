"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Subject, Class } from "../../../models/Types";
import ClassCard from "../../../components/ClassCard";
import { getSubjects, updateSubject } from "../../../utils/storage";
import { generateId } from "../../../utils/helpers";

export default function SubjectPage({
  params,
}: {
  params: { subjectId: string };
}) {
  // Properly unwrap params using React.use() - explicit casting to handle TypeScript
  const unwrappedParams = React.use(params as any) as { subjectId: string };
  const currentSubjectId = unwrappedParams.subjectId;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [newClassName, setNewClassName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Load subject data
    const subjects = getSubjects();
    const foundSubject = subjects.find((s) => s.id === currentSubjectId);

    if (foundSubject) {
      setSubject(foundSubject);
    } else {
      // Subject not found, redirect to home
      router.push("/");
    }
  }, [currentSubjectId, router]);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim() && subject) {
      const newClass: Class = {
        id: generateId(),
        name: newClassName.trim(),
        students: [],
      };

      const updatedSubject = {
        ...subject,
        classes: [...subject.classes, newClass],
      };

      updateSubject(updatedSubject);
      setSubject(updatedSubject);
      setNewClassName("");
    }
  };

  const handleDeleteClass = (classId: string) => {
    if (subject) {
      const updatedSubject = {
        ...subject,
        classes: subject.classes.filter((c) => c.id !== classId),
      };

      updateSubject(updatedSubject);
      setSubject(updatedSubject);
    }
  };

  const handleManageStudents = (classId: string) => {
    router.push(`/subject/${currentSubjectId}/class/${classId}/students`);
  };

  if (!subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-700"
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">{subject.name}</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
        <form onSubmit={handleAddClass} className="flex">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Enter class name"
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            Add Class
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Classes</h2>

      {subject.classes.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No classes added yet.</p>
          <p className="text-gray-500">Add a class to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subject.classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              subjectId={subject.id}
              onDelete={handleDeleteClass}
              onManageStudents={handleManageStudents}
            />
          ))}
        </div>
      )}
    </main>
  );
}
