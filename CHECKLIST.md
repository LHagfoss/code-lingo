# Project Checklist: Code Lingo

## Phase 1: Foundation & Auth (✅ Complete)

- [x] Next.js Project Setup
- [x] Supabase Project & Tables Setup
- [x] Google Authentication (NextAuth v5)
- [x] User Sync Strategy (Auth email -> Database Record)

## Phase 2: Content Structure (✅ Complete)

- [x] Define Schema (Courses -> Units -> Lessons -> Exercises)
- [x] Seed Database (Python & JavaScript Courses)
- [x] Active Course Switching Logic

## Phase 3: The Learning Engine (✅ Complete)

- [x] Course Dashboard (Lesson List)
- [x] Lesson/Quiz Page (Dynamic Routing)
- [x] Quiz Component (Client-side Game Logic)
- [x] Progress Saving (Server Actions)

## Phase 4: UI Polish & Refactoring (✅ Complete)

- [x] **Design System:** Create `Card` component with "3D" style.
- [x] **Design System:** Update `AppButton` to match 3D style.
- [x] **Refactor:** Update `/courses` page to use new components.
- [x] **Refactor:** Update `/profile` page to use new components.
- [x] **Refactor:** Update `/learn` (Dashboard) to use new components.
- [ ] **Feature:** Add "Correct/Wrong" sounds to Quiz.

## Phase 5: Onboarding & Admin (✅ Complete)

- [x] **Dependencies:** Install `zod`.
- [x] **Database:** Update Types for `onboarding_completed`, `username`, `role`.
- [x] **Feature:** Onboarding Flow (`/onboarding` page + Server Action).
- [x] **Feature:** Admin Gate (`/admin` page + Role Check).
- [x] **Cleanup:** Remove `src/store`.

## Phase 6: Admin Course Manager (✅ Complete)

- [x] **Action:** Create `createCourseAction` & `deleteCourseAction`.
- [x] **Page:** Admin Course List (`/admin/courses`).
- [x] **Page:** Admin Create Course (`/admin/courses/create`).
- [x] **UI:** Update Admin Dashboard Navigation.

## Phase 6 - Layer 2: Unit Manager (✅ Complete)

- [x] **Action:** Create `createUnitAction` & `deleteUnitAction`.
- [x] **Page:** Admin Course Detail (`/admin/courses/[id]`).
- [x] **Component:** `AddUnitForm`.

## Phase 6 - Layer 3: Lesson Manager (✅ Complete)

- [x] **Action:** Create `createLessonAction` & `deleteLessonAction`.
- [x] **Query:** `getUnitWithLessons`.
- [x] **Page:** Admin Unit Detail (`/admin/units/[id]`).
- [x] **Component:** `AddLessonForm`.

## Phase 6 - Layer 4: Exercise Manager (✅ Complete)

- [x] **Action:** Create `createExerciseAction` & `deleteExerciseAction`.
- [x] **Query:** `getLessonWithExercises`.
- [x] **Page:** Admin Lesson Detail (`/admin/lessons/[id]`).
- [x] **Component:** `AddExerciseForm`.
- [x] **Action:** Create `createOptionAction` & `deleteOptionAction`.
- [x] **Query:** `getExerciseWithOptions`.
- [x] **Page:** Admin Exercise Detail (`/admin/exercises/[id]`).
- [x] **Component:** `AddOptionForm`.

## Phase 7: Advanced Admin Features & UX (✅ Complete)

- [x] **UI Component:** Custom `Checkbox` with 3D design.
- [x] **Logic Refactor:** Strict single-correct-answer enforcement for Options.
- [x] **Feature:** Exercise Type selection (SELECT/ASSIST).
- [x] **UI Polish:** 3D styled inputs across all admin forms.
- [x] **Verification:** Verified build with `bun run build`.

## Phase 8: Admin Expansion (✅ Complete)

- [x] **Cleanup:** Remove unused files.
- [x] **Optimization:** Verify database indexing.

## Phase 9: Architecture Refactor & Schema Centralization (✅ Complete)

- [x] **Refactor:** Split `src/queries` into `admin` and `user` domains.
- [x] **Refactor:** Centralize Zod schemas in `src/schemas`.
- [x] **Feature:** "Edit Course" functionality (Title & Image).
- [x] **Logic:** Prepare Exercise schema for Informational lessons.
