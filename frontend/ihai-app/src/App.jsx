import React from "react";
import AuthShell from "./components/AuthShell.jsx";
import Register from "./components/Register.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";

function App() {
  const isAuthed = !!localStorage.getItem("access_token");

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


    </Routes>
  );
}

export default App;