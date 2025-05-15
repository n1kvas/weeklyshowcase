"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../../utils/authContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import * as firestoreService from "../../utils/firestoreService";
import { Subject, Student } from "../../models/Types";

export default function ManageStudents() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && userData) {
      // Only allow teachers to access this page
      if (userData.role !== "teacher") {
        router.push("/");
        return;
      }

      const loadData = async () => {
        setLoading(true);
        try {
          // Load subjects owned by this teacher
          const teacherSubjects = await firestoreService.getSubjects(user.uid);
          setSubjects(teacherSubjects);

          // Load all students
          const allStudents = await firestoreService.getAllStudents();
          setStudents(allStudents);

          if (teacherSubjects.length > 0) {
            setSelectedSubject(teacherSubjects[0].id);
          }
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [user, userData, router]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  const handleAddStudent = async (student: Student) => {
    if (selectedSubject) {
      try {
        await firestoreService.addStudentToSubject(selectedSubject, student);

        // Update the subject in the local state
        setSubjects(
          subjects.map((subject) => {
            if (subject.id === selectedSubject) {
              // Check if student is already in the subject
              if (!subject.students.some((s) => s.id === student.id)) {
                return {
                  ...subject,
                  students: [...subject.students, student],
                };
              }
            }
            return subject;
          })
        );
      } catch (error) {
        console.error("Error adding student:", error);
      }
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (selectedSubject) {
      try {
        await firestoreService.removeStudentFromSubject(
          selectedSubject,
          studentId
        );

        // Update the subject in the local state
        setSubjects(
          subjects.map((subject) => {
            if (subject.id === selectedSubject) {
              return {
                ...subject,
                students: subject.students.filter((s) => s.id !== studentId),
              };
            }
            return subject;
          })
        );
      } catch (error) {
        console.error("Error removing student:", error);
      }
    }
  };

  // Get the current subject's enrolled students
  const currentSubject = subjects.find((s) => s.id === selectedSubject);
  const enrolledStudents = currentSubject?.students || [];

  // Filter out already enrolled students from the available list
  const availableStudents = students.filter(
    (student) => !enrolledStudents.some((s) => s.id === student.id)
  );

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-secondary-600 dark:from-primary-500 dark:to-secondary-400">
            Manage Students
          </h1>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
            </div>
          ) : subjects.length === 0 ? (
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md text-center">
              <h2 className="text-xl font-medium mb-4 dark:text-white">
                No Subjects Found
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                You need to create a subject before you can manage students.
              </p>
              <button
                onClick={() => router.push("/")}
                className="btn btn-primary"
              >
                Create a Subject
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md">
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  className="input"
                >
                  {subjects.map((subject) => (
                    <option
                      key={subject.id}
                      value={subject.id}
                      className="dark:bg-neutral-800 dark:text-white"
                    >
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Available Students */}
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-3 dark:text-white">
                    Available Students
                  </h3>
                  {availableStudents.length === 0 ? (
                    <p className="text-neutral-500 dark:text-neutral-400 italic">
                      No available students to add.
                    </p>
                  ) : (
                    <ul className="divide-y divide-neutral-100 dark:divide-neutral-700">
                      {availableStudents.map((student) => (
                        <li
                          key={student.id}
                          className="py-3 flex justify-between items-center dark:text-neutral-300"
                        >
                          <span>{student.name}</span>
                          <button
                            onClick={() => handleAddStudent(student)}
                            className="px-3 py-1 text-xs bg-primary-50 text-primary-600 rounded hover:bg-primary-100 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800 transition-colors"
                          >
                            Add to Subject
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Enrolled Students */}
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-3 dark:text-white">
                    Enrolled Students
                  </h3>
                  {enrolledStudents.length === 0 ? (
                    <p className="text-neutral-500 dark:text-neutral-400 italic">
                      No students enrolled in this subject yet.
                    </p>
                  ) : (
                    <ul className="divide-y divide-neutral-100 dark:divide-neutral-700">
                      {enrolledStudents.map((student) => (
                        <li
                          key={student.id}
                          className="py-3 flex justify-between items-center dark:text-neutral-300"
                        >
                          <span>{student.name}</span>
                          <button
                            onClick={() => handleRemoveStudent(student.id)}
                            className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
