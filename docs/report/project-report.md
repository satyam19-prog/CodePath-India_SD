# Project Report — CodePath India

## Gamified Coding Platform for Data Structures & Algorithms

---

## 1. Introduction

### 1.1 Project Title
**CodePath India** — An Advanced Gamified Coding Platform for Data Structures & Algorithms

### 1.2 Problem Statement
Students learning data structures and algorithms often lack a structured, engaging environment to practice coding problems, track their progress, and receive real-time feedback. Existing platforms are either too generic, lack gamification elements, or do not support classroom-based learning with teacher oversight. There is a need for a dedicated platform that combines competitive coding, classroom management, and automated code evaluation into a single, cohesive system.

### 1.3 Objective
To design and develop a full-stack web application that:
- Provides a rich library of coding challenges (both custom and imported from Codeforces)
- Evaluates student code submissions automatically using a remote code execution engine (Judge0)
- Supports multi-test-case evaluation with hidden test cases defined by teachers
- Implements role-based access control (Student, Teacher, Admin)
- Gamifies the learning experience through leaderboards, badges, and progress tracking
- Enables teachers to create and manage virtual classrooms with scheduling and Google Meet integration
- Follows clean software engineering principles including SOLID, OOP, and established design patterns

### 1.4 Scope
The platform covers the following functional areas:
- **Authentication & Authorization** — Secure JWT-based login/registration with role-based access
- **Challenge Management** — CRUD operations for coding problems with difficulty ratings, tags, and hidden test cases
- **Code Submission & Evaluation** — Real-time code execution against multiple test cases via Judge0 API
- **Classroom Management** — Teacher-created classrooms with join codes, Google Meet links, and scheduling
- **Leaderboard & Badges** — Global ranking system with automatic badge awards for milestones
- **External Integration** — Codeforces API for importing competitive programming problems

---

## 2. Literature Review / Background

### 2.1 Existing Platforms
| Platform | Strengths | Limitations |
|----------|-----------|-------------|
| LeetCode | Vast problem library, strong community | No classroom management, no teacher oversight |
| HackerRank | Multi-language support, contests | Limited gamification, enterprise-focused |
| Codeforces | Competitive programming, ratings | No integrated classroom or LMS features |
| Google Classroom | Classroom management, scheduling | No code execution or problem-solving features |

### 2.2 Gap Identified
None of the existing platforms combine **competitive coding + classroom management + automated judging + gamification** in a single application tailored for Indian educational institutions. CodePath India bridges this gap by integrating all four pillars.

### 2.3 Technologies Selected
| Layer | Technology | Justification |
|-------|-----------|---------------|
| Frontend | React.js (Vite), TypeScript | Component-based UI, type safety, fast HMR |
| Backend | Node.js, Express.js, TypeScript | Non-blocking I/O, consistent language stack |
| Database | PostgreSQL (Neon), Prisma ORM | Relational integrity, type-safe queries, cloud-hosted |
| Authentication | JWT, bcryptjs | Stateless auth, secure password hashing |
| Code Execution | Judge0 (RapidAPI) | Sandboxed execution, multi-language support |
| External API | Codeforces API | Access to 8000+ competitive programming problems |
| Code Editor | Monaco Editor | VS Code-grade editing experience in the browser |

---

## 3. System Design

### 3.1 Architecture Overview

The system follows a **layered architecture** with strict separation of concerns:

```
┌─────────────────────────────────────────────┐
│                 Frontend (React)             │
│  Pages → Services → API Calls → Context     │
├─────────────────────────────────────────────┤
│              Backend (Express.js)            │
│  Routes → Middlewares → Controllers          │
│            → Services → Repositories         │
├─────────────────────────────────────────────┤
│           Database (PostgreSQL / Prisma)      │
│  User, Submission, Challenge, Classroom,     │
│  Leaderboard, Badge, ClassroomMember         │
├─────────────────────────────────────────────┤
│           External Services                  │
│  Judge0 API  |  Codeforces API  | Google Meet│
└─────────────────────────────────────────────┘
```

