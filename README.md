Zorbee Health Web Application

About:
Zorbee Health is a Next.js-based platform that connects users with doctors and medical professionals for consultations and assistance. It offers features like real-time chat, appointment scheduling, and secure medical record access. Built for speed and scalability, it ensures a seamless and efficient healthcare experience.

Key Features:
Next.js as the frontend framework
Global state management using Redux Toolkit
TypeScript for type safety
Material UI (MUI) for the UI library
Centralized constants for better maintainability
Linting and formatting setup

Technologies Used:
Next.js
Redux Toolkit
Material UI (MUI)
TypeScript
ESLint
Prettier
Husky (Git Hooks)

Project Architecture:
We follow a structured and scalable architecture to ensure maintainability.

Folder Structure:
src/
│── app/              # Entry point for Next.js (App Router)
│── components/       # UI components
│── constants/        # Centralized constants
│── hooks/            # Custom hooks
│── layouts/          # Page layouts
│── services/         # API services
│── store/            # Redux store setup
│── styles/           # Global styles and themes
│── utils/            # Helper functions
│── types/            # TypeScript type definitions
│── public/           # Static assets

Installation & Setup:
1. Install Dependencies
Ensure you have Node.js installed. Then, install dependencies using:
`npm install`
2. Development Server
Start the development server:
`npm run dev`
Open http://localhost:3000 in browser.
3. Build for Production
`npm run build`

State Management (Redux Toolkit) :
The global state is managed using Redux Toolkit.

Code Quality & Conventions :
Linting & Formatting
Run ESLint:
`npm run lint`
Format code using Prettier:
`npm run format`

Folder & File Naming Conventions:
Folders: Kebab-case (components/, services/, store/)
Files: Kebab-case (user-card.tsx, user-service.ts)
Hooks: CamelCase (useAuth.ts, useTheme.ts)

Design System (MUI Theming):
Material UI (MUI) is used for the design system. The theme can be customized through that.

Git Hooks & CI/CD :
Husky ensures pre-commit checks (linting)
GitHub Actions can be set up for CI/CD

Deployment :
Will be deployed to AWS.