Build a web application for managing tutorial-session presentations, tutor/peer feedback, and on-the-fly marking, as outlined in a Product Design Document (PDD). The app automates random selection of presenters and peer reviewers, ensures no duplicates in a session, supports rubric-based marking, and provides CSV export. Below are the key details and requirements.

**Project Overview**:

- **Purpose**: Manage tutorial sessions for Web Design classes, supporting random presenter/peer selection, real-time marking, and reporting.
- **Users**: Administrators (manage classes), Tutors (run sessions, mark), Students (view schedules/marks).
- **MVP Scope**: Class/session management, random selection, rubric marking, student portal, CSV export. Excludes iLearn integration.

**Tech Stack**:

- **Front-End**: React, TypeScript, Vite, Tailwind CSS.
- **Back-End**: Node.js + Express or Python FastAPI.
- **Database**: PostgreSQL with Prisma ORM.
- **Auth**: Keycloak or SAML-based SSO (fallback: email/password with MFA).
- **Hosting**: Dockerized, deployable on AWS Lightsail or university PaaS.
- **CI/CD**: GitHub Actions.

**Functional Requirements**:

1. Create and manage classes with student lists (CSV import, add/remove students).
2. Random presenter/peer selection (no duplicates in a session, using `crypto.getRandomValues()` or `SecureRandom`).
3. Manual override for selections.
4. Rubric-based marking (Presentation, Peer Feedback, Reflection; 0–5 scale) with auto-save.
5. Timed session phases: Presentation (3 min), Tutor Feedback (30s), Peer Feedback (30s), Reflection (45s) with countdown timers, progress ring, and audible alerts.
6. Student portal for viewing own marks and schedules.
7. CSV export for session/class reports with selection logs.

**Non-Functional Requirements**:

- **Performance**: <1s response time for selections and saves.
- **Scalability**: Support classes of 150 students.
- **Accessibility**: WCAG 2.1 AA.
- **Security**: TLS 1.3, role-based access, encrypted data at rest.
- **Reliability**: Redundant storage, nightly backups, 99.5% uptime.

**Data Model**:

- Tables: `Class(id, name, semester)`, `Student(id, name, email, class_id)`, `Session(id, class_id, date)`, `Selection(id, session_id, student_id, role)`, `Mark(id, session_id, student_id, presenter_score, peer_score, reflection_score, tutor_id)`.

**UI Components**:

- **Dashboard**: List classes and upcoming sessions.
- **Session View**: Random buttons, queue, marking form, timers.
- **Student Portal**: Schedule and marks view (own data only).
- **Admin Panel**: Class management, CSV import, rubric setup.

**Session Flow**:

1. Tutor starts session, clicks “Random Presenter” (1s rolling animation, shows student name).
2. Presentation phase (3 min timer), followed by Tutor Feedback (30s), Peer Feedback (30s, random peer), Reflection (45s).
3. Save marks, repeat until students exhausted, then export CSV.

**Deliverables**:

- Complete source code in a GitHub repository.
- Dockerized setup for local development and deployment.
- Unit tests for random selection logic (no duplicates).
- Responsive UI with Tailwind CSS, meeting WCAG 2.1 AA.
- Documentation for setup, usage, and API endpoints.
- Offline CSV fallback template for network outages.

**Constraints**:

- Prioritize MVP features (class management, random selection, marking, CSV export).
- Handle edge cases (e.g., absent students, session resets).
- Ensure compatibility with university SSO or provide fallback auth.
- Avoid iLearn API integration for MVP.

**Success Metrics**:

- Zero duplicate selections per session.
- Marking time <15s per student.
- Uptime 99.5% during class hours.

**Steps**:

1. Set up project with React, TypeScript, Vite, and Tailwind CSS.
2. Initialize PostgreSQL with Prisma and define schema.
3. Implement back-end API (Express/FastAPI) for class, session, and selection management.
4. Build random selection logic with `crypto.getRandomValues()`.
5. Create UI components for Dashboard, Session View, Student Portal, Admin Panel.
6. Add timers and animations for session flow.
7. Implement auth (Keycloak/SSO or fallback).
8. Write tests and document setup/deployment.
9. Containerize with Docker and configure CI/CD.

Please generate the full application code, including front-end, back-end, database setup, and tests. Provide a single-page HTML demo if possible for quick testing. Ensure all code is modular, follows best practices, and includes comments for clarity.