### 3.2 Design Patterns Implemented

| Pattern | Implementation | File(s) | Purpose |
|---------|---------------|---------|---------|
| **Singleton** | `PrismaClient` | `patterns/singleton/PrismaClient.ts` | Ensures a single database connection instance throughout the application lifecycle |
| **Factory** | `UserFactory`, `ChallengeFactory` | `factories/UserFactory.ts`, `factories/ChallengeFactory.ts` | Creates the correct subtype (Student/Teacher/Admin or ManualChallenge/CodeforcesChallenge) based on input parameters |
| **Strategy** | `IExecutionStrategy` | `patterns/strategy/IExecutionStrategy.ts`, `Judge0ExecutionStrategy.ts`, `DryRunExecutionStrategy.ts` | Allows swapping between Judge0 (production) and DryRun (testing) execution strategies without modifying the submission service |
| **Observer** | `IObserver`, `LeaderboardObserver`, `BadgeObserver` | `patterns/observer/IObserver.ts`, `LeaderboardObserver.ts`, `BadgeObserver.ts` | Decouples side effects (leaderboard updates, badge awards) from the core submission evaluation logic |

### 3.3 SOLID Principles Applied

| Principle | Application |
|-----------|-------------|
| **Single Responsibility** | Each layer has one job: Controllers handle HTTP, Services handle logic, Repositories handle DB |
| **Open/Closed** | `Challenge` is open for extension (ManualChallenge, CodeforcesChallenge) but closed for modification |
| **Liskov Substitution** | `Student`, `Teacher`, `Admin` are substitutable for `User` in all base operations |
| **Interface Segregation** | `IAuthService`, `IExecutionStrategy` are focused, minimal interfaces |
| **Dependency Inversion** | Services depend on interfaces (e.g., `IExecutionStrategy`), not concrete classes |

### 3.4 Database Schema

The database contains **9 tables** organized around the core entities:

**Core Tables:**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `User` | Base identity for all roles | id, name, email, passwordHash, role |
| `Challenge` | Coding problems | id, title, description, difficulty, rating, tags, testCases, sampleInput, sampleOutput |
| `Submission` | Student code submissions | id, userId, challengeId, code, language, status, verdict, runtime, memory |
| `Classroom` | Teacher-created classrooms | id, name, joinCode, teacherId, meetLink, scheduleDays, scheduleTime |
| `Leaderboard` | Per-student ranking data | id, userId, totalScore, problemsSolved |
| `Badge` | Achievement awards | id, userId, name, icon, awardedAt |

**Junction Table:**
| Table | Purpose | Connects |
|-------|---------|----------|
| `ClassroomMember` | Many-to-many: students ↔ classrooms | userId ↔ classroomId |

**Enums:**
| Enum | Values |
|------|--------|
| `Role` | STUDENT, TEACHER, ADMIN |
| `SubmissionStatus` | PENDING, ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILATION_ERROR |

---

## 4. UML Diagrams

All UML diagrams are located in `/docs/uml/` and rendered using Mermaid syntax.

### 4.1 Use Case Diagram
**File:** `docs/uml/use-case-diagram.md`

**Actors:**
- Student, Teacher, Admin (human actors)
- Judge0 API, Codeforces API (external system actors)

**Key Use Cases:** Register, Login, Browse Challenges, Solve Challenge, Submit Solution, View Leaderboard, Join Classroom, Create Classroom, Create Manual Challenge, Add Test Cases

**Relationships:**
- `Submit Solution` **includes** `Execute via Judge0` — Every submission mandatorily goes through Judge0
- `Browse Challenges` **includes** `Fetch Codeforces Problems` — Challenge list includes Codeforces data
- `Create Manual Challenge` **includes** `Add Test Cases` — Creating a challenge requires defining test cases

### 4.2 ER Diagram
**File:** `docs/uml/er-diagram.md`

