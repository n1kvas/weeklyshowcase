"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Subject, Class } from "../../../models/Types";
import ClassCard from "../../../components/ClassCard";
import * as firestoreService from "../../../utils/firestoreService";
import { generateId } from "../../../utils/helpers";
import { useAuth } from "../../../utils/authContext";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const loadSubject = async () => {
      setLoading(true);
      try {
        // Get all subjects for this user
        const userSubjects = await firestoreService.getSubjects(
          user?.uid || ""
        );

        // Find the specific subject by ID
        const foundSubject = userSubjects.find(
          (s) => s.id === currentSubjectId
        );

        if (foundSubject) {
          setSubject(foundSubject);
        } else {
          // Subject not found, redirect to home
          router.push("/");
        }
      } catch (error) {
        console.error("Error loading subject:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (currentSubjectId) {
      loadSubject();
    }
  }, [currentSubjectId, router, user]);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim() && subject) {
      const newClass: Class = {
        id: generateId(),
        name: newClassName.trim(),
      };

      try {
        // Add class through Firestore
        await firestoreService.addClass(subject.id, newClass);

        // Update local state
        const updatedSubject = {
          ...subject,
          classes: [...subject.classes, newClass],
        };

        setSubject(updatedSubject);
        setNewClassName("");
      } catch (error) {
        console.error("Error adding class:", error);
      }
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (subject) {
      try {
        // Remove class through Firestore
        await firestoreService.removeClass(classId);

        // Update local state
        const updatedSubject = {
          ...subject,
          classes: subject.classes.filter((c) => c.id !== classId),
        };

        setSubject(updatedSubject);
      } catch (error) {
        console.error("Error deleting class:", error);
      }
    }
  };

  const handleManageStudents = (classId: string) => {
    router.push(`/subject/${currentSubjectId}/class/${classId}/students`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="dark:text-white">Subject not found.</p>
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        {subject.name}
      </h1>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Add New Class
        </h2>
        <form onSubmit={handleAddClass} className="flex">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Enter class name"
            className="flex-1 p-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-700 dark:text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white px-4 py-2 rounded-r-md"
          >
            Add Class
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Classes</h2>

      {subject.classes.length === 0 ? (
        <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-neutral-300 mb-4">
            No classes added yet.
          </p>
          <p className="text-gray-500 dark:text-neutral-400">
            Add a class to get started!
          </p>
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
