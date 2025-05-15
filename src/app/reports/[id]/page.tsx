"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import {
  Student,
  Subject,
  Class,
  StudentActivity,
} from "../../../models/Types";
import { getSubjects, getStudentActivities } from "../../../utils/storage";

type ClassReport = {
  class: Class;
  studentPresentations: {
    student: Student;
    date: number;
  }[];
  studentFeedback: {
    student: Student;
    date: number;
  }[];
};

export default function SubjectReportPage({
  params,
}: {
  params: { id: string };
}) {
  const unwrappedParams = React.use(params as any) as { id: string };
  const subjectId = unwrappedParams.id;
  const [subject, setSubject] = useState<Subject | null>(null);
  const [classReports, setClassReports] = useState<ClassReport[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const subjects = getSubjects();
    const foundSubject = subjects.find((s) => s.id === subjectId);

    if (foundSubject) {
      setSubject(foundSubject);

      // Get all activities for this subject
      const subjectActivities = getStudentActivities(undefined, subjectId);

      // Create reports for each class in the subject
      const reports = foundSubject.classes.map((classItem) => {
        // Filter activities for this class
        const classActivities = subjectActivities.filter(
          (activity) => activity.classId === classItem.id
        );

        // Group presentations by student
        const presentations = classActivities.filter(
          (activity) => activity.activityType === "presentation"
        );

        // Group feedback by student
        const feedback = classActivities.filter(
          (activity) => activity.activityType === "feedback"
        );

        // Map presentations to students with dates
        const studentPresentations = presentations.map((presentation) => {
          const student = foundSubject.students.find(
            (s) => s.id === presentation.studentId
          );
          return {
            student: student!,
            date: presentation.timestamp,
          };
        });

        // Map feedback to students with dates
        const studentFeedback = feedback.map((feedbackItem) => {
          const student = foundSubject.students.find(
            (s) => s.id === feedbackItem.studentId
          );
          return {
            student: student!,
            date: feedbackItem.timestamp,
          };
        });

        return {
          class: classItem,
          studentPresentations,
          studentFeedback,
        };
      });

      setClassReports(reports);
    } else {
      // Subject not found, redirect to main reports page
      router.push("/reports");
    }
  }, [subjectId, hasMounted, router]);

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Filter reports by selected class
  const filteredReports =
    selectedClass === "all"
      ? classReports
      : classReports.filter((report) => report.class.id === selectedClass);

  if (!hasMounted || !subject) {
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
          href="/reports"
          className="inline-flex items-center text-blue-500 hover:text-blue-700"
        >
          <FaArrowLeft className="mr-2" /> Back to Reports
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">{subject.name}</h1>
      <p className="text-gray-600 mb-6">
        Participation report for {subject.classes.length} classes and{" "}
        {subject.students.length} students
      </p>

      <div className="mb-6">
        <label
          htmlFor="class-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filter by Class:
        </label>
        <select
          id="class-filter"
          className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="all">All Classes</option>
          {subject.classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </select>
      </div>

      {filteredReports.length > 0 ? (
        filteredReports.map((report) => (
          <div
            key={report.class.id}
            className="bg-white rounded-lg shadow-md p-4 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">{report.class.name}</h2>

            <h3 className="text-lg font-medium mb-3">Presentations</h3>

            {report.studentPresentations.length > 0 ? (
              <div className="overflow-x-auto mb-6">
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
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.studentPresentations.map((presentation, index) => (
                      <tr key={`pres-${report.class.id}-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {presentation.student.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(presentation.date)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-6">
                No presentations recorded for this class
              </p>
            )}

            <h3 className="text-lg font-medium mb-3">Feedback Given</h3>

            {report.studentFeedback.length > 0 ? (
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
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.studentFeedback.map((feedback, index) => (
                      <tr key={`feed-${report.class.id}-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {feedback.student.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(feedback.date)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No feedback recorded for this class
              </p>
            )}
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">
            No data available for the selected class
          </p>
        </div>
      )}
    </main>
  );
}