Shows all database entities, their attributes with data types (PK, FK, UK annotations), and cardinality relationships. Key relationships include:
- `USER ||--o| STUDENT` (One-to-zero-or-one)
- `STUDENT ||--o{ SUBMISSION` (One-to-many)
- `TEACHER ||--o{ CLASSROOM` (One-to-many)
- `STUDENT }o--o{ CLASSROOM` (Many-to-many via `CLASSROOM_STUDENT` junction table)

### 4.3 Class Diagram
**File:** `docs/uml/class-diagram.md`

Shows the OOP class hierarchy with:
- **Inheritance:** `User ← Student, Teacher, Admin` and `Challenge ← ManualChallenge, CodeforcesChallenge`
- **Interface Realization:** `User` implements `IAuthService`
- **Composition:** `Challenge *-- Submission`, `ManualChallenge *-- TestCase`
- **Association:** `Student → Submission`, `Teacher → Classroom`
- **Dependency:** `Admin ..> Challenge`

### 4.4 Sequence Diagram
**File:** `docs/uml/sequence-diagram.md`

Illustrates the complete code submission flow from the student clicking "Submit" to receiving a verdict:
1. Frontend sends JWT + code to Auth Middleware
2. Auth Middleware verifies JWT and forwards to Submission API
3. Submission API fetches challenge and test cases from DB
4. **Loop:** For each test case, code is executed via Judge0 (POST → poll → result)
5. Submission API evaluates all results and saves submission
6. **Alt (if all passed):** Update leaderboard, check badge eligibility
7. Return verdict to frontend

---

## 5. Implementation Details

### 5.1 Project Structure

