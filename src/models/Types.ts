export interface Student {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  name: string;
  lastSessionTimestamp?: number | null; // Timestamp of the last session completion
}

export interface Subject {
  id: string;
  name: string;
  classes: Class[];
  students: Student[];
}

export interface PresentationSession {
  classId: string;
  presentedStudentIds: string[];
  feedbackGivenStudentIds: string[];
  currentPresenter?: Student;
  currentFeedbackGiver?: Student;
}

// Track student presentation and feedback history
export interface StudentActivity {
  studentId: string;
  classId: string;
  subjectId: string;
  activityType: "presentation" | "feedback";
  timestamp: number;
  className?: string; // Optional for easier display
  subjectName?: string; // Optional for easier display
}

// Collection of all student activities
export interface PresentationHistory {
  activities: StudentActivity[];
}

export enum TimerType {
  PRESENTATION = "presentation",
  STUDENT_FEEDBACK = "studentFeedback",
  LECTURER_FEEDBACK = "lecturerFeedback",
  REFLECTION = "reflection",
}

export interface TimerConfig {
  type: TimerType;
  duration: number; // in seconds
}

export const TIMER_CONFIGURATIONS: Record<TimerType, number> = {
  [TimerType.PRESENTATION]: 180, // 3 minutes in seconds
  [TimerType.STUDENT_FEEDBACK]: 30, // 30 seconds
  [TimerType.LECTURER_FEEDBACK]: 30, // 30 seconds
  [TimerType.REFLECTION]: 45, // 45 seconds
};
