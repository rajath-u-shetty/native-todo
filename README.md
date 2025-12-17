# React Native To-Do App

A to-do list application built with React Native, TypeScript, and Firebase.

## Features

- User authentication (register & login)
- Create, read, update, and delete tasks
- Task properties: title, description, date-time, deadline, priority
- Real-time data sync with Firebase Firestore
- Task filtering (All, Active, Completed)
- Task sorting (by Priority, by Deadline)
- Search tasks by title or description

## Requirements

- Node.js v14+
- npm or yarn
- Firebase project (create at [Firebase Console](https://console.firebase.google.com))

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Create `src/services/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 3. Create Firestore Composite Index

Firebase requires a composite index for task queries:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project and go to Firestore Database → Indexes
3. Create a new composite index:
   - Collection: `tasks`
   - First field: `userId` (Ascending)
   - Second field: `createdAt` (Descending)
4. Wait for index to build (2-5 minutes)

### 4. Start Development Server
```bash
npm start
```

Press `w` for web, `a` for Android, or `i` for iOS.

## Project Structure

```
src/
├── components/
│   ├── Input.tsx
│   ├── Button.tsx
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   └── PriorityBadge.tsx
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   └── AddTaskScreen.tsx
├── services/
│   ├── firebase.ts
│   └── taskService.ts
├── contexts/
│   └── AuthContext.tsx
├── navigation/
│   └── AppNavigator.tsx
├── utils/
│   ├── helpers.ts
│   └── sortingAlgorithm.ts
└── types/
    └── index.ts
```

## Tech Stack

- React Native 0.81
- TypeScript 5.9
- Firebase (Auth & Firestore)
- React Navigation 7.1
- date-fns 4.1