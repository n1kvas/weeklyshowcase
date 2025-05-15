import {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "./firebase";
import {
  Subject,
  Class,
  Student,
  PresentationSession,
  StudentActivity,
  PresentationHistory,
} from "../models/Types";
import { UserData } from "./authContext";

// Collection names
const SUBJECTS_COLLECTION = "subjects";
const CLASSES_COLLECTION = "classes";
const STUDENTS_COLLECTION = "students";
const SESSIONS_COLLECTION = "sessions";
const ACTIVITIES_COLLECTION = "activities";
const USERS_COLLECTION = "users";

// Subject operations
export const getSubjects = async (teacherId: string): Promise<Subject[]> => {
  try {
    const subjectsQuery = query(
      collection(db, SUBJECTS_COLLECTION),
      where("teacherId", "==", teacherId)
    );
    const querySnapshot = await getDocs(subjectsQuery);

    const subjects: Subject[] = [];
    querySnapshot.forEach((doc) => {
      subjects.push({ id: doc.id, ...doc.data() } as Subject);
    });

    return subjects;
  } catch (error) {
    console.error("Error getting subjects:", error);
    return [];
  }
};

export const addSubject = async (
  subject: Subject,
  teacherId: string
): Promise<string> => {
  try {
    const subjectRef = doc(collection(db, SUBJECTS_COLLECTION));
    const subjectWithTeacher = {
      ...subject,
      id: subjectRef.id,
      teacherId,
    };

    await setDoc(subjectRef, subjectWithTeacher);
    return subjectRef.id;
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error;
  }
};

export const updateSubject = async (subject: Subject): Promise<void> => {
  try {
    const subjectRef = doc(db, SUBJECTS_COLLECTION, subject.id);
    await updateDoc(subjectRef, { ...subject });
  } catch (error) {
    console.error("Error updating subject:", error);
    throw error;
  }
};

export const removeSubject = async (subjectId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, SUBJECTS_COLLECTION, subjectId));
  } catch (error) {
    console.error("Error removing subject:", error);
    throw error;
  }
};

// Class operations
export const getClasses = async (subjectId: string): Promise<Class[]> => {
  try {
    const classesQuery = query(
      collection(db, CLASSES_COLLECTION),
      where("subjectId", "==", subjectId)
    );
    const querySnapshot = await getDocs(classesQuery);

    const classes: Class[] = [];
    querySnapshot.forEach((doc) => {
      classes.push({ id: doc.id, ...doc.data() } as Class);
    });

    return classes;
  } catch (error) {
    console.error("Error getting classes:", error);
    return [];
  }
};

export const addClass = async (
  subjectId: string,
  newClass: Class
): Promise<string> => {
  try {
    // Create the class document
    const classRef = doc(collection(db, CLASSES_COLLECTION));
    const classId = classRef.id;

    // Update the class with the correct ID
    const classWithId = {
      ...newClass,
      id: classId,
      subjectId,
    };

    // Save the class to the classes collection
    await setDoc(classRef, classWithId);

    // Now update the subject document to include this class in its classes array
    const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);

    // First get the current subject data
    const subjectDoc = await getDoc(subjectRef);

    if (!subjectDoc.exists()) {
      throw new Error("Subject not found");
    }

    // Get current subject data and update the classes array
    const subjectData = subjectDoc.data();
    const currentClasses = subjectData.classes || [];

    // Make sure we don't duplicate the class
    if (!currentClasses.some((c: any) => c.id === classId)) {
      await updateDoc(subjectRef, {
        classes: [...currentClasses, classWithId],
      });
    }

    return classId;
  } catch (error) {
    console.error("Error adding class:", error);
    throw error;
  }
};

export const removeClass = async (classId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, CLASSES_COLLECTION, classId));
  } catch (error) {
    console.error("Error removing class:", error);
    throw error;
  }
};

