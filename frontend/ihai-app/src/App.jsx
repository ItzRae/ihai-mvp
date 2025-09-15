import React from "react";
import AuthShell from "./components/AuthShell.jsx";
import Register from "./components/Register.jsx";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <Routes>
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
      <Route path="/" element={<Navbar />}/>
      {/* add other routes here */}
    </Routes>
  );
}

export default App;