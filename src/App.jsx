import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Booking from "./pages/Booking";
import Students from "./pages/Students";
import Toolkit from "./pages/Toolkit";
import Settings from "./pages/Settings";
import UsersTablePage from "./pages/UsersTablePage";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Using a new key to reset user's previous preference and force dark mode
    const savedTheme = localStorage.getItem("primeboard_theme");
    return savedTheme !== "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("primeboard_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <Router>
      <Sidebar />
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main className="pt-20 pb-8 px-4 sm:px-6 md:px-8 md:ml-64 min-h-screen overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/students" element={<Students />} />
          <Route path="/toolkit" element={<Toolkit />} />
          <Route path="/settings" element={<Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/students/users" element={<UsersTablePage />} />
        </Routes>
      </main>
    </Router>
  );
}
