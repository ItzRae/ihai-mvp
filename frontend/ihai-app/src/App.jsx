import UsersTable from "./components/UsersTable.jsx";
import AuthShell from "./components/AuthShell.jsx";
import React, { useEffect, useState } from "react";
import Register from "./components/Register.jsx";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
