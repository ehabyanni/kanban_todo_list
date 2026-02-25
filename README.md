# Kanban Board

A high-performance Kanban Board application built with **Next.js 15** and **TanStack Query**. This project features a smooth drag-and-drop experience, server-side searching, and infinite scrolling for optimal data handling.

## Key Features

- **Drag and Drop:** Effortlessly reorder and move tasks between columns (Todo, In Progress, Done) using `@hello-pangea/dnd`.
- **Infinite Scrolling:** Loads data incrementally (**4 tasks per page**) to ensure fast initial load times and smooth performance.
- **Server-Side Search:** Real-time filtering across titles and descriptions directly via API queries using the `q` parameter.
- **Debounced Input:** Intelligent search bar that waits **500ms** after typing to prevent unnecessary API calls and improve performance.
- **Live Task Counter:** A dynamic header that accurately counts currently displayed tasks by subscribing to the React Query cache.
- **Modern UI/UX:** Built with **Material UI (MUI)** and **Tailwind CSS** for a clean, professional, and responsive design.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **State Management:** TanStack Query v5 (React Query)
- **Styling:** Material UI (MUI) & Tailwind CSS
- **Drag & Drop:** @hello-pangea/dnd
- **API Client:** Axios & Fetch API
- **Backend Simulation:** JSON Server

---

## Setup Instructions

Follow these steps to get the project up and running locally:

```bash
### 1. Clone the Repository
git clone [https://github.com/ehabyanni/kanban_todo_list.git](https://github.com/ehabyanni/kanban_todo_list.git)
cd kanban_todo_list

### 2. Install Dependencies
npm install

### 3. Start the Mock Backend
npx json-server --watch db.json --port 4000

### 4. Start the Development Server
npm run dev
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
```
