// src/Admin/Dashboard/RecentTransactions.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiClock,
  FiMoreHorizontal,
  FiExternalLink,
  FiEdit2,
  FiMail,
  FiCopy,
  FiRotateCcw,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

/* --------------------- Sample data --------------------- */
const initialRows = [
  { cusId: "#48149", description: "Social media post", ts: "2025-08-02T10:22:00", hours: 1.0,  status: "approved" },
  { cusId: "#1942s", description: "Work w/ sponsor",   ts: "2025-08-02T09:05:00", hours: 2.5,  status: "pending"  },
  { cusId: "#4192",  description: "Review timesheets", ts: "2025-08-01T08:41:00", hours: 0.75, status: "rejected" },
  { cusId: "#99481", description: "Social media post", ts: "2025-08-01T13:10:00", hours: 1.25, status: "approved" },
  { cusId: "#1304",  description: "Work w/ sponsor",   ts: "2025-08-01T15:32:00", hours: 0.5,  status: "pending"  },
  { cusId: "#1305",  description: "Review timesheets", ts: "2025-07-31T17:05:00", hours: 3.0,  status: "approved" },
];

/* ------------------------------ Utilities ------------------------------ */
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const today = new Date();
today.setHours(0, 0, 0, 0);

function fmtMMDDYYYY(d) {
  if (!d) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getFullYear()}`;
}
function fmtDisplay(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString([], {
      year: "2-digit",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch { return ts; }
}
function startOfMonth(d) { const x = new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x; }
function addMonths(d, n) { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; }
function sameDay(a, b) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

/* --------------------------- Tiny Calendar UI -------------------------- */
function CalendarPopover({ value, onSelect, onClose, anchorRight = true }) {
  const init = value ? new Date(value) : new Date();
  const [view, setView] = useState(startOfMonth(init > today ? today : init));
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose?.(); };
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // ±15 years around current year (31 total)
  const years = Array.from({ length: 31 }, (_, i) => today.getFullYear() - 15 + i);

  const weeks = [];
  const firstDow = (view.getDay() + 6) % 7; // Monday = 0
  const firstCell = new Date(view); firstCell.setDate(1 - firstDow);
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      const cell = new Date(firstCell); cell.setDate(firstCell.getDate() + w * 7 + d);
      row.push({
        cell,
        inMonth: cell.getMonth() === view.getMonth(),
        disabled: cell > today,
      });
    }
    weeks.push(row);
  }

  return (
    <div
      ref={ref}
      className={`absolute z-20 mt-2 w-64 rounded-md border border-stone-200 bg-white shadow-lg ${anchorRight ? "right-0" : ""}`}
    >
      <div className="flex items-center justify-between border-b border-stone-200 px-2 py-1.5">
        <button className="rounded p-1 hover:bg-stone-100" onClick={() => setView(addMonths(view, -1))}>
          <FiChevronLeft />
        </button>
        <div className="flex items-center gap-2">
          <select
            className="rounded border border-stone-200 px-1 py-0.5 text-xs"
            value={view.getMonth()}
            onChange={(e) => { const v = new Date(view); v.setMonth(Number(e.target.value)); setView(startOfMonth(v)); }}
          >
            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select
            className="rounded border border-stone-200 px-1 py-0.5 text-xs"
            value={view.getFullYear()}
            onChange={(e) => { const v = new Date(view); v.setFullYear(Number(e.target.value)); setView(startOfMonth(v)); }}
          >
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button className="rounded p-1 hover:bg-stone-100" onClick={() => setView(addMonths(view, 1))}>
          <FiChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 p-2 text-center text-[11px] text-stone-500">
        {["M","T","W","T","F","S","S"].map(d => <div key={d} className="py-0.5">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 p-2">
        {weeks.flatMap((row, ri) =>
          row.map(({ cell, inMonth, disabled }, ci) => {
            const isToday = sameDay(cell, today);
            const isSel = value && sameDay(cell, value);
            const cls = [
              "rounded p-1 text-sm",
              inMonth ? "text-stone-800" : "text-stone-400",
              disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-stone-100 cursor-pointer",
              isSel ? "bg-violet-100 text-violet-700 border border-violet-200" : "",
              !isSel && isToday ? "border border-stone-300" : "",
            ].join(" ");
            return (
              <button
                key={`${ri}-${ci}`}
                className={cls}
                disabled={disabled}
                onClick={() => onSelect?.(cell)}
              >
                {cell.getDate()}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Main Component ---------------------------- */
export const RecentTransactions = () => {
  const [rows] = useState(initialRows);

  // Filters
  const [status, setStatus] = useState("all"); // all | approved | pending | rejected
  const [hoursMin, setHoursMin] = useState("");
  const [hoursMax, setHoursMax] = useState("");
  const [fromDate, setFromDate] = useState(null); // Date|null
  const [toDate, setToDate] = useState(null);     // Date|null
  const [dateError, setDateError] = useState("");

  // calendar popovers
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const onPick = (which, date) => {
    if (date > today) { setDateError("can't filter on this input"); return; }
    setDateError("");
    which === "from" ? setFromDate(date) : setToDate(date);
    which === "from" ? setOpenFrom(false) : setOpenTo(false);
  };

  const reset = () => {
    setStatus("all");
    setHoursMin("");
    setHoursMax("");
    setFromDate(null);
    setToDate(null);
    setDateError("");
  };

  // Apply filters
  const filtered = useMemo(() => {
    const min = hoursMin === "" ? -Infinity : Number(hoursMin);
    const max = hoursMax === "" ?  Infinity : Number(hoursMax);
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!(r.hours >= min && r.hours <= max)) return false;
      const t = new Date(r.ts).getTime();
      if (fromDate && t < fromDate.getTime()) return false;
      if (toDate) {
        const endOfTo = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 23, 59, 59).getTime();
        if (t > endOfTo) return false;
      }
      return true;
    });
  }, [rows, status, hoursMin, hoursMax, fromDate, toDate]);

  return (
    <div className="col-span-12 rounded border border-stone-300 p-4">
      {/* Header + filter bar */}
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiClock /> Recent Activity
        </h3>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Status dropdown (old control) */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded border border-stone-300 bg-white px-2 py-1 text-xs"
            aria-label="Status"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Hours pill */}
            <div className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-2 py-1 w-[18rem] justify-between">
               <span className="text-[10px] font-medium text-stone-500">Hrs</span>
               <input
                 type="number" step="0.01" inputMode="decimal" placeholder="min"
                 value={hoursMin} onChange={(e)=>setHoursMin(e.target.value)}
                 className="w-[5.5rem] bg-transparent text-xs outline-none placeholder:text-stone-400"
                 onWheel={(e)=>e.currentTarget.blur()}
               />
               <span className="w-6 text-center text-[11px] text-stone-400">to</span>
               <input
                 type="number" step="0.25" inputMode="decimal" placeholder="max"
                 value={hoursMax} onChange={(e)=>setHoursMax(e.target.value)}
                 className="w-[6.5rem] bg-transparent text-xs outline-none placeholder:text-stone-400"
                 onWheel={(e)=>e.currentTarget.blur()}
               />
            </div>

          {/* Date pills (MM/DD/YYYY, calendar popover) */}
          <div className="relative inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-2 py-1">
            <button
              className="min-w-[6.5rem] text-left text-xs text-stone-700"
              onClick={() => { setOpenFrom((v) => !v); setOpenTo(false); }}
              title="From"
            >
              {fromDate ? fmtMMDDYYYY(fromDate) : "MM/DD/YYYY"}
            </button>

            {/* centered “to” */}
            <span className="w-6 text-center text-[11px] text-stone-400">to</span>

            <button
              className="min-w-[6.5rem] text-left text-xs text-stone-700"
              onClick={() => { setOpenTo((v) => !v); setOpenFrom(false); }}
              title="To"
            >
              {toDate ? fmtMMDDYYYY(toDate) : "MM/DD/YYYY"}
            </button>

            {openFrom && (
              <CalendarPopover
                value={fromDate}
                onSelect={(d) => onPick("from", d)}
                onClose={() => setOpenFrom(false)}
              />
            )}
            {openTo && (
              <CalendarPopover
                value={toDate}
                onSelect={(d) => onPick("to", d)}
                onClose={() => setOpenTo(false)}
              />
            )}
          </div>

          {/* Reset */}
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-2 py-1 text-xs hover:bg-stone-100"
            title="Reset filters"
          >
            <FiRotateCcw className="size-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Error for future date pick */}
      {dateError && (
        <div className="mb-2 text-xs font-medium text-red-600">{dateError}</div>
      )}

      {/* Table */}
      <table className="w-full table-auto">
        <TableHead />
        <tbody>
          {filtered.map((r, i) => (
            <TableRow key={r.cusId + i} {...r} order={i + 1} />
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="p-3 text-center text-sm text-stone-500">
                No results match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

/* ------------------------------- Table  ------------------------------ */
const TableHead = () => (
  <thead>
    <tr className="text-sm font-normal text-stone-500">
      <th className="p-1.5 text-start">Customer ID</th>
      <th className="p-1.5 text-start">Description</th>
      <th className="p-1.5 text-start">Time submitted</th>
      <th className="p-1.5 text-start">Hours</th>
      <th className="p-1.5 text-start">Status</th>
      <th className="w-8" />
    </tr>
  </thead>
);

function StatusBadge({ status }) {
  const cls =
    status === "approved"
      ? "bg-green-100 text-green-700 border-green-200"
      : status === "rejected"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-amber-100 text-amber-800 border-amber-200";
  const text = status[0].toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${cls}`}>
      {text}
    </span>
  );
}

