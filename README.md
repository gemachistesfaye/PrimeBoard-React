<div align="center">

<img src="public/banner.png" alt="Prime Board Banner" width="100%" style="border-radius:12px; height:380px; object-fit:cover;" />

<br/>
<br/>

# Prime Board

**Premium Academic Management Dashboard**

<p align="center">
  <a href="https://prime-board-react.vercel.app"><strong>🌐 Live Demo</strong></a> &nbsp;·&nbsp;
  <a href="#quick-start"><strong>⚡ Quick Start</strong></a> &nbsp;·&nbsp;
  <a href="#screenshots"><strong>📸 Screenshots</strong></a> &nbsp;·&nbsp;
  <a href="#features"><strong>✨ Features</strong></a> &nbsp;·&nbsp;
  <a href="#contributing"><strong>🤝 Contributing</strong></a>
</p>

<br/>

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite_7-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router_7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Recharts](https://img.shields.io/badge/Recharts-22b5bf?style=for-the-badge&logoColor=white)](https://recharts.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://prime-board-react.vercel.app)
![Last Commit](https://img.shields.io/github/last-commit/gemachistesfaye/PrimeBoard-React?style=flat-square&color=6366f1)
![Repo Size](https://img.shields.io/github/repo-size/gemachistesfaye/PrimeBoard-React?style=flat-square&color=10b981)
![Stars](https://img.shields.io/github/stars/gemachistesfaye/PrimeBoard-React?style=flat-square&color=f59e0b)
[![Release](https://img.shields.io/github/v/release/gemachistesfaye/PrimeBoard-React?style=flat-square&color=6366f1)](https://github.com/gemachistesfaye/PrimeBoard-React/releases)

</div>

---

## Overview

**Prime Board** is a high-fidelity academic management dashboard built for universities and institutions. It delivers a seamless dark-mode-first experience for managing students, generating official PDF transcripts and visualizing institutional analytics — all from a single, responsive interface.

---

## Screenshots

| Dashboard | Analytics | Settings |
|:---------:|:---------:|:--------:|
| <img src="docs/screenshots/1-dashboard.png" width="260" alt="Main Dashboard"> | <img src="docs/screenshots/2-analytics.png" width="260" alt="Analytics"> | <img src="docs/screenshots/3-settings.png" width="260" alt="Settings"> |
| **Students Table** | **Add New Student** | **Toolkit** |
| <img src="docs/screenshots/4-users-table.png" width="260" alt="Students Table"> | <img src="docs/screenshots/5-add-new-student.png" width="260" alt="Add Student"> | <img src="docs/screenshots/6-toolkit.png" width="260" alt="Toolkit"> |

---

## Features

| Feature | Description |
|---------|-------------|
| 🌓 **Dark / Light Mode** | OS-preference detection with persistent toggle and glassmorphism aesthetic |
| 🎓 **Student Management** | Full CRUD — add, edit, delete records with GPA tracking and enrollment status |
| 📄 **PDF Transcripts** | One-click professional transcript export via `jspdf` + `jspdf-autotable` |
| 📊 **Live Analytics** | Real-time metrics: tuition tracking, enrollment counts, GPA averages |
| 📅 **Booking System** | Schedule and manage academic appointments with calendar UI |
| 🧰 **Academic Toolkit** | Utility tools for academic workflow management |
| 📱 **Fully Responsive** | Optimized for desktop, tablet and mobile with collapsible sidebar |
| 🔔 **Notifications** | Navbar notification system with dropdown panel |

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 19.x |
| Build tool | Vite | 7.x |
| Styling | Tailwind CSS | 3.x |
| Routing | React Router DOM | 7.x |
| Charts | Recharts | 3.x |
| Icons | Lucide React | 0.575+ |
| PDF export | jsPDF + jspdf-autotable | latest |
| State | React `useState` / `useEffect` | — |

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gemachistesfaye/PrimeBoard-React.git
cd PrimeBoard-React

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Commands

```bash
npm run dev       # Start development server (http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint checks
```

---

## Project Structure

```
PrimeBoard-React/
├── public/                     # Static assets (favicon, banner, logos)
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Top navigation bar with notifications
│   │   ├── Sidebar.jsx         # Collapsible sidebar navigation
│   │   └── Layout.jsx          # Page wrapper component
│   ├── pages/                  # Application views
│   │   ├── Dashboard.jsx       # Main dashboard with metrics
│   │   ├── Analytics.jsx       # Charts and data analytics
│   │   ├── Students.jsx        # Student CRUD + PDF transcript export
│   │   ├── Booking.jsx         # Appointment booking interface
│   │   ├── Toolkit.jsx         # Academic utility tools
│   │   └── Settings.jsx        # Theme and preferences
│   ├── App.jsx                 # Root component and routing setup
│   └── index.css               # Global Tailwind base styles
├── docs/
│   └── screenshots/            # UI screenshots for documentation
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── SECURITY.md
│   ├── CONTRIBUTING.md
│   └── CODE_OF_CONDUCT.md
├── LICENSE
└── package.json
```

---

## Roadmap

- [ ] TypeScript migration — proper type annotations across all components
- [ ] Unit tests with Vitest + React Testing Library
- [ ] Real API integration (REST backend or Supabase)
- [ ] GitHub Actions CI workflow (build + lint on every push)
- [ ] Internationalization (i18n) support
- [ ] Accessibility audit and WCAG compliance
- [ ] Performance profiling & bundle size analysis

---

## Contributing

Contributions are welcome! Please read the [Contributing Guidelines](.github/CONTRIBUTING.md) before submitting a pull request.

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Found a bug? Open a [Bug Report](https://github.com/gemachistesfaye/PrimeBoard-React/issues/new?template=bug_report.md).
Have an idea? Open a [Feature Request](https://github.com/gemachistesfaye/PrimeBoard-React/issues/new?template=feature_request.md).

---

## Security

Please review the [Security Policy](.github/SECURITY.md) before reporting any vulnerabilities. **Do not open public issues for security findings** — email directly instead.

---

## Contact

| Channel | Link |
|---------|------|
| GitHub | [@gemachistesfaye](https://github.com/gemachistesfaye) |
| Email | gemachistesfaye36@gmail.com |

---

## License

Licensed under the [MIT License](LICENSE) — free to use, modify, and distribute with attribution.

---

<div align="center">

Made with care by [Gemachis Tesfaye](https://github.com/gemachistesfaye)

<br/>

If this project helped you, consider giving it a ⭐

</div>