```
CodePath-India_SD/
├── backend/
│   ├── src/
│   │   ├── config/                  # Database connection, environment
│   │   │   └── database.ts          # Prisma client with PG adapter
│   │   ├── controllers/             # HTTP request handlers
│   │   │   ├── AuthController.ts    # Login, Register
│   │   │   ├── ChallengeController.ts   # CRUD challenges
│   │   │   ├── ClassroomController.ts   # Create, Join, List classrooms
│   │   │   ├── SubmissionController.ts  # Submit & evaluate code
│   │   │   ├── LeaderboardController.ts # Rankings
│   │   │   └── UserController.ts    # Profile, stats, badges
│   │   ├── services/                # Business logic layer
│   │   │   ├── AuthService.ts       # JWT generation, password hashing
│   │   │   ├── SubmissionService.ts  # Multi-test-case evaluation engine
│   │   │   ├── ChallengeService.ts  # Challenge CRUD + Codeforces import
│   │   │   ├── CodeforcesService.ts # Codeforces API client
│   │   │   ├── Judge0Service.ts     # Judge0 API client
│   │   │   ├── LeaderboardService.ts# Score calculation
│   │   │   └── BadgeService.ts      # Badge eligibility & awarding
│   │   ├── models/                  # OOP class hierarchy
│   │   │   ├── User.ts             # Abstract base class
│   │   │   ├── Student.ts          # Extends User
│   │   │   ├── Teacher.ts          # Extends User
│   │   │   ├── Admin.ts            # Extends User
│   │   │   ├── Challenge.ts        # Abstract base
│   │   │   ├── ManualChallenge.ts  # Extends Challenge
│   │   │   └── CodeforcesChallenge.ts # Extends Challenge
│   │   ├── interfaces/             # TypeScript interfaces
│   │   │   ├── IAuthService.ts     # Auth contract
│   │   │   ├── IUser.ts, IChallenge.ts, ISubmission.ts ...
│   │   ├── patterns/               # Design pattern implementations
│   │   │   ├── singleton/PrismaClient.ts
│   │   │   ├── strategy/IExecutionStrategy.ts
│   │   │   ├── strategy/Judge0ExecutionStrategy.ts
│   │   │   ├── strategy/DryRunExecutionStrategy.ts
│   │   │   ├── observer/IObserver.ts
│   │   │   ├── observer/LeaderboardObserver.ts
│   │   │   └── observer/BadgeObserver.ts
│   │   ├── factories/              # Factory pattern
│   │   │   ├── UserFactory.ts      # Creates Student/Teacher/Admin
│   │   │   └── ChallengeFactory.ts # Creates Manual/Codeforces challenge
│   │   ├── repositories/           # Data access layer
│   │   │   ├── UserRepository.ts
│   │   │   ├── SubmissionRepository.ts
│   │   │   ├── ChallengeRepository.ts
│   │   │   ├── ClassroomRepository.ts
│   │   │   └── LeaderboardRepository.ts
│   │   ├── middlewares/            # Express middleware
│   │   │   ├── auth.middleware.ts  # JWT verification
│   │   │   ├── role.middleware.ts  # RBAC enforcement
│   │   │   ├── error.middleware.ts # Global error handler
│   │   │   └── validate.middleware.ts
│   │   ├── routes/                 # Express routers
│   │   │   ├── auth.routes.ts
│   │   │   ├── challenge.routes.ts
│   │   │   ├── submission.routes.ts
│   │   │   ├── classroom.routes.ts
│   │   │   ├── leaderboard.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── types/                  # Enums, DTOs
│   │   └── utils/                  # JWT helpers, validators
│   └── prisma/
│       └── schema.prisma           # Database schema definition
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Root component with routing
│   │   ├── pages/                  # Route-level page components
│   │   │   ├── Landing.tsx         # Public landing page
│   │   │   ├── Login.tsx           # Authentication
│   │   │   ├── Register.tsx        # User registration
│   │   │   ├── Dashboard.tsx       # Role-based dashboard
│   │   │   ├── Challenges.tsx      # Problem list with filters
│   │   │   ├── SolveProblem.tsx    # Monaco Editor + code submission
│   │   │   ├── CreateChallenge.tsx # Teacher: create problems with test cases
│   │   │   ├── Classroom.tsx       # Classroom management + Google Meet
│   │   │   ├── Leaderboard.tsx     # Global rankings
│   │   │   └── Profile.tsx         # User stats, badges, submissions
│   │   ├── components/             # Reusable UI components
│   │   ├── context/                # React Context providers
│   │   │   └── AuthContext.tsx     # Global auth state (JWT, user, role)
│   │   ├── hooks/                  # Custom React hooks
│   │   │   └── useAuth.ts         # Auth convenience hook
│   │   ├── services/               # API client functions
│   │   │   ├── api.ts             # Axios instance with interceptors
│   │   │   ├── authService.ts     # Login/Register API calls
│   │   │   ├── challengeService.ts# Challenge CRUD API calls
│   │   │   └── submissionService.ts # Submit code API calls
│   │   └── types/
│   │       └── index.ts           # Shared TypeScript interfaces
│   └── index.html
└── docs/
    ├── uml/
    │   ├── use-case-diagram.md
    │   ├── er-diagram.md
    │   ├── class-diagram.md
    │   └── sequence-diagram.md
    └── report/
        └── project-report.md       # This document
```

### 5.2 Key Features Implementation

#### 5.2.1 Authentication System
- **Registration:** Users register with name, email, password, and role. Passwords are hashed using `bcryptjs` (10 salt rounds) before storage.
- **Login:** Credentials are verified against the database. On success, a JWT token is generated containing `userId` and `role`, valid for 24 hours.
- **Protected Routes:** The `auth.middleware.ts` intercepts every protected API request, extracts the JWT from the `Authorization` header, verifies it, and attaches the decoded user info to the request object.
- **Role-Based Access:** The `role.middleware.ts` checks if the authenticated user's role matches the required role for specific endpoints (e.g., only TEACHERs can create classrooms).

#### 5.2.2 Code Submission & Evaluation Engine
This is the core feature of the platform. The evaluation pipeline works as follows:

1. **Student submits code** via the Monaco Editor on the `SolveProblem` page
2. **Frontend** sends `POST /api/submissions/submit` with `{ challengeId, code, language }`
3. **SubmissionController** fetches the challenge from the database, including its hidden `testCases` (JSON array of `{ input, output }` pairs)
4. **SubmissionService** iterates through each test case:
   - Sends the student's code + test case input to Judge0 via `Judge0ExecutionStrategy`
   - Judge0 returns the execution result (stdout, stderr, runtime, memory)
   - Compares the stdout (trimmed) against the expected output
   - If any test case fails, the loop breaks immediately (**fail-fast** approach)
5. **Verdict** is determined:
   - `ACCEPTED` — All test cases passed
   - `WRONG_ANSWER` — Output mismatch on one or more test cases
   - `RUNTIME_ERROR` — Code crashed during execution
   - `COMPILATION_ERROR` — Code failed to compile
   - `TIME_LIMIT_EXCEEDED` — Execution exceeded the time limit
6. **Post-evaluation:** If accepted, the leaderboard and badge services are notified

#### 5.2.3 Challenge Management
- **Manual Challenges:** Teachers/Admins create custom problems via the `CreateChallenge` page with:
  - Title, description, difficulty level, numeric rating (e.g., 800-2400)
  - Tags for categorization (e.g., "arrays", "dynamic programming")
  - Sample input/output (visible to students)
  - Hidden test cases (JSON array, used for judging — invisible to students)
- **Codeforces Integration:** The `CodeforcesService` fetches problems from the Codeforces API, including:
  - Problem statements, difficulty ratings, tags
  - Contest information and problem indices

#### 5.2.4 Classroom System
- **Creation (Teacher):** Teachers create classrooms with a name, Google Meet link, schedule days, and schedule time. A unique 6-character alphanumeric join code is auto-generated.
- **Joining (Student):** Students enter the join code to enroll in a classroom. The system validates the code, checks for duplicate memberships, and creates a `ClassroomMember` record.
- **Display:** Classroom cards show the class name, schedule, student count, join code, and a clickable "Join Google Meet" button that opens the teacher's Meet link in a new tab.

#### 5.2.5 Gamification
- **Leaderboard:** Global rankings based on total score and problems solved. Updated automatically after each accepted submission.
- **Badges:** Awarded automatically when students reach milestones:
  - 🔥 First Blood — Solved first problem
  - ⚡ Speed Demon — Fast submission
  - 🏆 Problem Crusher — Solved 10+ problems
  - 💎 Elite Coder — High rating achieved
- **Profile:** Displays solved count, current rating, streak, earned badges, and submission history.

### 5.3 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create a new user account |
| POST | `/api/auth/login` | No | Authenticate and receive JWT |
| GET | `/api/users/profile` | Yes | Get current user's profile |
| GET | `/api/users/:id/stats` | Yes | Get user stats (solved, badges) |
| GET | `/api/challenges` | No | List all challenges |
| GET | `/api/challenges/:id` | No | Get challenge details |
| POST | `/api/challenges` | Teacher/Admin | Create a new challenge |
| POST | `/api/submissions/submit` | Yes | Submit code for evaluation |
| GET | `/api/leaderboard` | No | Get global rankings |
| GET | `/api/classrooms` | Yes | Get user's classrooms |
| POST | `/api/classrooms` | Teacher | Create a classroom |
| POST | `/api/classrooms/join` | Yes | Join a classroom via code |

---

## 6. Testing & Verification

### 6.1 TypeScript Compilation
Both frontend and backend are compiled with `tsc --noEmit` (strict mode) to ensure zero type errors across the entire codebase. All interfaces, enums, and type definitions are shared and consistent.