function TableRow({ cusId, description, activity, ts, hours, status, order }) {
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);

  // fallback for older data that still uses "activity"
  const desc = description ?? activity ?? "";

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (popRef.current && !popRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copyId = async () => { try { await navigator.clipboard?.writeText(cusId); } catch {} setOpen(false); };

  return (
    <tr className={order % 2 ? "bg-stone-100 text-sm" : "text-sm"}>
      <td className="p-1.5">
        <a href="#" className="flex items-center gap-1 text-violet-600 underline">
          {cusId} <FiArrowUpRight />
        </a>
      </td>
      <td className="p-1.5">{desc}</td>
      <td className="p-1.5">{fmtDisplay(ts)}</td>
      <td className="p-1.5">{hours}</td>
      <td className="p-1.5"><StatusBadge status={status} /></td>

      {/* menu button + popover */}
      <td className="w-8">
        <div className="relative" ref={popRef}>
          <button
            aria-haspopup="menu"
            aria-expanded={open}
            className="grid size-8 place-content-center rounded text-sm transition-colors hover:bg-stone-200"
            onClick={() => setOpen((v) => !v)}
          >
            <FiMoreHorizontal />
          </button>
          {open && (
            <div
              role="menu"
              className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-md border border-stone-200 bg-white shadow-lg"
            >
              <MenuItem onClick={() => setOpen(false)} icon={<FiExternalLink />}>View details</MenuItem>
              <MenuItem onClick={() => setOpen(false)} icon={<FiEdit2 />}>Edit hours</MenuItem>
              <MenuItem onClick={() => setOpen(false)} icon={<FiMail />}>Message customer</MenuItem>
              <MenuItem onClick={copyId} icon={<FiCopy />}>Copy customer ID</MenuItem>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

function MenuItem({ children, icon, onClick }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-stone-100"
    >
      <span className="shrink-0">{icon}</span>
      <span>{children}</span>
    </button>
  );
}
