"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import {
  Subject,
  Class,
  Student,
  PresentationSession,
  TimerType,
  TIMER_CONFIGURATIONS,
} from "../../../../../models/Types";
import DiceRoll from "../../../../../components/DiceRoll";
import Timer from "../../../../../components/Timer";
import * as firestoreService from "../../../../../utils/firestoreService";
import { selectRandomStudent } from "../../../../../utils/helpers";
import { useAuth } from "../../../../../utils/authContext";

// Presentation workflow states
enum WorkflowState {
  START = "start",
  SELECTING_PRESENTER = "selecting_presenter",
  PRESENTATION = "presentation",
  SELECTING_FEEDBACK_GIVER = "selecting_feedback_giver",
  STUDENT_FEEDBACK = "student_feedback",
  LECTURER_FEEDBACK = "lecturer_feedback",
  REFLECTION = "reflection",
  SUMMARY = "summary",
}

export default function ClassPage({
  params,
}: {
  params: { subjectId: string; classId: string };
}) {
  const unwrappedParams = React.use(params as any) as {
    subjectId: string;
    classId: string;
  };
  const currentSubjectId = unwrappedParams.subjectId;
  const currentClassId = unwrappedParams.classId;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [session, setSession] = useState<PresentationSession | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState>(
    WorkflowState.START
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get subject data from Firestore
        const userSubjects = await firestoreService.getSubjects(
          user?.uid || ""
        );
        const foundSubject = userSubjects.find(
          (s) => s.id === currentSubjectId
        );

        if (foundSubject) {
          setSubject(foundSubject);

          // Get classes for this subject from Firestore
          const subjectClasses = await firestoreService.getClasses(
            currentSubjectId
          );
          const foundClass = subjectClasses.find(
            (c) => c.id === currentClassId
          );

          if (foundClass) {
            setCurrentClass(foundClass);

            // Check for active session
            const activeSession = await firestoreService.getSession(
              currentClassId
            );
            if (activeSession) {
              setSession(activeSession);
            } else {
              // Create new session
              const newSession: PresentationSession = {
                classId: currentClassId,
                presentedStudentIds: [],
                feedbackGivenStudentIds: [],
              };
              setSession(newSession);
              await firestoreService.saveSession(newSession);
            }
          } else {
            router.push(`/subject/${currentSubjectId}`); // Class not found
          }
        } else {
          router.push("/"); // Subject not found
        }
      } catch (error) {
        console.error("Error loading class data:", error);
        router.push(`/subject/${currentSubjectId}`);
      } finally {
        setLoading(false);
      }
    };

    if (currentSubjectId && currentClassId && user) {
      loadData();
    }
  }, [currentSubjectId, currentClassId, router, user]);

  const startNewPresentation = () => {
    if (!currentClass || !session) return;
    setWorkflowState(WorkflowState.SELECTING_PRESENTER);
  };

  const handlePresenterSelected = async () => {
    if (!currentClass || !session || !subject || !subject.students) return;

    // Check if all students have presented
    if (session.presentedStudentIds.length >= subject.students.length) {
      // All students have presented, go to summary page
      setWorkflowState(WorkflowState.SUMMARY);
      return;
    }

    const presenter = selectRandomStudent(
      subject.students,
      session.presentedStudentIds
    );

    if (presenter) {
      const updatedSession = {
        ...session,
        currentPresenter: presenter,
      };
      setSession(updatedSession);
      try {
        await firestoreService.saveSession(updatedSession);
        setWorkflowState(WorkflowState.PRESENTATION);
      } catch (error) {
        console.error("Error saving session:", error);
      }
    } else {
      // No more eligible presenters
      setWorkflowState(WorkflowState.SUMMARY);
    }
  };

  const handlePresentationComplete = () => {
    if (!session || !session.currentPresenter) return;
    setWorkflowState(WorkflowState.SELECTING_FEEDBACK_GIVER);
  };

  const handleFeedbackGiverSelected = async () => {
    if (
      !currentClass ||
      !session ||
      !session.currentPresenter ||
      !subject ||
      !subject.students
    )
      return;

    const excludeIds = [
      ...session.feedbackGivenStudentIds,
      session.currentPresenter.id,
    ];

    const feedbackGiver = selectRandomStudent(subject.students, excludeIds);

    if (feedbackGiver) {
      const updatedSession = {
        ...session,
        currentFeedbackGiver: feedbackGiver,
      };
      setSession(updatedSession);
      try {
        await firestoreService.saveSession(updatedSession);
        setWorkflowState(WorkflowState.STUDENT_FEEDBACK);
      } catch (error) {
        console.error("Error saving session:", error);
      }
    } else {
      // No more eligible feedback givers, skip to lecturer feedback
      setWorkflowState(WorkflowState.LECTURER_FEEDBACK);
    }
  };

  const handleStudentFeedbackComplete = async () => {
    if (!session || !session.currentFeedbackGiver) return;

    // Mark this student as having given feedback
    const updatedSession = {
      ...session,
      feedbackGivenStudentIds: [
        ...session.feedbackGivenStudentIds,
        session.currentFeedbackGiver.id,
      ],
    };
    setSession(updatedSession);
    try {
      await firestoreService.saveSession(updatedSession);
      setWorkflowState(WorkflowState.LECTURER_FEEDBACK);
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const handleLecturerFeedbackComplete = () => {
    setWorkflowState(WorkflowState.REFLECTION);
  };

  const handleReflectionComplete = async () => {
    if (!session || !session.currentPresenter || !subject || !currentClass)
      return;

    try {
      console.log("Reflection completed. Processing...");

      // Update last session timestamp for the class
      const updatedClass: Class = {
        ...currentClass,
        lastSessionTimestamp: Date.now(),
      };

      const timestamp = Date.now();

      // Record this student's presentation in history
      await firestoreService.addStudentActivity({
        studentId: session.currentPresenter.id,
        classId: currentClass.id,
        subjectId: subject.id,
        activityType: "presentation",
        timestamp,
        className: currentClass.name,
        subjectName: subject.name,
      });

      // Record the feedback giver's activity if there was one
      if (session.currentFeedbackGiver) {
        await firestoreService.addStudentActivity({
          studentId: session.currentFeedbackGiver.id,
          classId: currentClass.id,
          subjectId: subject.id,
          activityType: "feedback",
          timestamp,
          className: currentClass.name,
          subjectName: subject.name,
        });
      }

      // Mark this student as having presented
      // Create a new session object without undefined values (Firestore doesn't accept undefined)
      const { currentPresenter, currentFeedbackGiver, ...sessionBase } =
        session;
      const updatedSession = {
        ...sessionBase,
        presentedStudentIds: [
          ...session.presentedStudentIds,
          session.currentPresenter.id,
        ],
        // We'll omit these fields entirely rather than setting them to undefined
        // Firestore doesn't accept undefined values
      };

      console.log("Saving updated session:", updatedSession);

      // Save session first
      await firestoreService.saveSession(updatedSession);

      // Then update local state
      setSession(updatedSession);

      // Add a small delay before transitioning to allow the "Completed" message to be visible
      setTimeout(() => {
        // Check if all students have presented
        if (
          subject.students &&
          updatedSession.presentedStudentIds.length >= subject.students.length
        ) {
          console.log("All students have presented. Showing summary.");
          setWorkflowState(WorkflowState.SUMMARY);
        } else {
          console.log(
            "Not all students have presented. Returning to start screen."
          );
          setWorkflowState(WorkflowState.START);
        }
      }, 1500); // 1.5 second delay
    } catch (error) {
      console.error("Error completing reflection:", error);
    }
  };

  const resetSession = async () => {
    try {
      // Clear the session in Firestore
      await firestoreService.clearSession(currentClassId);

      // Create a new session
      const newSession: PresentationSession = {
        classId: currentClassId,
        presentedStudentIds: [],
        feedbackGivenStudentIds: [],
      };
      setSession(newSession);
      await firestoreService.saveSession(newSession);
      setWorkflowState(WorkflowState.START);
    } catch (error) {
      console.error("Error resetting session:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
        </div>
      </div>
    );
  }

  if (!currentClass || !subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="dark:text-white">Class or Subject not found.</p>
        <Link
          href={`/subject/${currentSubjectId}`}
          className="text-blue-500 hover:text-blue-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Back to Subject
        </Link>
      </div>
    );
  }

  const renderContent = () => {
    switch (workflowState) {
      case WorkflowState.START:
        return (
          <div className="text-center bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">
              {currentClass.name} - {subject.name}
            </h2>
            {session && session.presentedStudentIds.length > 0 && (
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                {session.presentedStudentIds.length} of{" "}
                {subject.students ? subject.students.length : 0} students have
                presented.
              </p>
            )}
            {!subject.students || subject.students.length === 0 ? (
              <div className="bg-orange-100 dark:bg-orange-900 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 p-4 rounded-md mb-4">
                <p>
                  No students in this subject. Please add students before
                  starting presentations.
                </p>
                <Link
                  href={`/subject/${currentSubjectId}/students`}
                  className="mt-2 inline-block text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Manage Subject Students
                </Link>
              </div>
            ) : session &&
              session.presentedStudentIds.length >= subject.students.length ? (
              <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 p-4 rounded-md mb-4">
                <p>All students have presented!</p>
                <button
                  onClick={resetSession}
                  className="btn btn-secondary mt-2"
                >
                  Reset Session
                </button>
              </div>
            ) : (
              <button
                onClick={startNewPresentation}
                className="btn btn-primary btn-lg text-lg px-8 py-3"
              >
                Start/Next Presentation
              </button>
            )}
            {session &&
              session.presentedStudentIds.length > 0 &&
              subject.students &&
              session.presentedStudentIds.length < subject.students.length && (
                <button
                  onClick={() => setWorkflowState(WorkflowState.SUMMARY)}
                  className="btn btn-secondary ml-4 mt-4 sm:mt-0"
                >
                  View Session Summary
                </button>
              )}
          </div>
        );
      case WorkflowState.SELECTING_PRESENTER:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Selecting Presenter...
            </h2>
            <DiceRoll onComplete={handlePresenterSelected} duration={2000} />
          </div>
        );
      case WorkflowState.PRESENTATION:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Presentation Time
            </h2>
            {session?.currentPresenter && (
              <p className="text-xl mb-4 dark:text-neutral-300">
                Presenter:{" "}
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {session.currentPresenter.name}
                </span>
              </p>
            )}
            <Timer
              key={TimerType.PRESENTATION}
              duration={TIMER_CONFIGURATIONS[TimerType.PRESENTATION]}
              timerType={TimerType.PRESENTATION}
              onComplete={handlePresentationComplete}
              autoStart={false}
            />
          </div>
        );
      case WorkflowState.SELECTING_FEEDBACK_GIVER:
        // Check if there are any eligible feedback givers
        const eligibleFeedbackGivers = subject.students.filter(
          (s) =>
            s.id !== session?.currentPresenter?.id &&
            !session?.feedbackGivenStudentIds.includes(s.id)
        );
        if (eligibleFeedbackGivers.length === 0) {
          // Skip to lecturer feedback if no one is available
          // Need to ensure session is updated correctly before moving state
          setTimeout(() => handleStudentFeedbackComplete(), 0);
          return (
            <div className="text-center dark:text-white">
              <h2 className="text-2xl font-bold mb-4">
                Selecting Feedback Giver...
              </h2>
              <p>
                No eligible students to give feedback. Skipping to Lecturer
                Feedback.
              </p>
            </div>
          );
        }
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Who will give feedback to {session?.currentPresenter?.name}?
            </h2>
            <DiceRoll
              onComplete={handleFeedbackGiverSelected}
              duration={1500}
            />
            <button
              onClick={async () => {
                // This button skips student feedback and goes to lecturer feedback
                await handleStudentFeedbackComplete();
              }}
              className="btn btn-secondary mt-4"
            >
              Skip to Lecturer Feedback
            </button>
          </div>
        );
      case WorkflowState.STUDENT_FEEDBACK:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Feedback from {session?.currentFeedbackGiver?.name}
            </h2>
            {session?.currentFeedbackGiver && (
              <p className="text-xl mb-4 dark:text-neutral-300">
                Giving feedback:{" "}
                <span className="font-semibold text-success-600 dark:text-success-400">
                  {session.currentFeedbackGiver.name}
                </span>
              </p>
            )}
            <Timer
              key={TimerType.STUDENT_FEEDBACK}
              duration={TIMER_CONFIGURATIONS[TimerType.STUDENT_FEEDBACK]}
              timerType={TimerType.STUDENT_FEEDBACK}
              onComplete={handleStudentFeedbackComplete}
              autoStart={false}
            />
          </div>
        );
      case WorkflowState.LECTURER_FEEDBACK:
        console.log("RENDERING LECTURER_FEEDBACK state");
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Lecturer Feedback
            </h2>
            {session?.currentPresenter && (
              <p className="text-xl mb-4 dark:text-neutral-300">
                For:{" "}
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {session.currentPresenter.name}
                </span>
              </p>
            )}
            <Timer
              key={TimerType.LECTURER_FEEDBACK}
              duration={TIMER_CONFIGURATIONS[TimerType.LECTURER_FEEDBACK]}
              timerType={TimerType.LECTURER_FEEDBACK}
              onComplete={handleLecturerFeedbackComplete}
            />
          </div>
        );
      case WorkflowState.REFLECTION:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Reflection for {session?.currentPresenter?.name}
            </h2>
            {session?.currentPresenter && (
              <p className="text-xl mb-4 dark:text-neutral-300">
                Reflecting:{" "}
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {session.currentPresenter.name}
                </span>
              </p>
            )}
            <Timer
              key={TimerType.REFLECTION}
              duration={TIMER_CONFIGURATIONS[TimerType.REFLECTION]}
              timerType={TimerType.REFLECTION}
              onComplete={handleReflectionComplete}
              autoStart={false}
            />
          </div>
        );
      case WorkflowState.SUMMARY:
        return (
          <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
              Session Summary
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold dark:text-neutral-100">
                Students Presented:
              </h3>
              {session?.presentedStudentIds.length === 0 ? (
                <p className="text-neutral-600 dark:text-neutral-400">
                  No students have presented yet.
                </p>
              ) : (
                <ul className="list-disc list-inside text-neutral-700 dark:text-neutral-300">
                  {session?.presentedStudentIds.map((studentId) => {
                    const student = subject.students.find(
                      (s) => s.id === studentId
                    );
                    return (
                      <li key={studentId}>{student?.name || "Unknown"}</li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="flex justify-center mt-6 space-x-4">
              <button onClick={resetSession} className="btn btn-danger">
                Reset Session & Start Over
              </button>
              <button
                onClick={startNewPresentation}
                className="btn btn-primary"
                disabled={
                  session?.presentedStudentIds.length ===
                  subject.students.length
                }
              >
                {session?.presentedStudentIds.length === subject.students.length
                  ? "All Students Presented"
                  : "Continue with Next Presentation"}
              </button>
            </div>
          </div>
        );

      default:
        return <p className="dark:text-white">Invalid workflow state.</p>;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/subject/${currentSubjectId}`}
          className="inline-flex items-center text-blue-500 hover:text-blue-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-150"
        >
          <FaArrowLeft className="mr-2" /> Back to {subject?.name || "Subject"}
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight dark:text-white">
          {currentClass.name}
        </h1>
        <p className="text-xl text-neutral-500 dark:text-neutral-400 mt-1">
          {subject.name} - Presentation Session
        </p>
      </div>

      <div className="max-w-2xl mx-auto">{renderContent()}</div>
    </main>
  );
}
