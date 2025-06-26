# 🗂️ Kanban Board

A simple Kanban board web application built with **React + TypeScript**, inspired by Trello. It allows you to manage tasks in fixed and custom columns using **drag and drop** functionality.

## ✨ Features

- ✅ Four fixed columns: `Backlog`, `Doing`, `Review`, `Done`
- ➕ Add new columns with custom titles
- 📝 Add tasks to any column
- 🔁 Reorder tasks using drag and drop (`react-beautiful-dnd`)
- 💾 Tasks and columns are saved to `localStorage`

## 📸 Preview

![App Screenshot](./screenshot.png)

## 🚀 Technologies

- React
- TypeScript
- Vite
- TailwindCSS
- react-beautiful-dnd
- uuid

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Steps

```bash
# Clone the repository
git clone https://github.com/YneLys/kanban-board.git
cd kanban-board

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open your browser at: `http://localhost:5173`

## 🗃️ Folder Structure

```
kanban-board/
├── public/
│   └── index.html
├── src/
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── localStorage.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 📄 License

This project is licensed under the MIT License.
