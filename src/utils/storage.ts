import {
  Subject,
  Class,
  Student,
  PresentationSession,
  StudentActivity,
  PresentationHistory,
} from "../models/Types";

// Keys for localStorage
const SUBJECTS_KEY = "weeklyShowcase_subjects";
const SESSION_KEY = "weeklyShowcase_session";
const HISTORY_KEY = "weeklyShowcase_history";

// Subjects
export const getSubjects = (): Subject[] => {
  if (typeof window === "undefined") return [];

  const storedData = localStorage.getItem(SUBJECTS_KEY);
  const subjects: Subject[] = storedData ? JSON.parse(storedData) : [];
  // Ensure all subjects have a .students array for safety
  return subjects.map((s: Subject) => ({ ...s, students: s.students || [] }));
};

export const saveSubjects = (subjects: Subject[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
};

export const addSubject = (subject: Subject): void => {
  const subjects = getSubjects();
  // Ensure new subjects have a students array
  const subjectWithStudents = {
    ...subject,
    students: subject.students || [],
  };
  subjects.push(subjectWithStudents);
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
    // Classes no longer have their own students array
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

// Students (now managed at Subject level)
export const getStudents = (subjectId: string): Student[] => {
  const subject = getSubjects().find((s) => s.id === subjectId);
  return subject?.students || [];
};

export const addStudentToSubject = (
  subjectId: string,
  student: Student
): void => {
  const subjects = getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  if (subject) {
    if (!subject.students) {
      subject.students = [];
    }
    subject.students.push(student);
    saveSubjects(subjects);
  }
};

export const removeStudentFromSubject = (
  subjectId: string,
  studentId: string
): void => {
  const subjects = getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  if (subject && subject.students) {
    subject.students = subject.students.filter((s) => s.id !== studentId);
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

// History Management
export const getHistory = (): PresentationHistory => {
  if (typeof window === "undefined") return { activities: [] };

  const storedData = localStorage.getItem(HISTORY_KEY);
  return storedData ? JSON.parse(storedData) : { activities: [] };
};

export const saveHistory = (history: PresentationHistory): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const addStudentActivity = (activity: StudentActivity): void => {
  const history = getHistory();
  history.activities.push(activity);
  saveHistory(history);
};

export const getStudentActivities = (
  studentId?: string,
  subjectId?: string,
  activityType?: "presentation" | "feedback"
): StudentActivity[] => {
  const history = getHistory();

  return history.activities.filter((activity) => {
    let match = true;
    if (studentId !== undefined)
      match = match && activity.studentId === studentId;
    if (subjectId !== undefined)
      match = match && activity.subjectId === subjectId;
    if (activityType !== undefined)
      match = match && activity.activityType === activityType;
    return match;
  });
};
