"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Subject, Class, Student } from "../../../../../../models/Types";
import StudentList from "../../../../../../components/StudentList";
import { getSubjects, updateSubject } from "../../../../../../utils/storage";

export default function StudentManagementPage({
  params,
}: {
  params: { subjectId: string; classId: string };
}) {
  // Properly unwrap params using React.use() - explicit casting to handle TypeScript
  const unwrappedParams = React.use(params as any) as {
    subjectId: string;
    classId: string;
  };
  const currentSubjectId = unwrappedParams.subjectId;
  const currentClassId = unwrappedParams.classId;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const router = useRouter();

  // Load data
  useEffect(() => {
    const subjects = getSubjects();
    const foundSubject = subjects.find((s) => s.id === currentSubjectId);

    if (foundSubject) {
      setSubject(foundSubject);
      const foundClass = foundSubject.classes.find(
        (c) => c.id === currentClassId
      );

      if (foundClass) {
        setCurrentClass(foundClass);
      } else {
        // Class not found, redirect to subject page
        router.push(`/subject/${currentSubjectId}`);
      }
    } else {
      // Subject not found, redirect to home
      router.push("/");
    }
  }, [currentSubjectId, currentClassId, router]);

  const handleAddStudent = (student: Student) => {
    if (!subject || !currentClass) return;

    // Add student to the class
    const updatedClass = {
      ...currentClass,
      students: [...currentClass.students, student],
    };

    // Update the class in the subject
    const updatedClasses = subject.classes.map((c) =>
      c.id === currentClassId ? updatedClass : c
    );

    const updatedSubject = {
      ...subject,
      classes: updatedClasses,
    };

    // Save changes
    updateSubject(updatedSubject);
    setSubject(updatedSubject);
    setCurrentClass(updatedClass);
  };

  const handleRemoveStudent = (studentId: string) => {
    if (!subject || !currentClass) return;

    // Remove student from the class
    const updatedClass = {
      ...currentClass,
      students: currentClass.students.filter((s) => s.id !== studentId),
    };

    // Update the class in the subject
    const updatedClasses = subject.classes.map((c) =>
      c.id === currentClassId ? updatedClass : c
    );

    const updatedSubject = {
      ...subject,
      classes: updatedClasses,
    };

    // Save changes
    updateSubject(updatedSubject);
    setSubject(updatedSubject);
    setCurrentClass(updatedClass);
  };

  if (!subject || !currentClass) {
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
          href={`/subject/${currentSubjectId}/class/${currentClassId}`}
          className="inline-flex items-center text-blue-500 hover:text-blue-700"
        >
          <FaArrowLeft className="mr-2" /> Back to Class
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">{currentClass.name}</h1>
      <h2 className="text-xl text-gray-600 mb-6">{subject.name}</h2>

      <div className="max-w-2xl mx-auto">
        <StudentList
          students={currentClass.students}
          onAddStudent={handleAddStudent}
          onRemoveStudent={handleRemoveStudent}
        />
      </div>
    </main>
  );
}
