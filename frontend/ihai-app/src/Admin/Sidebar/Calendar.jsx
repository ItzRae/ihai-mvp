
import React, { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiEye, FiEyeOff } from "react-icons/fi";

/* =============== Helpers =============== */
const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pxPerHour = 48; // height per hour (tweak to taste)
const pxPerMinute = pxPerHour / 60; // converts minutes to px

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const addYears = (d, n) => new Date(d.getFullYear() + n, d.getMonth(), 1);
const startOfWeekSun = (d) => addDays(d, -((d.getDay() + 7) % 7));
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const minutesSinceStart = (date) => date.getHours() * 60 + date.getMinutes();
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* =============== Sample data (replace with real) =============== */
const calendarsSeed = [
  // mine
  { id: "me", name: "Worker#1", color: "#7c3aed", group: "mine" },
  { id: "workers", name: "Worker#2", color: "#f59e0b", group: "mine" },
  { id: "tasks", name: "Worker#3", color: "#0ea5e9", group: "mine" },
  // team
  { id: "rachel", name: "Rachel", color: "#10b981", group: "team" },
  { id: "sam", name: "Hewan", color: "#ef4444", group: "team" },
];

const sampleEvents = [
  { id: "e1", calId: "me",     title: "1:1 with sponsor", start: "2025-09-17T13:00:00", end: "2025-09-17T14:30:00" },
  { id: "e2", calId: "family", title: "Pick up nephew",   start: "2025-09-17T16:30:00", end: "2025-09-17T17:30:00" },
  { id: "e3", calId: "tasks",  title: "Social post",      start: "2025-09-17T09:00:00", end: "2025-09-17T09:45:00" },
  { id: "e4", calId: "rachel", title: "Grant review",     start: "2025-09-18T11:00:00", end: "2025-09-18T12:30:00" },
  { id: "e5", calId: "sam",    title: "Budget sync",      start: "2025-09-19T15:00:00", end: "2025-09-19T16:00:00" },
];

/* =============== Page =============== */
export default function CalendarPage() {
  const [view, setView] = useState("week"); // 'day' | 'week' | 'month' | 'year'
  const [anchor, setAnchor] = useState(() => startOfWeekSun(new Date())); // navigation anchor
  const [selectedDate, setSelectedDate] = useState(new Date());           // what we highlight
  const [calendars, setCalendars] = useState(() =>
    calendarsSeed.map((c) => ({ ...c, visible: c.group === "mine" })) // mine on, team off by default
  );
  const [events] = useState(() =>
    sampleEvents.map((e) => ({ ...e, start: new Date(e.start), end: new Date(e.end) }))
  );

  // derived subsets
  const myCals = calendars.filter((c) => c.group === "mine");
  const teamCals = calendars.filter((c) => c.group === "team");

  const toggleCal = (id) =>
    setCalendars((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));

  /* ---------- toolbar nav ---------- */
  const goToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setAnchor(startOfWeekSun(today));
  };

  const goPrev = () =>
    setAnchor(
      view === "year"  ? addYears(anchor, -1)  :
      view === "month" ? addMonths(anchor, -1) :
      view === "day"   ? addDays(anchor, -1)   :
                         addDays(anchor, -7)    // week
    );

  const goNext = () =>
    setAnchor(
      view === "year"  ? addYears(anchor,  1)  :
      view === "month" ? addMonths(anchor,  1) :
      view === "day"   ? addDays(anchor,  1)   :
                         addDays(anchor,  7)    // week
    );

  /* ---------- visible events ---------- */
  const visibleCalIds = useMemo(
    () => new Set(calendars.filter((c) => c.visible).map((c) => c.id)),
    [calendars]
  );
  const colorByCal = useMemo(() => {
    const map = new Map();
    calendars.forEach((c) => map.set(c.id, c.color));
    return map;
  }, [calendars]);

  return (
    <div className="grid grid-cols-[280px_1fr] min-h-[80vh] gap-4">
      {/* Sidebar */}
      <aside className="rounded-xl border border-stone-200 bg-white p-3">
        <div className="mb-4">
          <MiniMonth
            anchor={view === "month" ? anchor : startOfWeekSun(anchor)}
            selected={selectedDate}
            onPick={(d) => {
              setSelectedDate(d);
              setAnchor(startOfWeekSun(d));
            }}
          />
        </div>

        <Section title="My calendars">
          {myCals.map((c) => (
            <CalRow key={c.id} cal={c} onToggle={() => toggleCal(c.id)} />
          ))}
        </Section>

        <Section title="Team calendars">
          {teamCals.map((c) => (
            <CalRow key={c.id} cal={c} onToggle={() => toggleCal(c.id)} />
          ))}
        </Section>
      </aside>

      {/* Main */}
      <main className="rounded-xl border border-stone-200 bg-white">
        <Toolbar
          view={view}
          setView={setView}
          anchor={anchor}
          goPrev={goPrev}
          goNext={goNext}
          goToday={goToday}
          selected={selectedDate}
          setAnchor={setAnchor}
        />

        {view === "week" && (
          <WeekView
            anchor={anchor}
            selected={selectedDate}
            events={events.filter((e) => visibleCalIds.has(e.calId))}
            colorByCal={colorByCal}
          />
        )}

        {view === "month" && (
          <MonthView
            anchor={anchor}
            selected={selectedDate}
            events={events.filter((e) => visibleCalIds.has(e.calId))}
            colorByCal={colorByCal}
            onDayClick={(d) => {
              setSelectedDate(d);
              setAnchor(startOfWeekSun(d));
              setView("week");
            }}
          />
        )}

        {view === "year" && (
          <YearView
            anchor={anchor}
            selected={selectedDate}
            onDayClick={(d) => {
              setSelectedDate(d);
              setAnchor(new Date(d.getFullYear(), d.getMonth(), 1));
              setView("month"); // jump into that month
            }}
          />
        )}

        {view === "day" && (
          <DayView
            anchor={anchor}
            selected={selectedDate}
            events={events.filter((e) => visibleCalIds.has(e.calId))}
            colorByCal={colorByCal}
          />
        )}
      </main>
    </div>
  );
}

