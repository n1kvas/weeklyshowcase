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
import {
  getSubjects,
  getSession,
  saveSession,
  clearSession,
  updateSubject,
  addStudentActivity,
} from "../../../../../utils/storage";
import { selectRandomStudent } from "../../../../../utils/helpers";

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
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Load data
  useEffect(() => {
    if (hasMounted) {
      const subjects = getSubjects();
      const foundSubject = subjects.find((s) => s.id === currentSubjectId);

      if (foundSubject) {
        setSubject(foundSubject);
        const foundClass = foundSubject.classes.find(
          (c) => c.id === currentClassId
        );

        if (foundClass) {
          setCurrentClass(foundClass);
          const activeSession = getSession();
          if (activeSession && activeSession.classId === currentClassId) {
            setSession(activeSession);
            // Optionally, restore workflowState based on activeSession properties if needed
            // For now, default START is fine, or you might inspect activeSession
            // to jump to, e.g., WorkflowState.PRESENTATION if session.currentPresenter exists.
          } else {
            const newSession: PresentationSession = {
              classId: currentClassId,
              presentedStudentIds: [],
              feedbackGivenStudentIds: [],
            };
            setSession(newSession);
            saveSession(newSession);
          }
        } else {
          router.push(`/subject/${currentSubjectId}`); // Class not found
        }
      } else {
        router.push("/"); // Subject not found
      }
    }
  }, [currentSubjectId, currentClassId, router, hasMounted]); // Added hasMounted

  const startNewPresentation = () => {
    if (!currentClass || !session) return;

    setWorkflowState(WorkflowState.SELECTING_PRESENTER);
  };

  const handlePresenterSelected = () => {
    if (!currentClass || !session || !subject || !subject.students) return;

    const presenter = selectRandomStudent(
      subject.students,
      session.presentedStudentIds
    );

    if (presenter) {
      const updatedSession = {
        ...session,
        currentPresenter: presenter,
        // Don't add to presentedStudentIds yet, only after they complete the presentation
      };
      setSession(updatedSession);
      if (hasMounted) saveSession(updatedSession);
      setWorkflowState(WorkflowState.PRESENTATION);
    } else {
      // No more eligible presenters
      setWorkflowState(WorkflowState.SUMMARY);
    }
  };

  const handlePresentationComplete = () => {
    if (!session || !session.currentPresenter) return;

    setWorkflowState(WorkflowState.SELECTING_FEEDBACK_GIVER);
  };

  const handleFeedbackGiverSelected = () => {
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
      if (hasMounted) saveSession(updatedSession);
      setWorkflowState(WorkflowState.STUDENT_FEEDBACK);
    } else {
      // No more eligible feedback givers, skip to lecturer feedback
      setWorkflowState(WorkflowState.LECTURER_FEEDBACK);
    }
  };

  const handleStudentFeedbackComplete = () => {
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
    if (hasMounted) saveSession(updatedSession);

    setWorkflowState(WorkflowState.LECTURER_FEEDBACK);
  };

  const handleLecturerFeedbackComplete = () => {
    setWorkflowState(WorkflowState.REFLECTION);
  };

  const handleReflectionComplete = () => {
    if (!session || !session.currentPresenter || !subject || !currentClass)
      return;

    // Update last session timestamp for the class
    const updatedClass: Class = {
      ...currentClass,
      lastSessionTimestamp: Date.now(),
    };

    const updatedClasses = subject.classes.map((c) =>
      c.id === currentClass.id ? updatedClass : c
    );

    const updatedSubjectData: Subject = {
      ...subject,
      classes: updatedClasses,
    };
    updateSubject(updatedSubjectData); // Save the subject with the updated class
    setSubject(updatedSubjectData); // Update local subject state
    setCurrentClass(updatedClass); // Update local class state

    const timestamp = Date.now();

    // Record this student's presentation in history
    addStudentActivity({
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
      addStudentActivity({
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
    const updatedSession = {
      ...session,
      presentedStudentIds: [
        ...session.presentedStudentIds,
        session.currentPresenter.id,
      ],
      // Clear current presenter and feedback giver
      currentPresenter: undefined,
      currentFeedbackGiver: undefined,
    };
    setSession(updatedSession);
    if (hasMounted) saveSession(updatedSession);

    setWorkflowState(WorkflowState.START);
  };

  const resetSession = () => {
    if (hasMounted) {
      // Guard localStorage access
      clearSession();
      const newSession: PresentationSession = {
        classId: currentClassId,
        presentedStudentIds: [],
        feedbackGivenStudentIds: [],
      };
      setSession(newSession);
      saveSession(newSession); // saveSession is also guarded by hasMounted check implicitly
    }
    setWorkflowState(WorkflowState.START);
  };

  if (!hasMounted || !subject || !currentClass || !session) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-8 animate-pulse"></div>
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
              <div className="h-12 bg-gray-300 rounded w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const renderContent = () => {
    switch (workflowState) {
      case WorkflowState.START:
        return (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-8">
              {currentClass.name} - {subject.name}
            </h2>

            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                Start Presentations
              </h3>
              <p className="mb-6">
                {session.presentedStudentIds.length > 0
                  ? `${session.presentedStudentIds.length} of ${
                      subject.students ? subject.students.length : 0
                    } students have presented.`
                  : "No students have presented yet."}
              </p>

              {!subject.students || subject.students.length === 0 ? (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-md mb-4">
                  <p className="text-orange-800">
                    No students in this subject. Please add students before
                    starting presentations.
                  </p>
                  <Link
                    href={`/subject/${currentSubjectId}/students`}
                    className="mt-2 inline-block text-blue-500 hover:underline"
                  >
                    Manage Subject Students
                  </Link>
                </div>
              ) : session.presentedStudentIds.length >=
                (subject.students ? subject.students.length : 0) ? (
                <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-4">
                  <p className="text-green-800">All students have presented!</p>
                  <button
                    onClick={resetSession}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Reset Session
                  </button>
                </div>
              ) : (
                <button
                  onClick={startNewPresentation}
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 font-medium text-lg"
                >
                  Next Presentation
                </button>
              )}
            </div>
          </div>
        );

      case WorkflowState.SELECTING_PRESENTER:
        return (
          <DiceRoll onComplete={handlePresenterSelected} duration={2000} />
        );

      case WorkflowState.PRESENTATION:
        return (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Presentation</h2>

            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mb-6">
              <p className="text-lg font-medium text-center mb-4">
                Presenter:
                <span className="block text-2xl font-bold text-blue-600">
                  {session.currentPresenter?.name}
                </span>
              </p>
            </div>

            <Timer
              key={TimerType.PRESENTATION}
              duration={TIMER_CONFIGURATIONS[TimerType.PRESENTATION]}
              timerType={TimerType.PRESENTATION}
              onComplete={handlePresentationComplete}
            />
          </div>
        );

      case WorkflowState.SELECTING_FEEDBACK_GIVER:
        return (
          <DiceRoll onComplete={handleFeedbackGiverSelected} duration={1500} />
        );

      case WorkflowState.STUDENT_FEEDBACK:
        return (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Student Feedback</h2>

            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mb-6">
              <p className="text-lg font-medium text-center mb-4">
                Feedback from:
                <span className="block text-2xl font-bold text-green-600">
                  {session.currentFeedbackGiver?.name}
                </span>
              </p>
            </div>

            <Timer
              key={TimerType.STUDENT_FEEDBACK}
              duration={TIMER_CONFIGURATIONS[TimerType.STUDENT_FEEDBACK]}
              timerType={TimerType.STUDENT_FEEDBACK}
              onComplete={handleStudentFeedbackComplete}
            />
          </div>
        );

      case WorkflowState.LECTURER_FEEDBACK:
        return (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Lecturer Feedback</h2>

            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mb-6">
              <p className="text-lg font-medium text-center mb-4">
                Feedback for:
                <span className="block text-2xl font-bold text-blue-600">
                  {session.currentPresenter?.name}
                </span>
              </p>
            </div>

            <Timer
              key={TimerType.LECTURER_FEEDBACK}
              duration={TIMER_CONFIGURATIONS[TimerType.LECTURER_FEEDBACK]}
              timerType={TimerType.LECTURER_FEEDBACK}
              onComplete={handleLecturerFeedbackComplete}
              autoStart={false}
            />
          </div>
        );

      case WorkflowState.REFLECTION:
        return (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Student Reflection</h2>

            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mb-6">
              <p className="text-lg font-medium text-center mb-4">
                Reflection time for:
                <span className="block text-2xl font-bold text-blue-600">
                  {session.currentPresenter?.name}
                </span>
              </p>
            </div>

            <Timer
              key={TimerType.REFLECTION}
              duration={TIMER_CONFIGURATIONS[TimerType.REFLECTION]}
              timerType={TimerType.REFLECTION}
              onComplete={handleReflectionComplete}
            />
          </div>
        );

      case WorkflowState.SUMMARY:
        return (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-8">Session Complete</h2>

            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">All Done!</h3>
              <p className="mb-6">All eligible students have presented.</p>

              <button
                onClick={resetSession}
                className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 font-medium"
              >
                Start New Session
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Only show back button on the start screen */}
      {workflowState === WorkflowState.START && (
        <div className="mb-6">
          <Link
            href={`/subject/${currentSubjectId}`}
            className="inline-flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaArrowLeft className="mr-2" /> Back to Classes
          </Link>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center py-8">
        {renderContent()}
      </div>
    </main>
  );
}
