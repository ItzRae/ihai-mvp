
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar.jsx";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Always two columns */}
      <div className="mx-auto flex flex-row gap-4">
        {/* Fixed-width sidebar */}
        <aside className="w-56 shrink-0 rounded-xl border border-stone-200 bg-white p-4 shadow">
          <Sidebar />
        </aside>

        {/* Content fills the rest */}
        <main className="flex-1 min-w-0 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
