"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft, FaChartBar } from "react-icons/fa";
import { Student, Subject, StudentActivity } from "../../models/Types";
import {
  getSubjects,
  getStudentActivities,
  addStudentActivity,
} from "../../utils/firestoreService";
import { useAuth } from "../../utils/authContext";

type StudentReport = {
  student: Student;
  presentations: StudentActivity[];
  feedback: StudentActivity[];
};

export default function ReportPage() {
  const { userData } = useAuth();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Set the selected subject from URL parameter when subjects are loaded
  useEffect(() => {
    if (subjectParam && subjects.some((s) => s.id === subjectParam)) {
      setSelectedSubject(subjectParam);
    }
  }, [subjectParam, subjects]);

  useEffect(() => {
    if (!hasMounted || !userData) return;

    const fetchData = async () => {
      // Log the teacher ID for debugging
      console.log("Loading data for teacher ID:", userData.uid);

      const loadedSubjects = await getSubjects(userData.uid); // Use userData.uid as teacherId
      console.log("Loaded subjects:", loadedSubjects);
      setSubjects(loadedSubjects);

      // Build the report data
      const allStudents: Student[] = [];

      // Collect all students
      loadedSubjects.forEach((subject) => {
        if (subject.students) {
          subject.students.forEach((student) => {
            if (!allStudents.some((s) => s.id === student.id)) {
              allStudents.push(student);
            }
          });
        }
      });

      console.log(
        "All collected students:",
        allStudents.map((s) => s.name)
      );

      // Add some test activities to Firestore for debugging
      // You can remove this after testing
      try {
        const { addStudentActivity } = await import(
          "../../utils/firestoreService"
        );

        // Only add test data if no activities exist
        if (allStudents.length > 0 && loadedSubjects.length > 0) {
          const firstStudent = allStudents[0];
          const firstSubject = loadedSubjects[0];
          const firstClass = firstSubject.classes?.[0];

          if (firstClass) {
            console.log("Adding sample activity for:", firstStudent.name);

            // Add a sample presentation activity
            await addStudentActivity({
              studentId: firstStudent.id,
              classId: firstClass.id,
              subjectId: firstSubject.id,
              activityType: "presentation",
              timestamp: Date.now(),
              className: firstClass.name,
              subjectName: firstSubject.name,
            });

            // Add a sample feedback activity
            await addStudentActivity({
              studentId: firstStudent.id,
              classId: firstClass.id,
              subjectId: firstSubject.id,
              activityType: "feedback",
              timestamp: Date.now(),
              className: firstClass.name,
              subjectName: firstSubject.name,
            });

            console.log("Added sample activities to Firestore");
          }
        }
      } catch (error) {
        console.error("Error adding sample activities:", error);
      }

      // Create reports for each student
      const reports = await Promise.all(
        allStudents.map(async (student) => {
          console.log(
            `Activities for student ${student.name} (${student.id}):`
          );

          const presentations = await getStudentActivities(
            student.id,
            undefined,
            "presentation"
          );
          const feedback = await getStudentActivities(
            student.id,
            undefined,
            "feedback"
          );

          console.log("Presentations:", presentations);
          console.log("Feedback:", feedback);

          return {
            student,
            presentations,
            feedback,
          };
        })
      );

      console.log("Final studentReports to be set:", reports);
      setStudentReports(reports);
    };

    fetchData();
  }, [hasMounted, userData]);

  // Filter reports by selected subject
  const filteredReports =
    selectedSubject === "all"
      ? studentReports
      : studentReports
          .map((report) => {
            // Log to debug the filtering
            console.log("Selected subject:", selectedSubject);
            if (report.presentations.length > 0) {
              console.log(
                "First presentation subjectId:",
                report.presentations[0].subjectId
              );
            }

            // Enhanced filtering - try matching by subjectId or by subjectName that contains the selected subject's name
            const selectedSubjectObj = subjects.find(
              (s) => s.id === selectedSubject
            );
            const selectedSubjectName = selectedSubjectObj
              ? selectedSubjectObj.name
              : "";

            return {
              ...report,
              presentations: report.presentations.filter(
                (p) =>
                  p.subjectId === selectedSubject ||
                  (selectedSubjectName &&
                    p.subjectName &&
                    p.subjectName.includes(selectedSubjectName))
              ),
              feedback: report.feedback.filter(
                (f) =>
                  f.subjectId === selectedSubject ||
                  (selectedSubjectName &&
                    f.subjectName &&
                    f.subjectName.includes(selectedSubjectName))
              ),
            };
          })
          .filter(
            (report) =>
              report.presentations.length > 0 || report.feedback.length > 0
          );

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (!hasMounted) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 bg-gray-300 dark:bg-neutral-700 rounded w-64 animate-pulse"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Student Participation Report
      </h1>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <label
            htmlFor="subject-filter"
            className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
          >
            Filter by Subject:
          </label>
          <select
            id="subject-filter"
            className="w-full md:w-64 p-2 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white rounded-md"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all" className="dark:bg-neutral-800 dark:text-white">
              All Subjects
            </option>
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
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Student Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Presentations
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Feedback Given
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                        {report.student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {report.presentations.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {report.presentations.map((activity, index) => (
                            <li
                              key={`pres-${report.student.id}-${index}`}
                              className="text-sm text-gray-700 dark:text-neutral-300"
                            >
                              {activity.className} ({activity.subjectName}) -{" "}
                              {formatDate(activity.timestamp)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-neutral-400">
                          No presentations
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {report.feedback.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {report.feedback.map((activity, index) => (
                            <li
                              key={`feed-${report.student.id}-${index}`}
                              className="text-sm text-gray-700 dark:text-neutral-300"
                            >
                              {activity.className} ({activity.subjectName}) -{" "}
                              {formatDate(activity.timestamp)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-neutral-400">
                          No feedback given
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-neutral-400"
                  >
                    No data available for the selected subject
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
