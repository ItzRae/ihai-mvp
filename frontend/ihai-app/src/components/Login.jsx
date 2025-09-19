import React, { useContext, useState, useEffect, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

/* tiny field wrapper for consistency */
const Field = memo(function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
});

const Login = () => {
  const navigate = useNavigate();
  const { token, setToken, setUser } = useContext(UserContext) ?? {};

  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (token) navigate("/", { replace: true });
//   }, [token, navigate]);

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 " +
    "focus:ring-indigo-200 focus:border-indigo-500 hover:border-gray-400";

  const handleLogin = async (e) => {
    setSubmitting(true);
    console.log("HANDLING...")


    try {
      const res = await fetch("/api/authtoken/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded"},
        body: JSON.stringify(
            `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
        ),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(data?.detail || "Invalid email or password.");
        return;
      } else {
        setToken(data.access_token)
      }

        setUser?.({ name: finalName, email });

      navigate("/", { replace: true });
    } catch {
      console.log("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Email">
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </Field>

        <Field label="Password">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              className={inputClass + " pr-12"}
              value={password}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute inset-y-0 right-3 my-auto text-gray-500 hover:text-gray-700"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between text-sm">
          <div />
          <Link to="/forgot" className="text-indigo-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white
                     shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed
                     disabled:bg-indigo-300"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;