"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaChalkboardTeacher, FaChartBar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Subject } from "../models/Types";
import SubjectCard from "../components/SubjectCard";
import { generateId } from "../utils/helpers";
import { useAuth } from "../utils/authContext";
import ProtectedRoute from "../components/ProtectedRoute";
import * as firestoreService from "../utils/firestoreService";

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const { user, userData } = useAuth();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && user && userData) {
      const loadSubjects = async () => {
        // For teachers, load their subjects
        // For students, load subjects they're enrolled in
        const loadedSubjects =
          userData.role === "teacher"
            ? await firestoreService.getSubjects(user.uid)
            : await loadStudentSubjects();

        setSubjects(loadedSubjects);
      };

      loadSubjects();
    }
  }, [hasMounted, user, userData]);

  // Helper function to load subjects for students
  const loadStudentSubjects = async () => {
    if (!user) return [];

    // Get all subjects
    const allSubjects = await firestoreService.getSubjects("");

    // Filter to only subjects where this student is enrolled
    return allSubjects.filter(
      (subject) =>
        subject.students &&
        subject.students.some((student) => student.id === user.uid)
    );
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim() && user) {
      const newSubject: Subject = {
        id: generateId(),
        name: newSubjectName.trim(),
        classes: [],
        students: [],
      };

      // Add subject to Firestore
      await firestoreService.addSubject(newSubject, user.uid);

      setSubjects([...subjects, newSubject]);
      setNewSubjectName("");
      setShowAddForm(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    await firestoreService.removeSubject(id);
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const handleViewReports = (id: string) => {
    router.push(`/reports?subject=${id}`);
  };

  // If user is not authenticated, display welcome page
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-secondary-600 dark:from-primary-500 dark:to-secondary-400">
            Welcome to Weekly Showcase
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            A platform for teachers to manage student presentations with
            interactive feedback timers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <button className="btn btn-primary px-8 py-3 text-lg">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="btn btn-secondary px-8 py-3 text-lg">
                Register
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md">
            <div className="text-primary-500 dark:text-primary-400 text-3xl mb-4">
              🎓
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              For Teachers
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              Create subjects, manage classes, and keep track of student
              presentations.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md">
            <div className="text-primary-500 dark:text-primary-400 text-3xl mb-4">
              ⏱️
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              Timed Presentations
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              Use interactive timers for presentations, feedback, and
              reflections.
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md">
            <div className="text-primary-500 dark:text-primary-400 text-3xl mb-4">
              📊
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              Track Progress
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              View reports on student participation and engagement.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasMounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold h-10 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 animate-pulse"></h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1 h-6 bg-gray-200 dark:bg-neutral-700 rounded w-1/2 animate-pulse"></p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <div className="h-12 w-36 bg-gray-300 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-12 w-36 bg-gray-300 dark:bg-neutral-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="mb-6 flex items-center">
          <h2 className="text-2xl font-semibold h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/4 animate-pulse"></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6 h-32 bg-gray-100 dark:bg-neutral-800 rounded-xl animate-pulse"></div>
          <div className="card p-6 h-32 bg-gray-100 dark:bg-neutral-800 rounded-xl animate-pulse"></div>
          <div className="card p-6 h-32 bg-gray-100 dark:bg-neutral-800 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  // For authenticated users, show regular content with proper access control
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-0"
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-secondary-600 dark:from-primary-500 dark:to-secondary-400">
              Weekly Showcase
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300 mt-1">
              {userData?.role === "teacher"
                ? "Manage your subjects and student presentations"
                : "View your enrolled subjects and presentations"}
            </p>
          </motion.div>

          <div className="flex space-x-3">
            <Link href="/reports">
              <motion.button
                className="btn btn-secondary shadow-button flex items-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FaChartBar className="mr-2" />
                Student Reports
              </motion.button>
            </Link>

            {userData?.role === "teacher" && (
              <motion.button
                className="btn btn-primary shadow-button flex items-center"
                onClick={() => setShowAddForm(!showAddForm)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FaPlus className="mr-2" />
                {showAddForm ? "Cancel" : "Add Subject"}
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showAddForm && userData?.role === "teacher" && (
            <motion.div
              className="card p-6 mb-8"
              initial={{ opacity: 0, height: 0, overflow: "hidden" }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
                <FaChalkboardTeacher className="mr-2 text-primary-500 dark:text-primary-400" />
                <span>Add New Subject</span>
              </h2>
              <form onSubmit={handleAddSubject}>
                <div className="mb-4">
                  <label
                    htmlFor="subject-name"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                  >
                    Subject Name
                  </label>
                  <input
                    id="subject-name"
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="Enter subject name (e.g., Mathematics, Physics)"
                    className="input"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    className="btn btn-primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={!newSubjectName.trim()}
                  >
                    <FaPlus className="mr-2" /> Create Subject
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="mb-6 flex items-center">
            <h2 className="text-2xl font-semibold dark:text-white">
              {userData?.role === "teacher"
                ? "Your Subjects"
                : "Enrolled Subjects"}
            </h2>
            <div className="ml-3 bg-neutral-100 px-3 py-1 rounded-full text-sm text-neutral-600">
              {subjects.length} {subjects.length === 1 ? "subject" : "subjects"}
            </div>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center text-neutral-500 dark:text-neutral-400 py-10">
              <p className="text-lg">
                {userData?.role === "teacher"
                  ? "You haven't added any subjects yet."
                  : "You are not enrolled in any subjects yet."}
              </p>
              {userData?.role === "teacher" && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn btn-primary mt-4"
                >
                  <FaPlus className="mr-2" /> Add your first subject
                </button>
              )}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              initial="hidden"
              animate="visible"
            >
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <SubjectCard
                    subject={subject}
                    onDelete={
                      userData?.role === "teacher"
                        ? handleDeleteSubject
                        : undefined
                    }
                    onViewReports={handleViewReports}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
