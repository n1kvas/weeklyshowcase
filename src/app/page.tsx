"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Subject } from "../models/Types";
import SubjectCard from "../components/SubjectCard";
import { getSubjects, addSubject, removeSubject } from "../utils/storage";
import { generateId } from "../utils/helpers";

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Load subjects from localStorage
    const loadedSubjects = getSubjects();
    setSubjects(loadedSubjects);
  }, []);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      const newSubject: Subject = {
        id: generateId(),
        name: newSubjectName.trim(),
        classes: [],
      };

      addSubject(newSubject);
      setSubjects([...subjects, newSubject]);
      setNewSubjectName("");
    }
  };

  const handleDeleteSubject = (id: string) => {
    removeSubject(id);
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const handleManageStudents = (id: string) => {
    router.push(`/manage-students/${id}`);
  };

  const handleViewReports = (id: string) => {
    router.push(`/reports/${id}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Weekly Showcase</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Subject</h2>
        <form onSubmit={handleAddSubject} className="flex">
          <input
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="Enter subject name"
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            Add Subject
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Subjects</h2>

      {subjects.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No subjects added yet.</p>
          <p className="text-gray-500">Add a subject to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onDelete={handleDeleteSubject}
              onManageStudents={handleManageStudents}
              onViewReports={handleViewReports}
            />
          ))}
        </div>
      )}
    </main>
  );
}
