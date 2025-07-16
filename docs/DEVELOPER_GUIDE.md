# ReferralFlow - Developer Guide

This document provides developers with the information needed to get started with the ReferralFlow codebase.

## Table of Contents
1.  [Tech Stack](#1-tech-stack)
2.  [Project Structure](#2-project-structure)
3.  [Getting Started](#3-getting-started)
4.  [Key Architectural Concepts](#4-key-architectural-concepts)
5.  [Styling & UI Components](#5-styling--ui-components)
6.  [Generative AI with Genkit](#6-generative-ai-with-genkit)
7.  [Production Roadmap](#7-production-roadmap)

---

### 1. Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: ShadCN UI Components
- **Styling**: Tailwind CSS with CSS Variables for theming
- **Generative AI**: Google Gemini via Firebase Genkit
- **State Management**: React Hooks & Context API

### 2. Project Structure

```
/
|-- docs/                 # Project documentation
|-- public/               # Static assets
|-- src/
|   |-- app/              # Next.js App Router pages and layouts
|   |-- components/       # Reusable React components (UI and feature-specific)
|   |-- hooks/            # Custom React hooks
|   |-- lib/              # Core utilities, mock data, and type definitions
|   |-- ai/               # Genkit flows and configuration
|-- .env                  # Environment variables (not committed)
|-- next.config.ts        # Next.js configuration
|-- tsconfig.json         # TypeScript configuration
```

### 3. Getting Started

1.  **Clone the Repository**
    ```bash
    git clone <repository_url>
    cd referralflow
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    The app runs on port `9002`.
    ```bash
    npm run dev
    ```

4.  **Run the Genkit Development Server**
    To test and develop AI flows, run the Genkit server in a separate terminal.
    ```bash
    npm run genkit:watch
    ```

### 4. Key Architectural Concepts

- **Server Components by Default**: Most components in `src/app` are Next.js Server Components, which run on the server to improve performance. Client-side interactivity is opted into with the `"use client";` directive.
- **Mock Data**: All data is currently sourced from `src/lib/mock-data.ts`. This file serves as a temporary, in-memory database for the prototype.
- **Dialog-based Editing**: Most create and edit operations are handled within modal dialogs (e.g., `NewReferralDialog`, `UserDetailDialog`). This keeps the UI context clean.
- **Context for State**: The primary global state (e.g., sidebar state) is managed via React Context in `src/components/ui/sidebar.tsx`.

### 5. Styling & UI Components

- **ShadCN UI**: The project is built on top of the components from `shadcn/ui`. These are unstyled components that we can customize. You can add new components with the `shadcn-ui` CLI.
- **Tailwind CSS**: Styling is handled with Tailwind CSS utility classes.
- **Theming**: Colors are managed through CSS variables in `src/app/globals.css`. This allows for easy implementation of light/dark modes and different color themes. The primary theme colors are defined in `:root`.

### 6. Generative AI with Genkit

- **Flows**: All AI-powered features are implemented as Genkit flows in `src/ai/flows/`.
- **Configuration**: The global Genkit configuration and AI model selection are located in `src/ai/genkit.ts`.
- **Calling Flows**: Flows are server-side functions that are called directly from React Server Components or Client Components that use Server Actions.

### 7. Production Roadmap

For a detailed plan on how to move this prototype to a production-ready application, please see the `PRODUCTION_ROADMAP.md` file in the root of the project.
