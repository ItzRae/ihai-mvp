import React, { useState } from "react";

const ShiftModal = ({ isOpen, onClose, onCreated }) => {
  const [task, setTask] = useState("");
  const [start, setStart] = useState(""); // datetime-local
  const [end, setEnd] = useState("");     // datetime-local
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const reset = () => {
    setTask("");
    setStart("");
    setEnd("");
    setError("");
  };

  const toISO = (val) => {
    if (!val) return null;
    // datetime-local yields "YYYY-MM-DDTHH:mm" (no tz). Convert to ISO with local tz.
    const d = new Date(val);
    return d.toISOString(); // backend expects ISO; adjust if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!task.trim() || !start) {
      setError("Please provide a task and start time.");
      return;
    }

    setSubmitting(true);

    const payload = {
      task: task.trim(),
      start_time: toISO(start),
      end_time: end ? toISO(end) : null,
    };

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch("/api/shifts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Backend not ready? Save locally so the UI still works for demos.
        const local = JSON.parse(localStorage.getItem("draft_shifts") || "[]");
        const temp = {
          id: `temp-${Date.now()}`,
          task: payload.task,
          start_time: payload.start_time,
          end_time: payload.end_time,
          approved: false,
          _pending: true, // mark as pending (offline)
        };
        local.unshift(temp);
        localStorage.setItem("draft_shifts", JSON.stringify(local));
        onCreated(temp);
        reset();
        onClose();
        return;
      }

      const created = await res.json();
      onCreated(created);
      reset();
      onClose();
    } catch {
      // Network failure: same local-storage fallback
      const local = JSON.parse(localStorage.getItem("draft_shifts") || "[]");
      const temp = {
        id: `temp-${Date.now()}`,
        task: payload.task,
        start_time: payload.start_time,
        end_time: payload.end_time,
        approved: false,
        _pending: true,
      };
      local.unshift(temp);
      localStorage.setItem("draft_shifts", JSON.stringify(local));
      onCreated(temp);
      reset();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={submitting ? undefined : onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Log a New Shift</h3>
        <p className="text-xs text-gray-500 mb-4">
          Enter your shift details. End time is optional if you’re still working.
        </p>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="e.g., Staffed community help desk"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End (optional)</label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Shift"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShiftModal;