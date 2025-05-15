"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { Subject } from "../../../models/Types";
import { getSubjects } from "../../../utils/storage";

export default function ReportsPage({ params }: { params: { id: string } }) {
  // Properly unwrap params using React.use() - explicit casting to handle TypeScript
  const unwrappedParams = React.use(params as any) as { id: string };
  const reportId = unwrappedParams.id;

  const [subject, setSubject] = useState<Subject | null>(null);
  const router = useRouter();

  // Load subject data
  useEffect(() => {
    const subjects = getSubjects();
    const foundSubject = subjects.find((s) => s.id === reportId);

    if (foundSubject) {
      setSubject(foundSubject);
    } else {
      // Subject not found, redirect to home
      router.push("/");
    }
  }, [reportId, router]);

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

      <h1 className="text-3xl font-bold mb-6">Reports - {subject.name}</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Presentation Reports</h2>
        <p className="text-gray-600 mb-4">
          This feature is coming soon. In the future, you'll be able to view
          detailed reports on student presentations and feedback.
        </p>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-2">Available Data:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Total classes: {subject.classes.length}</li>
            <li>
              Total students:{" "}
              {subject.classes.reduce(
                (total, cls) => total + cls.students.length,
                0
              )}
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
