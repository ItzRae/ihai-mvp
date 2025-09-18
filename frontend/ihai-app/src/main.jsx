
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";

import AdminLayout from "./Admin/AdminLayout.jsx";
import Dashboard from "./Admin/Dashboard/Dashboard.jsx";
import Calendar from "./Admin/Sidebar/Calendar.jsx"; // <-- new

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />   {/* new */}
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </BrowserRouter>
);
