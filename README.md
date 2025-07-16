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
