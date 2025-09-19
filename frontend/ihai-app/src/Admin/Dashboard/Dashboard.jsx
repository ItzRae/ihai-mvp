// import React from "react";
// import { TopBar } from "./TopBar";
// import { Grid } from "./Grid";

// export default function Dashboard() {
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <TopBar />

//       {/* Stats + charts */}
//       <section className="bg-white rounded-xl shadow">
//         <div className="p-4 sm:p-6">
//           <Grid />
//         </div>
//       </section>

//       {/* Example: transactions table */}
//       <section className="bg-white rounded-xl shadow overflow-x-auto">
//         <div className="p-4 sm:p-6">
//           <TransactionsTable />
//         </div>
//       </section>
//     </div>
//   );
// }
// src/Admin/Dashboard/Dashboard.jsx
// src/Admin/Dashboard/Dashboard.jsx
import React from "react";
import { TopBar } from "./TopBar.jsx";
import { Grid } from "./Grid.jsx";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <TopBar />
      <section className="bg-white rounded-xl shadow p-4">
        <Grid />
      </section>
    </div>
  );
}
