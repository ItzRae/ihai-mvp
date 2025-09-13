import UsersTable from "./components/UsersTable.jsx";

import React, { useEffect, useState } from "react";
import Register from "./components/Register.jsx";

function App() {
  return (
    <>
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Register />;
      <UsersTable />;
    </div>
    </>
  );
}

export default App;
