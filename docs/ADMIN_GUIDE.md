# ReferralFlow - Administrator's Guide

This guide is for System Administrators responsible for the deployment, configuration, and ongoing management of the ReferralFlow application.

## Table of Contents

1.  [System Requirements](#1-system-requirements)
2.  [Deployment](#2-deployment)
3.  [Authentication Setup](#3-authentication-setup)
4.  [User Management](#4-user-management)
5.  [Managing Locations & Settings](#5-managing-locations--settings)
6.  [Security Policies](#6-security-policies)
7.  [Monitoring & Auditing](#7-monitoring--auditing)

---

### 1. System Requirements

- **Hosting**: A Node.js environment (Firebase App Hosting is recommended).
- **Database**: A NoSQL database (Firebase Firestore is recommended).
- **Authentication**: An OAuth 2.0 compatible provider (Firebase Authentication is recommended).

### 2. Deployment

The application is built with Next.js and can be deployed to any hosting provider that supports Node.js. For a seamless experience, we recommend using Firebase App Hosting.

Refer to the `PRODUCTION_ROADMAP.md` file for detailed steps on deploying to Firebase.

### 3. Authentication Setup

ReferralFlow is designed to work with Firebase Authentication, which provides secure user management, multi-factor authentication (MFA), and single sign-on (SSO).

- **Configuration**: All Firebase configuration keys must be stored as environment variables on your hosting provider. Do not hard-code them into the application.
- **MFA Enforcement**: As an administrator, you can enforce MFA for all users via the **Settings -> Admin Settings** page.

`[Image: Screenshot of the Admin Settings card for MFA enforcement]`

### 4. User Management

Administrators have full control over user accounts via the **User Management** page.

- **Adding Users**: Click the "Add User" button to open the user detail dialog and fill in the new user's information.
- **Editing Users**: Click on any user in the table to open the dialog and edit their profile, role, permissions, and group memberships.
- **Deactivating Users**: Use the "Deactivate User" button within the edit dialog to revoke a user's access without permanently deleting their record.
- **Roles vs. Permissions**:
    - **Roles** (`Admin`, `Manager`, `Clinical`, `Clerical`) are broad-level access controls.
    - **Permissions** (`CanAssignReferral`, `CanEditUsers`, etc.) provide granular control and can be used to override the default permissions of a user's assigned groups.

### 5. Managing Locations & Settings

The **Locations** page allows administrators to define the organizational structure of facilities and departments.

- **Inheritance**: Settings are inherited from parent locations. For example, a setting applied to "City Central Hospital" will apply to the "Cardiology" department unless it is explicitly overridden in the Cardiology department's own settings.
- **Settings Simulator**: Use the simulator on the Locations page to see the effective settings for any given location, which helps in understanding how inheritance and overrides are applied.

`[Image: Screenshot of the Locations page with the settings simulator]`

### 6. Security Policies

Global security policies can be configured in the **Settings -> Admin Settings** section.

- **Global MFA**: Enforce MFA for all users.
- **Auth Token Expiration**: Set the duration for user login sessions.

### 7. Monitoring & Auditing

Administrators have unrestricted access to all audit logs.

- **Patient & Referral History**: Navigate to any patient or referral detail view and click the "See Full History" button to view a complete audit trail for that record.
- **Future Dashboards**: The production roadmap includes plans for dedicated security and audit dashboards to provide high-level insights into system activity and integrity.
