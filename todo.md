To-Do List for Tutorial Session Management Web Application

1. Project Planning

Form project team (developers, UI/UX designer, QA, Academic IT liaison).
Schedule kickoff meeting with stakeholders (lecturers, tutors, Program Director).
Confirm tech stack: React + TypeScript + Vite, Node.js/Express or FastAPI, PostgreSQL, Keycloak/SSO.
Set up project management tool (e.g., Jira, Trello) and repository (GitHub).
Draft project timeline targeting MVP delivery, accounting for academic calendar.
Identify university PaaS or AWS Lightsail hosting requirements and secure approval.

2. Requirements Refinement

Review PDD with Academic IT Support to confirm SSO and infrastructure compatibility.
Prioritize functional requirements (F1–F11) for MVP; defer non-critical features (e.g., XLSX/JSON export).
Define edge cases for random selection (e.g., absent students, mid-session roster changes).
Document compliance requirements (e.g., GDPR, FERPA) for student data handling.
Create wireframes/mockups for Dashboard, Session View, Student Portal, and Admin Panel.

3. Development Setup

Set up development environment with Docker containers for front-end, back-end, and database.
Configure CI/CD pipeline using GitHub Actions for automated builds and testing.
Initialize PostgreSQL database with schema (Class, Student, Session, Selection, Mark tables).
Set up Prisma ORM for database interactions.
Configure authentication (Keycloak or university SSO with SAML; fallback email/password with MFA).

4. Core Feature Development

Class & Session Management (F1, F2, F15):
Build Admin Panel for creating classes and sessions.
Implement CSV import for student rosters.
Develop session start/close functionality with lock on marks after closing.

Random Selection Logic (F3–F6, F13):
Implement random presenter and peer reviewer selection using crypto.getRandomValues() or SecureRandom.
Ensure no duplicates in a session and disable buttons when students are exhausted.
Add manual override option for tutors.

Marking System (F7, F8, F10):
Create rubric-based marking form (Presentation, Peer Feedback, Reflection; 0–5 scale).
Implement auto-save for marks with timestamp and tutor ID.
Build student portal for viewing own marks and feedback.

Session Flow with Timers (F11):
Develop countdown timers for Presentation (3 min), Tutor Feedback (30s), Peer Feedback (30s), Reflection (45s).
Add visual progress ring and audible alert for phase transitions.
Implement rolling animation (1s) for random selections.

Reporting (F9, F16):
Build CSV export for session/class reports.
Create selection log with timestamps and tutor IDs.

5. User Interface Development

Develop Dashboard with class list and upcoming sessions.
Build Session View with random buttons, queue display, and marking form.
Create Student Portal for schedule and marks visibility.
Ensure UI meets WCAG 2.1 AA accessibility standards.
Test responsive design for desktop and mobile browsers.

6. Testing

Write unit tests for random selection algorithm to prevent duplicates.
Perform integration tests for database operations (e.g., mark saving, selection logging).
Conduct load testing for 150 students per class and concurrent sessions.
Test UI/UX with tutors and students for usability feedback.
Validate security (TLS 1.3, role-based access, encrypted data at rest).

7. Deployment

Set up blue-green deployment to ensure zero downtime during class hours.
Configure nightly backups and redundant data storage.
Deploy MVP to university PaaS or AWS Lightsail.
Test offline CSV fallback for network outage scenarios.

8. Post-Deployment

Train tutors and administrators on app usage.
Monitor uptime (target: 99.5%) and marking time (<15s per student).
Collect feedback from initial sessions to identify bugs or UX improvements.
Plan post-MVP features (e.g., iLearn API integration, XLSX/JSON export).

Notes

Prioritize tasks for MVP delivery: focus on F1–F8, F10–F11, basic CSV export, and core UI.
Regularly sync with Academic IT Support to ensure compliance with university policies.
Use iterative development with bi-weekly sprints to incorporate stakeholder feedback.
