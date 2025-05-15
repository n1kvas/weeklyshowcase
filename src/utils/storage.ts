import { Subject, Class, Student, PresentationSession } from "../models/Types";

// Keys for localStorage
const SUBJECTS_KEY = "weeklyShowcase_subjects";
const SESSION_KEY = "weeklyShowcase_session";

// Subjects
export const getSubjects = (): Subject[] => {
  if (typeof window === "undefined") return [];

  const storedData = localStorage.getItem(SUBJECTS_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

export const saveSubjects = (subjects: Subject[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
};

export const addSubject = (subject: Subject): void => {
  const subjects = getSubjects();
  subjects.push(subject);
  saveSubjects(subjects);
};

export const removeSubject = (subjectId: string): void => {
  const subjects = getSubjects().filter((s) => s.id !== subjectId);
  saveSubjects(subjects);
};

export const updateSubject = (updatedSubject: Subject): void => {
  const subjects = getSubjects();
  const index = subjects.findIndex((s) => s.id === updatedSubject.id);
  if (index !== -1) {
    subjects[index] = updatedSubject;
    saveSubjects(subjects);
  }
};

// Classes
export const getClasses = (subjectId: string): Class[] => {
  const subjects = getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  return subject?.classes || [];
};

export const addClass = (subjectId: string, newClass: Class): void => {
  const subjects = getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  if (subject) {
    subject.classes.push(newClass);
    saveSubjects(subjects);
  }
};

export const removeClass = (subjectId: string, classId: string): void => {
  const subjects = getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  if (subject) {
    subject.classes = subject.classes.filter((c) => c.id !== classId);
    saveSubjects(subjects);
  }
};

// Students
export const getStudents = (subjectId: string, classId: string): Student[] => {
  const subjects = getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  const classObj = subject?.classes.find((c) => c.id === classId);
  return classObj?.students || [];
};

export const addStudent = (
  subjectId: string,
  classId: string,
  student: Student
): void => {
  const subjects = getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  const classObj = subject?.classes.find((c) => c.id === classId);
  if (classObj) {
    classObj.students.push(student);
    saveSubjects(subjects);
  }
};

export const removeStudent = (
  subjectId: string,
  classId: string,
  studentId: string
): void => {
  const subjects = getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  const classObj = subject?.classes.find((c) => c.id === classId);
  if (classObj) {
    classObj.students = classObj.students.filter((s) => s.id !== studentId);
    saveSubjects(subjects);
  }
};

// Session Management
export const getSession = (): PresentationSession | null => {
  if (typeof window === "undefined") return null;

  const storedData = localStorage.getItem(SESSION_KEY);
  return storedData ? JSON.parse(storedData) : null;
};

export const saveSession = (session: PresentationSession): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
};
