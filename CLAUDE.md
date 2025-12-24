### 🔄 Project Awareness & Context
- **Always read `PLANNING.md`** at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
- **Check `TASK.md`** before starting a new task. If the task isn't listed, add it with a brief description and today's date.
- **Use consistent naming conventions, file structure, and architecture patterns** as described in `PLANNING.md`.
- **Use `npm run` or `yarn`** when running commands. Check `package.json` scripts for available commands.

### 🧱 Code Structure & Modularity
- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by extracting into separate modules, components, or services.
- **Follow TypeScript best practices** for code organization:

#### Backend (Node.js + Express + TypeScript):
  - `src/routes/` - Express route handlers and endpoint definitions
  - `src/controllers/` - Request handling and response formatting
  - `src/services/` - Business logic and operations
  - `src/models/` - Drizzle ORM schema definitions
  - `src/middleware/` - Express middleware (auth, validation, error handling)
  - `src/utils/` - Utility functions and helpers
  - `src/types/` - TypeScript type definitions and interfaces
  - `src/config/` - Configuration files (database, environment, etc.)

#### Frontend (React Native + TypeScript):
  - `src/screens/` - Screen components
  - `src/components/` - Reusable UI components
  - `src/navigation/` - Navigation configuration (React Navigation)
  - `src/hooks/` - Custom React hooks
  - `src/services/` - API clients and external service integrations
  - `src/store/` or `src/context/` - State management (Redux/Zustand/Context)
  - `src/types/` - TypeScript interfaces and types
  - `src/utils/` - Utility functions and helpers
  - `src/theme/` - Theme configuration, colors, typography

- **Use barrel exports** (`index.ts`) to simplify imports from folders.
- **Use `.env` files** for environment variables. Never commit secrets. Use `dotenv` for backend.

### 🧪 Testing & Reliability
- **Always create tests for new features** (components, services, routes, utilities).
- **After updating any logic**, check whether existing tests need to be updated. If so, do it.

#### Backend Testing (Jest + Supertest):
  - Tests live in `__tests__/` folders or adjacent `.test.ts` files
  - Include at least:
    - 1 test for expected use
    - 1 edge case
    - 1 failure/error case
  - Use **Supertest** for API endpoint testing
  - Mock database calls when appropriate

#### Frontend Testing (Jest + React Native Testing Library):
  - Tests live adjacent to components as `.test.tsx` or in `__tests__/`
  - Test component rendering, user interactions, and state changes
  - Use **@testing-library/react-native** for component testing
  - Mock navigation and API calls

### ✅ Task Completion
- **Mark completed tasks in `TASK.md`** immediately after finishing them.
- Add new sub-tasks or TODOs discovered during development to `TASK.md` under a "Discovered During Work" section.

### 📎 Style & Conventions
- **Use TypeScript strictly** - enable `strict: true` in `tsconfig.json`.
- **Follow Airbnb JavaScript/TypeScript Style Guide** and format with **Prettier**.
- **Use ESLint** for linting with React Native and TypeScript rules.
- **Use async/await** instead of raw promises for better readability.
- **Prefer functional components** and React hooks over class components.
- **Use PostgreSQL with Drizzle ORM**:
  - Define schemas using Drizzle's schema builder
  - Use Drizzle migrations for database changes
  - Write type-safe queries with Drizzle's query builder
- **Express best practices**:
  - Use async error handling middleware
  - Validate request data (use `zod` or `joi`)
  - Keep controllers thin, move logic to services
  - Use RESTful conventions for API endpoints

- Write **JSDoc comments for complex functions**:
  ```typescript
  /**
   * Brief summary of what the function does.
   * @param param1 - Description of parameter
   * @returns Description of return value
   */
  function example(param1: string): Promise<Result> {
    // implementation
  }
  ```

### 📚 Documentation & Explainability
- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `// Reason:` comment** explaining the why, not just the what.
- Document environment variables in `.env.example` files.

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate npm packages or APIs** – only use known, verified packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `TASK.md`.
- **Check `package.json`** to see what dependencies are already installed before suggesting new ones.