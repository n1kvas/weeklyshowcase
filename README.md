# Weekly Showcase

A web application for managing student presentations with timed feedback sessions.

## Features

- Create subjects and classes
- Manage students in each class
- Randomly select students for presentations
- Timed presentation session (3 minutes)
- Randomly select students for peer feedback
- Timed student feedback session (30 seconds)
- Timed lecturer feedback session (30 seconds)
- Timed reflection period (45 seconds)
- Tracks which students have presented and given feedback
- User authentication with Firebase (teacher/student roles)
- Role-based access control
- Cloud data storage with Firestore

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/weeklyshowcase.git
cd weeklyshowcase
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Set up Firebase

   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication with Email/Password provider
   - Create a Firestore database
   - Get your Firebase configuration from Project Settings > General > Your apps
   - Copy the `env.sample` file to `.env.local` and fill in your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. Deploy Firestore security rules

   - Copy the contents of `firestore.rules` to your Firebase console under Firestore > Rules
   - Or deploy using the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

5. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is built with Next.js and can be easily deployed to Vercel, Hostinger, or other hosting providers.

1. Build the application

```bash
npm run build
# or
yarn build
```

2. Start the production server

```bash
npm run start
# or
yarn start
```

## Usage

1. Register as a teacher or student
2. Teachers can:
   - Create and manage subjects
   - Add classes to subjects
   - Enroll students in subjects
   - Manage presentation sessions
3. Students can:
   - View subjects they're enrolled in
   - Participate in presentation sessions
   - Give and receive feedback

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Firebase Authentication
- Firestore Database
- Firebase Security Rules

## Contact

For any questions or support, please create an issue in the GitHub repository.
