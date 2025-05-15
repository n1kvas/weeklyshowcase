"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSubjects } from "../../../utils/storage";

interface ManageStudentsRedirectProps {
  params: {
    id: string;
  };
}

export default function ManageStudentsRedirect({
  params,
}: ManageStudentsRedirectProps) {
  const subjectId = params.id;
  const router = useRouter();

  useEffect(() => {
    // Find the first class of the subject and redirect to its student management
    const subjects = getSubjects();
    const subject = subjects.find((s) => s.id === subjectId);

    if (subject && subject.classes.length > 0) {
      // Redirect to the first class's student management
      const firstClass = subject.classes[0];
      router.push(`/subject/${subjectId}/class/${firstClass.id}/students`);
    } else if (subject) {
      // No classes yet, redirect to subject page
      router.push(`/subject/${subjectId}`);
    } else {
      // Subject not found, redirect to home
      router.push("/");
    }
  }, [subjectId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">Redirecting...</p>
    </div>
  );
}
