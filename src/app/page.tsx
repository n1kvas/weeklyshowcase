"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaChalkboardTeacher, FaChartBar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Subject } from "../models/Types";
import SubjectCard from "../components/SubjectCard";
import { getSubjects, addSubject, removeSubject } from "../utils/storage";
import { generateId } from "../utils/helpers";

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const loadedSubjects = getSubjects();
      setSubjects(loadedSubjects);
    }
  }, [hasMounted]);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      const newSubject: Subject = {
        id: generateId(),
        name: newSubjectName.trim(),
        classes: [],
        students: [],
      };

      addSubject(newSubject);
      setSubjects([...subjects, newSubject]);
      setNewSubjectName("");
      setShowAddForm(false);
    }
  };

  const handleDeleteSubject = (id: string) => {
    removeSubject(id);
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const handleViewReports = (id: string) => {
    router.push(`/reports/${id}`);
  };

  if (!hasMounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold h-10 bg-gray-200 rounded w-3/4 animate-pulse"></h1>
            <p className="text-neutral-600 mt-1 h-6 bg-gray-200 rounded w-1/2 animate-pulse"></p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <div className="h-12 w-36 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-12 w-36 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="mb-6 flex items-center">
          <h2 className="text-2xl font-semibold h-8 bg-gray-200 rounded w-1/4 animate-pulse"></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6 h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="card p-6 h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="card p-6 h-32 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 md:mb-0"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-secondary-600">
            Weekly Showcase
          </h1>
          <p className="text-neutral-600 mt-1">
            Manage your subjects and student presentations
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
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="card p-6 mb-8"
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaChalkboardTeacher className="mr-2 text-primary-500" />
              <span>Add New Subject</span>
            </h2>
            <form onSubmit={handleAddSubject}>
              <div className="mb-4">
                <label
                  htmlFor="subject-name"
                  className="block text-sm font-medium text-neutral-700 mb-1"
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
          <h2 className="text-2xl font-semibold">Your Subjects</h2>
          <div className="ml-3 bg-neutral-100 px-3 py-1 rounded-full text-sm text-neutral-600">
            {subjects.length} {subjects.length === 1 ? "subject" : "subjects"}
          </div>
        </div>

        {subjects.length === 0 ? (
          <motion.div
            className="bg-neutral-50 rounded-xl p-10 text-center border border-neutral-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-500 mb-4">
              <FaChalkboardTeacher className="text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-neutral-800 mb-2">
              No subjects added yet
            </h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Add your first subject to get started with managing your classes
              and student presentations.
            </p>
            <motion.button
              className="btn btn-primary shadow-button"
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaPlus className="mr-2" /> Add Your First Subject
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onDelete={handleDeleteSubject}
                onViewReports={handleViewReports}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
