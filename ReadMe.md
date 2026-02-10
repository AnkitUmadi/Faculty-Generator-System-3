# 🗓️ Faculty Timetable Management System

A full-stack web application for managing faculty, assigning subjects to sections, and automatically generating conflict-free timetables for engineering college departments.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Seeding the Database](#seeding-the-database)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Pages & Components](#pages--components)
- [Database Models](#database-models)
- [Timetable Generation Logic](#timetable-generation-logic)

---

## Overview

This system allows college administrators to:
- Manage faculty members and their subject/section assignments
- Configure working hours, period durations, and break times
- Auto-generate timetables per section with conflict detection
- View reports and faculty load analysis
- Export timetables to PDF

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, React-Select |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Build Tool | Vite |
| Styling | Inline CSS (no external UI library) |

---

## Project Structure

```
NOTSOL/
├── node_modules/
└── server/
    ├── client/                         # React Frontend (Vite)
    │   ├── public/
    │   │   └── vite.svg
    │   └── src/
    │       ├── assets/
    │       │   ├── faculty-logo.png
    │       │   └── logo.png
    │       ├── components/
    │       │   ├── DashboardCard.jsx   # Reusable card component
    │       │   └── Header.jsx          # Top navigation header
    │       ├── constants/
    │       │   └── subjects.js         # Subject groups by department
    │       ├── pages/
    │       │   ├── AdminDashboard.jsx  # Home/landing page
    │       │   ├── FacultyManagement.jsx
    │       │   ├── Reports.jsx
    │       │   ├── Settings.jsx
    │       │   └── TimetableView.jsx
    │       ├── services/
    │       │   └── api.js              # API helper functions
    │       ├── App.jsx                 # Route definitions
    │       └── main.jsx                # React entry point
    │
    ├── config/
    │   └── db.js                       # MongoDB connection
    ├── controllers/
    │   ├── facultyController.js
    │   ├── sectionController.js
    │   ├── settingsController.js
    │   ├── subjectController.js
    │   └── timetableController.js
    ├── models/
    │   ├── Department.js
    │   ├── Faculty.js
    │   ├── Section.js
    │   ├── Settings.js
    │   ├── Subject.js
    │   └── Timetable.js
    ├── routes/
    │   ├── departmentRoutes.js
    │   ├── facultyRoutes.js
    │   ├── sectionRoutes.js
    │   ├── settingsRoutes.js
    │   ├── subjectRoutes.js
    │   └── timetableRoutes.js
    ├── seed/
    │   ├── migrateFacultySubjectDepartment.js
    │   ├── seedDepartmentsAndSubjects.js
    │   └── seedSections.js
    ├── utils/
    │   └── timetableGenerator.js       # Core generation algorithm
    ├── .env
    └── index.js                        # Express server entry point
```

---

## Features

### ✅ Faculty Management
- Add, edit, and delete faculty members
- Assign each faculty member a subject, department (auto-filled), and section
- Visual slot picker to set faculty availability (days × periods grid)
- **Real-time conflict detection** — blocked slots shown in red when:
  - The same faculty member is already assigned to another section at that time
  - Another faculty member is already teaching the selected section at that time

### ✅ Timetable Generation
- Select department and section to generate a timetable
- Algorithm fills slots based on faculty availability
- Distributes load evenly (least-used faculty first)
- Saves/updates timetable to the database
- Export to PDF via browser print

### ✅ Settings
- Configure school working hours (start/end time)
- Set period duration (30–120 minutes)
- Set number of periods per day (1–9)
- Enable/disable break times (Lunch Break, Short Break)
- Dynamic schedule calculation with break insertion logic

### ✅ Reports
- Select a department to view summary stats
- Total faculty count, filled slots, empty slots
- Timetable utilization progress bar
- Faculty load table with overload detection (> 2 periods = Overloaded)

### ✅ Supported Departments & Subjects

| Department | Code | Subjects |
|-----------|------|---------|
| Computer Science Engineering | CSE | DSA, OS, DBMS, CN, SE, AI, ML, COA, CD, DS |
| Electronics & Communication Engg. | ECE | DE, AE, VLSI, DSP, EMFT, CS-ECE, MIC |
| Electrical Engineering | EE | NA, PS, PE, EM, CS-EE, HVE |
| Mechanical Engineering | ME | TOM, SOM, FM, HT, IC, MD, CAM |

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd NOTSOL/server

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client
npm install
cd ..
```

### Environment Variables

Create a `.env` file in `server/`:

```env
MONGO_URI=mongodb://localhost:27017/timetable_db
PORT=5000
```

### Seeding the Database

Run these scripts **once** in order before starting the app:

```bash
# Step 1: Seed departments and subjects
node seed/seedDepartmentsAndSubjects.js

# Step 2: Seed sections (2nd–4th year, A–L per department)
node seed/seedSections.js
```

> **Note:** The seed scripts clear existing data before inserting. Do not re-run them after adding faculty data.

If you have existing faculty records with old string-based subject codes, run the migration:

```bash
node seed/migrateFacultySubjectDepartment.js
```

---

## Running the App

```bash
# From the server/ directory

# Start backend (port 5000)
node index.js

# In a separate terminal — start frontend (port 5173)
cd client
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## API Reference

### Faculty

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/faculty` | Get all faculty |
| GET | `/api/faculty/:id` | Get faculty by ID |
| POST | `/api/faculty` | Create faculty |
| PUT | `/api/faculty/:id` | Update faculty |
| DELETE | `/api/faculty/:id` | Delete faculty |

**POST/PUT body:**
```json
{
  "name": "Dr. Smith",
  "subjectCode": "DSA",
  "section": "<section_object_id>",
  "availability": [
    { "day": "Monday", "periods": [1, 2] },
    { "day": "Wednesday", "periods": [3] }
  ]
}
```

### Sections

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sections` | Get all sections |
| GET | `/api/sections?departmentId=xxx` | Get sections by department (year > 1) |
| POST | `/api/sections` | Create section |
| PUT | `/api/sections/:id` | Update section |
| DELETE | `/api/sections/:id` | Delete section |

### Timetable

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/timetable/generate?departmentId=xxx&sectionId=xxx` | Generate timetable |
| GET | `/api/timetable?departmentId=xxx&sectionId=xxx` | Get saved timetable |
| DELETE | `/api/timetable?departmentId=xxx` | Delete timetable |

### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get settings (creates defaults if none exist) |
| PUT | `/api/settings` | Update settings |
| POST | `/api/settings/reset` | Reset to defaults |

### Departments & Subjects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | Get all departments |
| GET | `/api/subjects` | Get all subjects (populated with department) |

---

## Pages & Components

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Admin Dashboard | `/` | Entry point with navigation cards |
| Faculty Management | `/faculty` | Add/edit/delete faculty with slot picker |
| Timetable View | `/timetable` | Generate and display timetables |
| Reports | `/reports` | Department-level stats and faculty load |
| Settings | `/settings` | Configure periods, hours, and breaks |

### Key Components

**`Header.jsx`** — Top bar with logo and system title, shown on all pages.

**`DashboardCard.jsx`** — Reusable card used on the Admin Dashboard for navigation.

**`constants/subjects.js`** — Static grouped subject options used in the faculty form's React-Select dropdown.

---

## Database Models

### Faculty
```
name         String (required)
subject      ObjectId → Subject
department   ObjectId → Department
section      ObjectId → Section
availability [{ day: String, periods: [Number] }]
```

### Section
```
code         String (e.g. "2A", "3H")
name         String
department   ObjectId → Department
academicYear "1st Year" | "2nd Year" | "3rd Year" | "4th Year"
year         Number (1–4)
cycle        "Physics" | "Chemistry" | null
capacity     Number (default 60)
```

### Settings (Singleton)
```
workingHours   { startTime: String, endTime: String }
periodDuration Number (30–120 min)
numberOfPeriods Number (1–9)
breakTimes     [{ name, startTime, endTime, enabled }]
singleton      Boolean (unique: true — only 1 document allowed)
```

### Timetable
```
department  ObjectId → Department
section     ObjectId → Section
timetable   Object (nested: { day: { period: { facultyId, facultyName, subjectId, subjectName, subjectCode } } })
```

---

## Timetable Generation Logic

The core algorithm lives in `utils/timetableGenerator.js`:

1. **Fetch settings** — reads `numberOfPeriods` from the Settings singleton.
2. **Filter faculty** — queries faculty by both `departmentId` AND `sectionId` to ensure only relevant assignments are used.
3. **Initialize empty timetable** — creates a `{ day: { period: null } }` structure for all 5 days × N periods.
4. **Fill slots** — for each day/period combination:
   - Finds all faculty available at that slot (via their `availability` array).
   - Sorts available faculty by usage count (ascending) to distribute load evenly.
   - Assigns the least-used faculty member to that slot.
5. **Persist** — saves or updates the generated timetable in the `Timetable` collection (upsert by department + section).

### Conflict Prevention (Double Layer)

**Frontend:** When name or section changes in the faculty form, the app scans all existing faculty records and marks conflicting slots red/disabled before the user even submits.

**Backend:** The `facultyController` re-validates on every POST/PUT:
- Checks if the same faculty name already has an overlapping slot in another section.
- Checks if any other faculty member is already teaching the same section at that slot.
- Returns a descriptive error message identifying the conflicting faculty, section, day, and period(s).

---

## Default Settings

| Setting | Default Value |
|---------|--------------|
| Start Time | 9:00 AM |
| End Time | 5:00 PM |
| Period Duration | 60 minutes |
| Number of Periods | 6 |
| Lunch Break | 1:00 PM – 2:00 PM (enabled) |
| Short Break | 11:00 AM – 11:15 AM (disabled) |

---

## Notes

- 1st year sections are excluded from the section picker (filtered at API level: `year: { $gt: 1 }`).
- Each department gets 36 sections (12 per year × 3 years) when seeded.
- The Settings model enforces singleton behavior via a `pre('save')` hook — only one settings document can exist.
- CORS is configured for `http://localhost:5173` (Vite dev server). Update `index.js` for production.
