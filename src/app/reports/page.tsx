"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaChartBar } from "react-icons/fa";
import { Student, Subject, StudentActivity } from "../../models/Types";
import { getSubjects, getStudentActivities } from "../../utils/storage";

type StudentReport = {
  student: Student;
  presentations: StudentActivity[];
  feedback: StudentActivity[];
};

export default function ReportPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const loadedSubjects = getSubjects();
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

    // Create reports for each student
    const reports = allStudents.map((student) => {
      const presentations = getStudentActivities(
        student.id,
        undefined,
        "presentation"
      );
      const feedback = getStudentActivities(student.id, undefined, "feedback");

      return {
        student,
        presentations,
        feedback,
      };
    });

    setStudentReports(reports);
  }, [hasMounted]);

  // Filter reports by selected subject
  const filteredReports =
    selectedSubject === "all"
      ? studentReports
      : studentReports
          .map((report) => {
            return {
              ...report,
              presentations: report.presentations.filter(
                (p) => p.subjectId === selectedSubject
              ),
              feedback: report.feedback.filter(
                (f) => f.subjectId === selectedSubject
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
          <div className="h-8 bg-gray-300 rounded w-64 animate-pulse"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-700"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Student Participation Report</h1>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <label
            htmlFor="subject-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Subject:
          </label>
          <select
            id="subject-filter"
            className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Report Links */}
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/reports/${subject.id}`}
              className="inline-flex items-center px-3 py-2 border border-blue-300 bg-blue-50 text-blue-700 rounded-md text-sm hover:bg-blue-100 transition-colors"
            >
              <FaChartBar className="mr-2" />
              {subject.name} Report
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Student Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Presentations
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Feedback Given
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {report.student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {report.presentations.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {report.presentations.map((activity, index) => (
                            <li
                              key={`pres-${report.student.id}-${index}`}
                              className="text-sm text-gray-700"
                            >
                              {activity.className} ({activity.subjectName}) -{" "}
                              {formatDate(activity.timestamp)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-sm text-gray-500">
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
                              className="text-sm text-gray-700"
                            >
                              {activity.className} ({activity.subjectName}) -{" "}
                              {formatDate(activity.timestamp)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-sm text-gray-500">
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
                    className="px-6 py-4 text-center text-sm text-gray-500"
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
