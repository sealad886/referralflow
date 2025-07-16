# Production Roadmap

This document outlines the key phases to transition this prototype into a production-ready application.

## Phase 1: Foundational Backend & Authentication

1.  **Database Integration**: The first and most critical step is to replace the mock data (`src/lib/mock-data.ts`) with a real database.
    *   **Action**: Implement services to connect to a production database like **Firebase Firestore**. This involves creating functions to create, read, update, and delete (CRUD) referrals, patients, and users.
2.  **Real Authentication**: Move from the simulated login to a secure authentication system.
    *   **Action**: Integrate **Firebase Authentication**. This will provide secure sign-in, user management, and support for Multi-Factor Authentication (MFA) and Single Sign-On (SSO).
3.  **Environment Variables**: Secure all credentials and configuration keys.
    *   **Action**: Move database credentials, API keys, and other secrets from the code into environment variables (`.env.local`) and configure them on the hosting provider.

## Phase 2: Advanced Features & Business Logic

1.  **Role-Based Access Control (RBAC)**: Enforce the user roles and permissions currently simulated in the prototype.
    *   **Action**: Implement server-side checks in API routes and Server Components to verify a user's role and permissions before allowing them to perform actions (e.g., only an Admin can access the `/users` page).
2.  **Full Audit Logging**: Implement the backend logic for the audit history pages.
    *   **Action**: Create a new `audits` collection in the database. Whenever a significant action occurs (e.g., a referral is updated), create a new audit log entry that records who did what, and when. The history pages will then fetch data from this collection.
3.  **Real-time Notifications**: Implement a real notification system.
    *   **Action**: Use a service like **Firebase Cloud Functions** to trigger notifications (e.g., sending an email or push notification) when data changes in the database, such as when a new referral is assigned.

## Phase 3: Deployment & Optimization

1.  **Production Deployment**: Host the application on a scalable, secure platform.
    *   **Action**: Deploy the Next.js application to **Firebase App Hosting**. This provides a seamless, scalable, and secure environment managed by Google.
2.  **Performance Optimization**: Ensure the application is fast and responsive.
    *   **Action**: Implement image optimization with `next/image`, code splitting, and leverage Next.js caching strategies (both on the server and client) to minimize load times.
3.  **Cross-Platform Strategy (PWA)**: To make the web application accessible and "app-like" on iOS, Android, and desktop platforms without rebuilding it in a different framework, we will enhance it with Progressive Web App (PWA) features.
    *   **Action**: Add a web manifest and a service worker. This will allow users to "install" the web app to their home screen, enable offline access for key data, and provide a foundation for web push notifications.
