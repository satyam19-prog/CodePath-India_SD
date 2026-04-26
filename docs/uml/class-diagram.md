# Class Diagram — CodePath India

## Overview
Represents all system classes, their attributes, methods, inheritance hierarchy, and relationships including associations, compositions, and interface realizations.

## Diagram

````mermaid
classDiagram
    class User {
        <<abstract>>
        +String id
        +String email
        +String passwordHash
        +Role role
        +login() JWTToken
        +getProfile() UserDTO
        +logout() void
    }

    class Student {
        +number solvedCount
        +number streak
        +number rating
        +List~Badge~ badges
        +submitSolution(code, language) Submission
        +joinClassroom(joinCode) void
        +viewLeaderboard() List~LeaderboardEntry~
    }

    class Teacher {
        +List~String~ classroomIds
        +String department
        +createClassroom(name) Classroom
        +viewStudentProgress(classroomId) List~StudentDTO~
        +generateJoinCode() String
    }

    class Admin {
        +List~String~ permissions
        +Date createdAt
        +createChallenge(data) Challenge
        +editChallenge(id, data) Challenge
        +managePlatform() void
    }

    class Challenge {
        <<abstract>>
        +String id
        +String title
        +Difficulty difficulty
        +List~String~ tags
        +String description
        +getDetails() ChallengeDTO
        +validate() boolean
        +execute(code, language) List~TestResult~
    }

    class ManualChallenge {
        +String createdBy
        +List~TestCase~ testCases
        +String sampleInput
        +String sampleOutput
        +addTestCase(tc) void
        +runJudge0(code, lang) TestResult
    }

    class CodeforcesChallenge {
        +String contestId
        +String problemIndex
        +number cfRating
        +fetchFromCF() void
        +proxyRequest() Response
    }

    class Submission {
        +String id
        +String studentId
        +String challengeId
        +Language language
        +String code
        +SubmissionStatus status
        +number runtime
        +number memory
        +run() List~TestResult~
        +submit() Verdict
    }

    class Classroom {
        +String id
        +String teacherId
        +String name
        +String joinCode
        +List~String~ studentIds
        +Date createdAt
        +enroll(studentId) void
        +getRoster() List~Student~
        +removeStudent(studentId) void
    }

    class Leaderboard {
        +String id
        +List~LeaderboardEntry~ entries
        +BoardType type
        +Date updatedAt
        +getRankings() List~LeaderboardEntry~
        +updateScore(studentId, score) void
        +getTopN(n) List~LeaderboardEntry~
    }

    class Badge {
        +String id
        +String name
        +String description
        +number milestone
        +String iconUrl
        +award(studentId) void
        +checkEligibility(student) boolean
    }

    class TestCase {
        +String id
        +String input
        +String expectedOutput
        +number timeLimit
        +number memoryLimit
    }

    class IAuthService {
        <<interface>>
        +register(data) User
        +login(email, password) JWTToken
        +verifyToken(token) boolean
        +hashPassword(plain) String
        +refreshToken(token) Token
    }

    User <|-- Student : extends
    User <|-- Teacher : extends
    User <|-- Admin : extends

    Challenge <|-- ManualChallenge : extends
    Challenge <|-- CodeforcesChallenge : extends

    IAuthService <|.. User : realizes

    Student "1" --> "0..*" Submission : submits
    Student "0..*" --> "0..*" Classroom : joins
    Student "1" --> "0..*" Badge : earns
    Student "0..*" --> "1" Leaderboard : ranked in

    Teacher "1" --> "0..*" Classroom : creates

    Challenge "1" *-- "0..*" Submission : composed of
    ManualChallenge "1" *-- "1..*" TestCase : contains

    Admin ..> Challenge : manages
````

## Key Design Decisions
- `User` is abstract — never instantiated directly, always as Student/Teacher/Admin
- `Challenge` is abstract — extended by ManualChallenge and CodeforcesChallenge (Open/Closed Principle)
- `IAuthService` interface decouples auth logic from User model (Dependency Inversion)
- `ManualChallenge` composes `TestCase` objects (Composition over Inheritance)