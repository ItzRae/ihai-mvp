import React from "react";
import AuthShell from "./components/AuthShell.jsx";
import Register from "./components/Register.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import AdminLayout from "./Admin/AdminLayout.jsx";
import Dashboard from "./Admin/Dashboard/Dashboard.jsx";
import Calendar from "./Admin/Sidebar/Calendar.jsx"; // <-- new
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserHome from "./components/UserHome.jsx";

function App() {
  const isAuthed = !!localStorage.getItem("access_token"); // !! to turn into boolean

  return (
    <Routes>

      {/* Public routes */}
      <Route
        path="/register"
        element={
          /* using AuthShell for consistent styling around auth forms */
          <AuthShell
            title="Create an account"
            subtitle={
              <>
                Already have an account?{" "}
                <a href="/login" className="text-indigo-600 hover:underline">
                  Log in
                </a>
              </>
            }
          >
            <Register />
          </AuthShell>
        }
      />
      <Route
        path="/login"
        element={
         isAuthed ? (
           <Navigate to="/" replace />
         ) : (
           <AuthShell
             title="Welcome back"
             subtitle={
               <>
                 Don't have an account?{" "}
                 <a href="/register" className="text-indigo-600 hover:underline">
                   Sign up
                 </a>
               </>
             }
           >
             <Login />
           </AuthShell>
         )
        }
      />
      <Route path="/" element={<Home />} />

      {/* PRIVATE routes*/}
      <Route
        path="/home"
        element={
          <ProtectedRoute roles={["volunteer", "admin"]}>
            <UserHome />
          </ProtectedRoute>
        }
      >
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
      </Route>

      {/* Fallback */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}

export default App;