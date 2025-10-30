import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import UsersTable from "./UsersTable.jsx";
import ShiftModal from "./ShiftModal.jsx";

const UserHome = () => {
  const [user, setUser] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const computeTotals = (list) => {
    let totalHrs = 0;
    list.forEach((s) => {
      if (s.start_time && s.end_time) {
        const start = new Date(s.start_time);
        const end = new Date(s.end_time);
        totalHrs += (end - start) / (1000 * 60 * 60);
      }
    });
    setTotalHours(totalHrs.toFixed(1));
    setTotalTokens((totalHrs * 10).toFixed(0));
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const resUser = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await resUser.json().catch(() => null);
        setUser(userData);

        let list = [];
        try {
          const resShifts = await fetch("/api/shifts/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resShifts.ok) {
            list = await resShifts.json();
          } else {
            list = JSON.parse(localStorage.getItem("draft_shifts") || "[]");
          }
        } catch {
          list = JSON.parse(localStorage.getItem("draft_shifts") || "[]");
        }

        setShifts(list);
        computeTotals(list);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleCreated = (newShift) => {
    const updated = [newShift, ...shifts];
    setShifts(updated);
    computeTotals(updated);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mt-32 text-center text-lg text-gray-600">
          Loading dashboard...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="mt-28 px-8 md:px-16">
        <h1 className="text-3xl font-bold mb-6 text-neutral-800">
          Welcome back, {user?.name || "User"} 👋
        </h1>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase">
              Total Hours Worked
            </h2>
            <p className="text-3xl font-bold mt-2 text-indigo-600">
              {totalHours}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase">
              Time Tokens Earned
            </h2>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {totalTokens}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase">
              Shifts Completed
            </h2>
            <p className="text-3xl font-bold mt-2 text-blue-600">
              {shifts.length}
            </p>
          </div>
        </div>

        {/* HEADER + BUTTON SIDE BY SIDE */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-neutral-700">
            Your Shifts
          </h2>
          <button
            className="rounded-xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
            onClick={() => setModalOpen(true)}
          >
            + Log New Shift
          </button>
        </div>

        {shifts.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table className="min-w-full bg-white text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Start Time</th>
                  <th className="px-6 py-3">End Time</th>
                  <th className="px-6 py-3">Approved</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">{shift.task}</td>
                    <td className="px-6 py-3">
                      {shift.start_time
                        ? new Date(shift.start_time).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-6 py-3">
                      {shift.end_time
                        ? new Date(shift.end_time).toLocaleString()
                        : "In progress"}
                    </td>
                    <td className="px-6 py-3">{shift.approved ? "✅" : "⏳"}</td>
                    <td className="px-6 py-3">
                      {shift._pending ? (
                        <span className="text-xs rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1">
                          pending (local)
                        </span>
                      ) : (
                        <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1">
                          saved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">
            You haven’t logged any shifts yet.
          </p>
        )}
      </section>

      <ShiftModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
};

export default UserHome;