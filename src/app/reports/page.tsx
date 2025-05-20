"use client";

import React, { useState, useEffect, Suspense } from "react";
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

// New component to contain the logic using useSearchParams
function ReportContent() {
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

  // Handle subject selection change
  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value);
  };

  if (!hasMounted) {
    return <div>Loading reports...</div>; // Or any other loading indicator
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-center flex-grow text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          <FaChartBar className="inline-block mr-3 text-pink-500" />
          Student Reports
        </h1>
      </div>

      <div className="mb-6">
        <label
          htmlFor="subject-filter"
          className="block text-lg font-medium text-gray-300 mb-2"
        >
          Filter by Subject:
        </label>
        <select
          id="subject-filter"
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="w-full md:w-1/3 bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <p className="text-2xl">No report data available.</p>
          <p>
            This might be because there are no students, no activities, or the
            selected filter has no matching data.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map(({ student, presentations, feedback }) => (
            <div
              key={student.id}
              className="bg-slate-800 shadow-xl rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold mb-3 text-purple-400">
                {student.name}
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-pink-400 mb-1">
                  Presentations:
                </h3>
                {presentations.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {presentations.map((p, index) => (
                      <li key={index}>
                        {p.subjectName} - {p.className} (
                        {formatDate(p.timestamp)})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No presentations recorded.</p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-pink-400 mb-1">
                  Feedback Given:
                </h3>
                {feedback.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {feedback.map((f, index) => (
                      <li key={index}>
                        {f.subjectName} - {f.className} (
                        {formatDate(f.timestamp)})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No feedback recorded.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div>Loading report page...</div>}>
      <ReportContent />
    </Suspense>
  );
}
