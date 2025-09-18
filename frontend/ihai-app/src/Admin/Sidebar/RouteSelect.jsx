
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome, FiUsers, FiPaperclip, FiLink, FiDollarSign, FiCalendar, FiFilter,
} from "react-icons/fi";

export const RouteSelect = ({ onOpenFilters }) => {
  return (
    <nav className="mt-3 space-y-1">
      <Nav icon={FiHome} to="/admin" label="Dashboard" end />
      <Nav icon={FiCalendar} to="/admin/calendar" label="Calendar" />

      {/* Filters behaves like a normal row but triggers the overlay */}
      <Btn icon={FiFilter} label="Filters" onClick={onOpenFilters} />

      <Nav icon={FiUsers} to="#" label="Team" />
      <Nav icon={FiPaperclip} to="#" label="Invoices" />
      <Nav icon={FiLink} to="#" label="Integrations" />
      <Nav icon={FiDollarSign} to="#" label="Finance" />
    </nav>
  );
};

function Nav({ icon: Icon, to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 w-full rounded px-2 py-1.5 text-sm transition
         ${isActive ? "bg-white text-stone-950 shadow" : "hover:bg-stone-200 text-stone-600"}`
      }
    >
      {({ isActive }) => (
        <Icon className={`shrink-0 ${isActive ? "text-violet-500" : "text-stone-500"}`} />
      )}
      <span>{label}</span>
    </NavLink>
  );
}

function Btn({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-stone-600 hover:bg-stone-200"
    >
      <Icon className="shrink-0 text-stone-500" />
      <span>{label}</span>
    </button>
  );
}
