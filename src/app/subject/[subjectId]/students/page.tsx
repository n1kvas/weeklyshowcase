"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import { Subject, Student } from "../../../../models/Types";
import StudentList from "../../../../components/StudentList";
import * as firestoreService from "../../../../utils/firestoreService";
import { useAuth } from "../../../../utils/authContext";

export default function SubjectStudentManagementPage({
  params,
}: {
  params: { subjectId: string };
}) {
  const unwrappedParams = React.use(params as any) as { subjectId: string };
  const currentSubjectId = unwrappedParams.subjectId;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const loadSubject = async () => {
      try {
        if (!user) return;

        // Load all subjects and find the current one
        const subjects = await firestoreService.getSubjects(user.uid);
        const foundSubject = subjects.find((s) => s.id === currentSubjectId);

        if (foundSubject) {
          setSubject(foundSubject);
        } else {
          // Subject not found, redirect to home
          router.push("/");
        }
      } catch (error) {
        console.error("Error loading subject:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubject();
  }, [currentSubjectId, router, user]);

  const handleAddStudent = async (student: Student) => {
    if (!subject) return;

    try {
      await firestoreService.addStudentToSubject(currentSubjectId, student);

      // Update the local state to reflect the change
      setSubject({
        ...subject,
        students: [...(subject.students || []), student],
      });
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!subject || !subject.students) return;

    try {
      await firestoreService.removeStudentFromSubject(
        currentSubjectId,
        studentId
      );

      // Update the local state to reflect the change
      setSubject({
        ...subject,
        students: subject.students.filter((s) => s.id !== studentId),
      });
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="mb-8 h-10 bg-gray-300 rounded w-1/2 animate-pulse"></div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
            <div className="flex mb-6">
              <div className="input rounded-r-none flex-1 h-10 bg-gray-100 animate-pulse"></div>
              <div className="btn btn-primary rounded-l-none px-4 h-10 w-24 bg-gray-300 animate-pulse"></div>
            </div>
            <div className="border-t border-neutral-100 pt-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!subject) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          Subject not found. <Link href="/">Return to dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/subject/${currentSubjectId}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <FaArrowLeft className="mr-2" /> Back to Subject Details
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <FaUsers className="mr-3 text-primary-500" />
          Manage Students for {subject.name}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <StudentList
          students={subject.students || []}
          onAddStudent={handleAddStudent}
          onRemoveStudent={handleRemoveStudent}
        />
      </div>
    </main>
  );
}
