export interface Student {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  name: string;
  students: Student[];
}

export interface Subject {
  id: string;
  name: string;
  classes: Class[];
}

export interface PresentationSession {
  classId: string;
  presentedStudentIds: string[];
  feedbackGivenStudentIds: string[];
  currentPresenter?: Student;
  currentFeedbackGiver?: Student;
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