// Student operations
export const getStudentsBySubject = async (
  subjectId: string
): Promise<Student[]> => {
  try {
    // First get all student IDs assigned to this subject
    const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
    const subjectDoc = await getDoc(subjectRef);

    if (!subjectDoc.exists()) {
      return [];
    }

    const subjectData = subjectDoc.data() as Subject;
    const studentIds = subjectData.students.map((s) => s.id);

    // Get student details from users collection
    const students: Student[] = [];

    for (const studentId of studentIds) {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, studentId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        students.push({
          id: userData.uid,
          name:
            userData.name ||
            userData.displayName ||
            userData.email ||
            "Unknown",
        });
      }
    }

    return students;
  } catch (error) {
    console.error("Error getting students:", error);
    return [];
  }
};

export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const studentsQuery = query(
      collection(db, USERS_COLLECTION),
      where("role", "==", "student")
    );
    const querySnapshot = await getDocs(studentsQuery);

    const students: Student[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as UserData;
      students.push({
        id: doc.id,
        name:
          userData.name || userData.displayName || userData.email || "Unknown",
      });
    });

    return students;
  } catch (error) {
    console.error("Error getting all students:", error);
    return [];
  }
};

export const addStudentToSubject = async (
  subjectId: string,
  student: Student
): Promise<void> => {
  try {
    const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
    const subjectDoc = await getDoc(subjectRef);

    if (!subjectDoc.exists()) {
      throw new Error("Subject not found");
    }

    const subjectData = subjectDoc.data() as Subject;
    const currentStudents = subjectData.students || [];

    // Check if student already exists
    if (!currentStudents.some((s) => s.id === student.id)) {
      currentStudents.push(student);
    }

    await updateDoc(subjectRef, { students: currentStudents });
  } catch (error) {
    console.error("Error adding student to subject:", error);
    throw error;
  }
};

export const removeStudentFromSubject = async (
  subjectId: string,
  studentId: string
): Promise<void> => {
  try {
    const subjectRef = doc(db, SUBJECTS_COLLECTION, subjectId);
    const subjectDoc = await getDoc(subjectRef);

    if (!subjectDoc.exists()) {
      throw new Error("Subject not found");
    }

    const subjectData = subjectDoc.data() as Subject;
    const updatedStudents = (subjectData.students || []).filter(
      (s) => s.id !== studentId
    );

    await updateDoc(subjectRef, { students: updatedStudents });
  } catch (error) {
    console.error("Error removing student from subject:", error);
    throw error;
  }
};

// Session Management
export const saveSession = async (
  session: PresentationSession
): Promise<void> => {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, session.classId);

    // Sanitize the session object by removing any fields with undefined values
    // as Firestore doesn't accept undefined values
    const sanitizedSession = Object.entries(session).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    await setDoc(sessionRef, sanitizedSession);
  } catch (error) {
    console.error("Error saving session:", error);
    throw error;
  }
};

export const getSession = async (
  classId: string
): Promise<PresentationSession | null> => {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, classId);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists()) {
      return sessionDoc.data() as PresentationSession;
    }

    return null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

export const clearSession = async (classId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, SESSIONS_COLLECTION, classId));
  } catch (error) {
    console.error("Error clearing session:", error);
    throw error;
  }
};

// History Management
export const addStudentActivity = async (
  activity: StudentActivity
): Promise<void> => {
  try {
    const activityRef = doc(collection(db, ACTIVITIES_COLLECTION));
    await setDoc(activityRef, { ...activity, id: activityRef.id });
  } catch (error) {
    console.error("Error adding activity:", error);
    throw error;
  }
};

export const getStudentActivities = async (
  studentId?: string,
  subjectId?: string,
  activityType?: "presentation" | "feedback"
): Promise<StudentActivity[]> => {
  try {
    let activitiesQuery = collection(db, ACTIVITIES_COLLECTION);
    let constraints = [];

    if (studentId) {
      constraints.push(where("studentId", "==", studentId));
    }

    if (subjectId) {
      constraints.push(where("subjectId", "==", subjectId));
    }

    if (activityType) {
      constraints.push(where("activityType", "==", activityType));
    }

    // Apply the constraints
    const finalQuery =
      constraints.length > 0
        ? query(activitiesQuery, ...constraints)
        : query(activitiesQuery);

    const querySnapshot = await getDocs(finalQuery);

    const activities: StudentActivity[] = [];
    querySnapshot.forEach((doc) => {
      activities.push(doc.data() as StudentActivity);
    });

    return activities;
  } catch (error) {
    console.error("Error getting activities:", error);
    return [];
  }
};
