<div align="center">

# ⚡ TaskFlow PRO

**Enterprise project management dashboard with Kanban, analytics, dark mode, and full English/Arabic (RTL) support.**

[Live Demo](https://habibafarhan.github.io/taskflow-pro/)



</div>

---

## Features

- **Analytics Dashboard**: live KPI cards plus interactive Line, Bar, and Donut charts (Recharts) computed from real task data.
- **Kanban Board**: drag & drop between columns and reordering within a column (`@hello-pangea/dnd`), with full keyboard support.
- **Task Management**: create tasks with priority (High / Medium / Low), assignee, due date, and status; animated deletion.
- **Bilingual UI (EN / AR)**: custom lightweight i18n built on React Context, with complete RTL layout mirroring (sidebar, drawer, charts, animations) and a Cairo font for Arabic.
- **Dark / Light Mode**: persisted preference with no flash of unstyled content on load.
- **Persistent State**: tasks, theme, and language are saved to `localStorage`.
- **Smooth Animations**: page transitions, staggered card entrances, and animated sidebar (Framer Motion).
- **Fully Responsive**: collapsible sidebar on desktop, slide-in drawer on mobile.
- **Accessibility**: ARIA roles and labels, focus-visible styles, skip link, Escape-to-close dialogs.
- **Polished Empty States**: dashboard, board columns, and deadlines.

##  Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router DOM |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| Drag & Drop | @hello-pangea/dnd |
| Icons | Lucide React |

##  Architecture

```
src/
├── components/     # Reusable UI (Sidebar)
├── context/        # TaskContext (useReducer), ThemeContext, LanguageContext
├── data/           # Constants and mock data
├── i18n/           # Translation dictionaries (EN / AR)
├── pages/          # Dashboard, KanbanBoard
├── App.jsx         # Routes + page transitions
└── main.jsx        # Providers and entry point
```

**Key decisions**

- **`useReducer` + Context** centralizes all task mutations in one predictable reducer; derived stats are memoized with `useMemo`.
- **A single `moveTask` action** handles both cross-column moves and in-column reordering.
- **Separation of concerns**: constants, mock data, and translations live outside components.
- **Custom i18n** instead of a heavy library: `t()` with interpolation, locale-aware date formatting, and automatic `dir` / `lang` updates on the `<html>` element.

## Getting Started

```bash
git clone https://github.com/your-username/taskflow-pro.git
cd taskflow-pro
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

##  Screenshots

| Light | Dark | Arabic (RTL) | Mobile |
|---|---|---|---|
| ![](./screenshots/dashboard-light.png) | ![](./screenshots/dashboard-dark.png) | ![](./screenshots/board-rtl.png) | ![](./screenshots/mobile.png) |

##  Roadmap

- [ ] Edit task modal
- [ ] Search and filter by priority / assignee
- [ ] Code splitting with `React.lazy`
- [ ] Backend integration (REST API + authentication)
- [ ] Unit tests with Vitest and React Testing Library

 