### 6.2 Functional Testing
| Feature | Test Method | Result |
|---------|------------|--------|
| User Registration | Manual — Register with email/password | ✅ Pass |
| User Login | Manual — Login and receive JWT | ✅ Pass |
| Challenge Creation | Manual — Teacher creates challenge with hidden test cases | ✅ Pass |
| Code Submission | Manual — Submit code, verify multi-test-case evaluation | ✅ Pass |
| Classroom Creation | Manual — Teacher creates classroom with Meet link | ✅ Pass |
| Classroom Joining | Manual — Student joins using join code | ✅ Pass |
| Leaderboard Update | Manual — Verify ranking after accepted submission | ✅ Pass |
| Badge Awarding | Manual — Verify badge on milestone | ✅ Pass |

### 6.3 Database Verification
- Schema synchronized using `npx prisma db push`
- Prisma Client regenerated using `npx prisma generate`
- All relations (User ↔ Submission, Teacher ↔ Classroom, Student ↔ ClassroomMember) verified

---

## 8. Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| Prisma Client not recognizing new schema fields | Ran `npx prisma generate` to regenerate client types after schema changes |
| `ts-node` caching stale Prisma types at runtime | Used `as any` type assertions temporarily until server restart cleared the cache |
| `PrismaClient` initialization error with Neon adapter | Imported the globally configured Prisma instance from `config/database.ts` instead of creating new instances |
| TypeScript `baseUrl` deprecation in TS 6.x | Removed deprecated `baseUrl` from `tsconfig.json` since path aliases were not actively used |
| UUID vs number type mismatches across frontend | Unified all ID types to `string \| number` in frontend interfaces for compatibility |
| Judge0 API rate limiting during testing | Implemented fail-fast evaluation — breaks on first test case failure to minimize API calls |

---

## 9. Future Enhancements

1. **Bulk Challenge Import** — Allow teachers to upload multiple challenges via CSV/JSON
2. **Real-time Leaderboard** — WebSocket integration for live ranking updates during contests
3. **Code Playback** — Record and replay student coding sessions for review
4. **Plagiarism Detection** — Compare submissions across students using code similarity algorithms
5. **Contest Mode** — Time-bound competitive coding sessions with live standings
6. **Mobile Responsive** — Optimize UI for tablet and mobile devices
7. **Analytics Dashboard** — Teacher-facing analytics with charts showing class performance trends

---

## 10. Conclusion

CodePath India successfully demonstrates a full-stack, production-grade coding platform that combines:
- **Automated code evaluation** with hidden test cases and multi-language support via Judge0
- **Classroom management** with real-time Google Meet integration and scheduling
- **Gamification** through leaderboards, badges, and progress tracking
- **Clean architecture** following SOLID principles, design patterns (Singleton, Factory, Strategy, Observer), and layered separation of concerns

The platform is built with modern technologies (React, TypeScript, Node.js, PostgreSQL, Prisma) and is designed to be extensible for future features. All UML diagrams (Use Case, ER, Class, Sequence) accurately reflect the implemented system architecture.

---

## 11. References

1. React.js Documentation — https://react.dev
2. Node.js Documentation — https://nodejs.org/docs
3. Express.js Documentation — https://expressjs.com
4. Prisma ORM Documentation — https://www.prisma.io/docs
5. Judge0 API Documentation — https://judge0.com
6. Codeforces API Documentation — https://codeforces.com/apiHelp
7. Monaco Editor — https://microsoft.github.io/monaco-editor
8. JWT (JSON Web Tokens) — https://jwt.io
9. Design Patterns: Elements of Reusable Object-Oriented Software — Gamma, Helm, Johnson, Vlissides (Gang of Four)
10. Clean Architecture — Robert C. Martin

---

## 12. Team Members

| Name | Contribution |
|------|-------------|
| Satyam | Project setup, repo structure, UML diagrams, design patterns scaffold, TypeScript interfaces & enums, architecture |
| Jigyasu | Backend auth — JWT, bcrypt, AuthService, middleware, UserFactory, OOP models |
| Manya | Backend features — SubmissionService, Judge0, Leaderboard, Badge, Observer & Strategy patterns |
| Aditya | Frontend — all pages, AuthContext, Monaco Editor, API integration |

---

*Report prepared for: CodePath India — Software Design Project*
*Date: April 2026*
