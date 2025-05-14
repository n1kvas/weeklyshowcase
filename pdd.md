Weekly Showcase PDD Canvas

Section
Details
Key Points
Links/Actions

Purpose
Web app named Weekly Showcase for managing tutorial-session presentations, feedback, and marking.
Automates random presenter/peer selection, rubric-based marking, and reporting for Web Design classes.
View Goals

Scope
MVP for Weekly Showcase covers class/session management, random selection, marking, student portal, CSV export.
Excludes iLearn integration. Supports staff/students via iLearn (Blackboard).
View Out of Scope

Stakeholders
Lecturers, tutors, students, Academic IT, Program Director.
Ensures fair selection and streamlined marking in Weekly Showcase.
Contact Stakeholders

Business Goals

1. Automate random selection.2. No duplicate selections.3. Real-time marking.4. Grade export.
   Success Metrics:- 0 duplicates- <15s marking- 99.5% uptime
   Track Metrics

User Roles

- Admin: Manage classes, students, rubrics.- Tutor: Run Weekly Showcase sessions, mark, export.- Student: View schedule/marks.
  Role-based access ensures privacy.
  View User Stories

Key Functional Requirements

- F1: Multi-class support.- F3/F4: Random presenter/peer (no duplicates).- F7/F8: Rubric marking, auto-save.- F11: Timed phases (3 min present, 30s feedback, 45s reflection).
  Core features for Weekly Showcase MVP: class setup, selection, marking, export.
  See All Requirements

Non-Functional Requirements

- Performance: <1s response.- Scalability: 150 students/class.- Accessibility: WCAG 2.1 AA.- Security: TLS 1.3, encrypted data.
  Ensures Weekly Showcase reliability and compliance.
  View Details

Data Model
Tables:- Class(id, name, semester)- Student(id, name, email, class_id)- Session(id, class_id, date)- Selection(id, session_id, student_id, role)- Mark(id, session_id, student_id, scores, tutor_id)
Logical schema for Weekly Showcase PostgreSQL DB.
View Schema

Random Selection Logic

1. Load eligible students (exclude selected).2. Use crypto.getRandomValues().3. Persist selection.4. Update Weekly Showcase UI.
   Ensures fairness, no duplicates.
   Test Logic

UI Overview

- Dashboard: Class list, sessions.- Session View: Random buttons, queue, marking.- Student Portal: Schedule, marks.- Admin Panel: CSV import, rubrics.
  Responsive, WCAG-compliant UI for Weekly Showcase.
  View Wireframes

Session Flow

1. Start Weekly Showcase session.2. Random presenter (1s animation).3. Timers: Present (3 min), Feedback (30s), Peer (30s), Reflection (45s).4. Save marks, repeat.5. Export CSV.
   Visual timers, audible alerts.
   Simulate Flow

Tech Stack

- Front-End: React, TypeScript, Vite.- Back-End: Node.js/Express or FastAPI.- DB: PostgreSQL, Prisma.- Auth: Keycloak/SSO.- Hosting: Docker, AWS Lightsail.
  Modern stack for Weekly Showcase.
  Setup Guide

Risks & Mitigations

- Risk: Duplicate selections.- Mitigation: Unit tests.- Risk: Network outage.- Mitigation: Offline CSV fallback.
  Protects Weekly Showcase reliability.
  Review Risks

Interactive Notes

Navigation: Click links to jump to PDD sections or related tasks (e.g., to-do list, wireframes).
Visualization: Render as a table, Kanban board, or flowchart in a canvas tool.
Next Steps: Use To-Do List for Weekly Showcase development planning.