/* =============== UI bits =============== */

function Toolbar({ view, setView, anchor, goPrev, goNext, goToday, selected, setAnchor }) {
  const title =
    view === "year"
      ? anchor.getFullYear()
      : view === "month"
      ? anchor.toLocaleDateString(undefined, { month: "long", year: "numeric" })
      : view === "day"
      ? startOfDay(anchor).toLocaleDateString(undefined, {
          weekday: "long", month: "long", day: "numeric", year: "numeric",
        })
      : `${anchor.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${addDays(
          anchor,
          6
        ).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          className="rounded border border-stone-300 bg-white px-3 py-1.5 text-sm hover:bg-stone-100"
          onClick={goToday}
        >
          Today
        </button>
        <button className="rounded p-2 hover:bg-stone-100" onClick={goPrev} aria-label="Previous">
          <FiChevronLeft />
        </button>
        <button className="rounded p-2 hover:bg-stone-100" onClick={goNext} aria-label="Next">
          <FiChevronRight />
        </button>

        <div className="ml-2 text-base font-semibold">{title}</div>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={view}
          onChange={(e) => {
            const v = e.target.value;
            setView(v);
            // snap the anchor to something sensible for each view
            if (v === "day")   setAnchor(startOfDay(selected));
            if (v === "week")  setAnchor(startOfWeekSun(selected));
            if (v === "month") setAnchor(new Date(selected.getFullYear(), selected.getMonth(), 1));
            if (v === "year")  setAnchor(new Date(selected.getFullYear(), 0, 1));
          }}
          className="rounded border border-stone-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <div className="text-xs text-stone-500">Time zone: {TZ}</div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function CalRow({ cal, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 hover:bg-stone-100"
    >
      <span className="flex items-center gap-2 text-sm">
        <span
          className="inline-block size-3 rounded-sm"
          style={{ backgroundColor: cal.color }}
        />
        {cal.name}
      </span>
      <span className="text-stone-500">
        {cal.visible ? <FiEye className="size-4" /> : <FiEyeOff className="size-4" />}
      </span>
    </button>
  );
}

/* ---------- Week View ---------- */
function WeekView({ anchor, selected, events, colorByCal }) {
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(anchor, i)), [anchor]);
  const containerHeight = pxPerHour * 24;

  // today's red line
  const now = new Date();
  const showNow = now >= startOfDay(days[0]) && now <= addDays(startOfDay(days[6]), 1);
  const nowTop = minutesSinceStart(now) * pxPerMinute;

  return (
    <div className="relative">
      <div className="grid grid-cols-[60px_repeat(7,1fr)]">
        <div className="border-r border-stone-200" />
        {days.map((d, i) => (
          <div
            key={i}
            className="border-b border-l border-stone-200 px-2 py-2 text-center text-sm"
          >
            <div className="font-medium">{DAYS[d.getDay()]}</div>
            <div
              className={`inline-flex size-7 items-center justify-center rounded-full ${
                sameDay(d, selected) ? "bg-stone-900 text-white" : "text-stone-700"
              }`}
            >
              {d.getDate()}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[60px_repeat(7,1fr)]">
        {/* time gutter */}
        <div className="relative">
          <div style={{ height: containerHeight }} className="relative">
            {HOURS.map((h) => (
              <div key={h} className="h-[48px] border-b border-stone-100 pr-2 text-right text-xs text-stone-500">
                {h === 0 ? "" : `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`}
              </div>
            ))}
          </div>
        </div>

        {/* 7 day columns */}
        {days.map((day, di) => {
          const dayStart = startOfDay(day);
          const dayEnd = addDays(dayStart, 1);

          const dayEvents = events
            .filter((e) => e.start < dayEnd && e.end > dayStart)
            .map((e) => {
              const topMin = clamp((e.start < dayStart ? 0 : minutesSinceStart(e.start)), 0, 24 * 60);
              const bottomMin = clamp((e.end > dayEnd ? 24 * 60 : minutesSinceStart(e.end)), 0, 24 * 60);
              const minHeight = Math.max(25, bottomMin - topMin);
              return {
                ...e,
                top: topMin * pxPerMinute,
                height: minHeight * pxPerMinute,
              };
            });

          return (
            <div key={di} className="relative border-l border-stone-200">
              <div style={{ height: containerHeight }}>
                {HOURS.map((h) => (
                  <div key={h} className="h-[48px] border-b border-stone-100" />
                ))}
              </div>

              <div className="absolute inset-0">
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="absolute left-1 right-1 overflow-hidden rounded-md border text-xs shadow-sm"
                    style={{
                      top: ev.top,
                      height: ev.height,
                      backgroundColor: `${(colorByCal.get(ev.calId) || "#6366f1")}15`,
                      borderColor: colorByCal.get(ev.calId) || "#6366f1",
                    }}
                    title={ev.title}
                  >
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: colorByCal.get(ev.calId) || "#6366f1" }}
                    />
                    <div className="p-1">
                      <div className="truncate font-medium">{ev.title}</div>
                    </div>
                  </div>
                ))}
              </div>

              {showNow && sameDay(day, now) && (
                <div
                  className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
                  style={{ top: nowTop }}
                >
                  <span className="size-2 rounded-full bg-red-500" />
                  <div className="h-px flex-1 bg-red-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Month View ---------- */
function MonthView({ anchor, selected, events, colorByCal, onDayClick }) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const firstDow = (first.getDay() + 7) % 7; // Sun=0..Sat=6
  const firstCell = new Date(first);
  firstCell.setDate(1 - firstDow);

  const cells = Array.from({ length: 42 }, (_, i) => addDays(firstCell, i));
  const monthIdx = anchor.getMonth();

  const eventsByDay = useMemo(() => {
    const map = new Map();
    events.forEach((e) => {
      const dayKey = startOfDay(e.start).toISOString();
      if (!map.has(dayKey)) map.set(dayKey, []);
      map.set(dayKey, [...map.get(dayKey), e]);
    });
    return map;
  }, [events]);

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-stone-200 text-center text-xs text-stone-500">
        {DAYS.map((d) => (
          <div key={d} className="px-2 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-stone-200">
        {cells.map((d, i) => {
          const key = startOfDay(d).toISOString();
          const inMonth = d.getMonth() === monthIdx;
          const dayEvents = eventsByDay.get(key) || [];

          return (
            <button
              key={i}
              className={`h-36 bg-white p-2 text-left ${inMonth ? "" : "bg-stone-50 text-stone-400"}`}
              onClick={() => onDayClick?.(d)}
            >
              <div className="mb-1 flex items-center justify-between">
                <div
                  className={`inline-flex size-6 items-center justify-center rounded-full text-sm ${
                    sameDay(d, selected) ? "bg-stone-900 text-white" : ""
                  }`}
                >
                  {d.getDate()}
                </div>
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    className="truncate rounded px-1.5 py-0.5 text-xs"
                    style={{ backgroundColor: `${(colorByCal.get(e.calId) || "#6366f1")}14`, color: "#111" }}
                    title={e.title}
                  >
                    <span
                      className="mr-1 inline-block size-2 rounded-sm align-middle"
                      style={{ backgroundColor: colorByCal.get(e.calId) || "#6366f1" }}
                    />
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-stone-500">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Year View (12 mini months) ---------- */
function YearView({ anchor, selected, onDayClick }) {
  const year = anchor.getFullYear();
  const months = Array.from({ length: 12 }, (_, m) => new Date(year, m, 1));
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  return (
    <div className="p-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((first, idx) => {
          const firstDow = (first.getDay() + 7) % 7; // Sun=0
          const startCell = new Date(first); startCell.setDate(1 - firstDow);
          const cells = Array.from({ length: 42 }, (_, i) =>
            new Date(startCell.getFullYear(), startCell.getMonth(), startCell.getDate() + i)
          );

          return (
            <div key={idx} className="rounded-lg border border-stone-200 bg-white p-2">
              <div className="mb-1 text-center text-sm font-medium">{monthNames[idx]}</div>

              <div className="grid grid-cols-7 text-center text-[10px] text-stone-500 mb-1">
                {["S","M","T","W","T","F","S"].map((d) => <div key={d}>{d}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((d, i) => {
                  const inMonth = d.getMonth() === first.getMonth();
                  const isSel =
                    selected &&
                    d.getFullYear() === selected.getFullYear() &&
                    d.getMonth() === selected.getMonth() &&
                    d.getDate() === selected.getDate();

                  return (
                    <button
                      key={i}
                      onClick={() => onDayClick?.(d)}
                      className={`h-7 w-7 rounded-full text-xs flex items-center justify-center
                        ${inMonth ? "text-stone-800" : "text-stone-400"}
                        ${isSel ? "bg-stone-900 text-white" : "hover:bg-stone-100"}`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Mini month (sidebar) ---------- */
function MiniMonth({ anchor, selected, onPick }) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const firstDow = (first.getDay() + 7) % 7;
  const firstCell = new Date(first); firstCell.setDate(1 - firstDow);

  const cells = Array.from({ length: 42 }, (_, i) => addDays(firstCell, i));
  const monthIdx = anchor.getMonth();

  return (
    <div className="rounded-lg border border-stone-200 p-2">
      <div className="mb-2 text-center text-xs font-medium">
        {anchor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-stone-500 mb-1">
        {["S","M","T","W","T","F","S"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          const inMonth = d.getMonth() === monthIdx;
          const isSelected = selected && sameDay(d, selected);
          return (
            <button
              key={i}
              onClick={() => onPick(d)}
              className={`h-6 w-8 rounded-full text-xs flex items-center justify-center
                ${inMonth ? "text-stone-800" : "text-stone-400"}
                ${isSelected ? "bg-stone-900 text-white" : "hover:bg-stone-100"}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Day View ---------- */
function DayView({ anchor, selected, events, colorByCal }) {
  const day = startOfDay(anchor);
  const nextDay = addDays(day, 1);
  const containerHeight = pxPerHour * 24;

  const dayEvents = events
    .filter((e) => e.start < nextDay && e.end > day)
    .map((e) => {
      const topMin = clamp((e.start < day ? 0 : minutesSinceStart(e.start)), 0, 24 * 60);
      const bottomMin = clamp((e.end > nextDay ? 24 * 60 : minutesSinceStart(e.end)), 0, 24 * 60);
      const minHeight = Math.max(25, bottomMin - topMin);
      return {
        ...e,
        top: topMin * pxPerMinute,
        height: minHeight * pxPerMinute,
      };
    });

  const now = new Date();
  const showNow = sameDay(now, day);
  const nowTop = minutesSinceStart(now) * pxPerMinute;

  return (
    <div className="relative">
      {/* header row */}
      <div className="grid grid-cols-[60px_1fr]">
        <div className="border-r border-stone-200" />
        <div className="border-b border-l border-stone-200 px-2 py-2 text-center text-sm">
          <div className="font-medium">{DAYS[day.getDay()]}</div>
          <div
            className={`inline-flex size-7 items-center justify-center rounded-full ${
              sameDay(day, selected) ? "bg-stone-900 text-white" : "text-stone-700"
            }`}
          >
            {day.getDate()}
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-[60px_1fr]">
        {/* time gutter */}
        <div className="relative">
          <div style={{ height: containerHeight }}>
            {HOURS.map((h) => (
              <div
                key={h}
                className="h-[48px] border-b border-stone-100 pr-2 text-right text-xs text-stone-500"
              >
                {h === 0 ? "" : `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`}
              </div>
            ))}
          </div>
        </div>

        {/* day column */}
        <div className="relative border-l border-stone-200">
          {/* hour lines */}
          <div style={{ height: containerHeight }}>
            {HOURS.map((h) => (
              <div key={h} className="h-[48px] border-b border-stone-100" />
            ))}
          </div>

          {/* events */}
          <div className="absolute inset-0">
            {dayEvents.map((ev) => (
              <div
                key={ev.id}
                className="absolute left-2 right-2 overflow-hidden rounded-md border text-xs shadow-sm"
                style={{
                  top: ev.top,
                  height: ev.height,
                  backgroundColor: `${(colorByCal.get(ev.calId) || "#6366f1")}15`,
                  borderColor: colorByCal.get(ev.calId) || "#6366f1",
                }}
                title={ev.title}
              >
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: colorByCal.get(ev.calId) || "#6366f1" }}
                />
                <div className="p-1">
                  <div className="truncate font-medium">{ev.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* now line */}
          {showNow && (
            <div
              className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
              style={{ top: nowTop }}
            >
              <span className="size-2 rounded-full bg-red-500" />
              <div className="h-px flex-1 bg-red-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
