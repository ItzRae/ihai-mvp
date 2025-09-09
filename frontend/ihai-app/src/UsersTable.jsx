import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // fetch users once when component loads
    axios.get("http://127.0.0.1:8000/users/") 
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">IHAI Users</h2>
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2 border">{u.name}</td>
                <td className="px-4 py-2 border">{u.email}</td>
                <td className="px-4 py-2 border">{u.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}