# ReferralFlow - Clinical Referral Management System

This is a comprehensive clinical referral management application built in Firebase Studio using Next.js. It provides a robust platform for healthcare professionals to create, track, and manage patient referrals efficiently and securely.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: ShadCN UI Components, Tailwind CSS
- **Generative AI**: Google Gemini via Firebase Genkit
- **Styling**: Theming support with CSS variables for light/dark modes and color palettes.
- **State Management**: React Hooks & Context API

## Core Features

### 1. Dashboard
- **Location**: `/dashboard`
- A centralized overview of referral activity.
- Displays key metrics like "Ongoing Referrals," "Completed This Month," and items requiring action.
- Includes feeds for recent updates and critical action items.

### 2. Referral Management
- **Location**: `/referrals`
- View a comprehensive list of all patient referrals.
- **Filtering & Sorting**: Dynamic filtering by status (All, Drafts, Pending, In-Progress) and by department. Sortable columns for easy data analysis.
- **AI-Powered Creation**: The "New Referral" dialog uses a Genkit flow to intelligently generate confirmation messages and notification summaries upon submission.
- **Detailed Views**: Click on any referral to open a detailed modal with full clinical information, patient data, and editing capabilities.
- **Audit History**: Access a complete, timestamped history for any referral via its detail view, showing all actions and changes.

### 3. Patient Records
- **Location**: `/patients`
- Search and view a list of all patients in the system.
- Clicking a patient opens a detailed modal showing their demographic information and a complete history of their referrals.
- **Audit History**: Access a full audit log for any patient to see when their record has been viewed or modified.

### 4. User Management (Admin/Manager)
- **Location**: `/users`
- A dedicated section for administrators to manage user accounts.
- Features include adding new users, editing profiles, assigning roles (Admin, Manager, Clinical, Clerical), managing permissions, and setting user status (Active, Inactive, Pending).
- Role-based access controls are simulated, with UI elements intended for specific roles.

### 5. Location & Settings Management (Admin)
- **Location**: `/locations`
- Manage the organizational hierarchy of facilities and departments.
- **Inherited Settings**: A settings simulator demonstrates how rules (e.g., referral deadlines) are inherited from parent locations and can be overridden at specific levels.
- Create, view, and edit locations and their associated rules.

### 6. Settings & Security
- **Location**: `/settings`
- **User Profile**: Users can update their personal information.
- **Appearance**: Customize the application's appearance with light/dark mode and different color themes.
- **Security Management**: View active sessions, manage Multi-Factor Authentication (MFA), and (for admins) enforce global security policies.

### 7. Notifications
- **Location**: Accessible via the user account menu in the sidebar.
- A dedicated log of all system-generated notifications (e.g., email sent, status updates).
- A red dot indicator on the user avatar in the sidebar signals new, unread notifications.

## Production Roadmap

This section outlines the key phases to transition this prototype into a production-ready application.

### Phase 1: Foundational Backend & Authentication

1.  **Database Integration**: The first and most critical step is to replace the mock data (`src/lib/mock-data.ts`) with a real database.
    *   **Action**: Implement services to connect to a production database like **Firebase Firestore**. This involves creating functions to create, read, update, and delete (CRUD) referrals, patients, and users.
2.  **Real Authentication**: Move from the simulated login to a secure authentication system.
    *   **Action**: Integrate **Firebase Authentication**. This will provide secure sign-in, user management, and support for Multi-Factor Authentication (MFA) and Single Sign-On (SSO).
3.  **Environment Variables**: Secure all credentials and configuration keys.
    *   **Action**: Move database credentials, API keys, and other secrets from the code into environment variables (`.env.local`) and configure them on the hosting provider.

### Phase 2: Advanced Features & Business Logic

1.  **Role-Based Access Control (RBAC)**: Enforce the user roles and permissions currently simulated in the prototype.
    *   **Action**: Implement server-side checks in API routes and Server Components to verify a user's role and permissions before allowing them to perform actions (e.g., only an Admin can access the `/users` page).
2.  **Full Audit Logging**: Implement the backend logic for the audit history pages.
    *   **Action**: Create a new `audits` collection in the database. Whenever a significant action occurs (e.g., a referral is updated), create a new audit log entry that records who did what, and when. The history pages will then fetch data from this collection.
3.  **Real-time Notifications**: Implement a real notification system.
    *   **Action**: Use a service like **Firebase Cloud Functions** to trigger notifications (e.g., sending an email or push notification) when data changes in the database, such as when a new referral is assigned.

### Phase 3: Deployment & Optimization

1.  **Production Deployment**: Host the application on a scalable, secure platform.
    *   **Action**: Deploy the Next.js application to **Firebase App Hosting**. This provides a seamless, scalable, and secure environment managed by Google.
2.  **Performance Optimization**: Ensure the application is fast and responsive.
    *   **Action**: Implement image optimization with `next/image`, code splitting, and leverage Next.js caching strategies (both on the server and client) to minimize load times.
3.  **Cross-Platform Strategy (PWA)**: To make the web application accessible and "app-like" on iOS, Android, and desktop platforms without rebuilding it in a different framework, we will enhance it with Progressive Web App (PWA) features.
    *   **Action**: Add a web manifest and a service worker. This will allow users to "install" the web app to their home screen, enable offline access for key data, and provide a foundation for web push notifications.
