import React, { useContext, useState, memo } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "react-router-dom";

/* moved OUT of Register, top-level + memo so it never remounts unnecessarily */
const Field = memo(function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
});

const Register = () => {
  const { setToken } = useContext(UserContext);
    const navigate = useNavigate();
  

  const [first, setFirst] = useState("");
  const [last, setLast]   = useState("");
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitRegistration = async () => {
    setError("");
    setSubmitting(true);
    const name = `${first.trim()} ${last.trim()}`.trim();

    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name, email,password })
        };

        const response = await fetch("/api/users", requestOptions);
        const data = await response.json();

      if (!response.ok) {
        setError(data?.detail || "Registration failed");
        return;
      }
      
      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem("user_name", name);
        const firstTrim = first.trim();   
        if (firstTrim) {
          localStorage.setItem("first_name", firstTrim);
        }
      } else {
        setError("Registered, but no token returned.");
      }

    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
    navigate("/", { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) return setError("Please agree to the Terms & Conditions.");
    if (password !== confirm || password.length < 5)
      return setError("Passwords must match and be at least 5 characters.");
    if (!first.trim() || !last.trim())
      return setError("Please enter your first and last name.");
    submitRegistration();
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 " +
    "placeholder:text-gray-400 " + // ⬅️ space added before focus classes
    "focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 " +
    "hover:border-gray-400";

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First name">
            <input
              type="text"
              className={inputClass}
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              placeholder="First name"
              required
            />
          </Field>
          <Field label="Last name">
            <input
              type="text"
              className={inputClass}
              value={last}
              onChange={(e) => setLast(e.target.value)}
              placeholder="Last name"
              required
            />
          </Field>
        </div>

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

        <Field label="Confirm password">
          <input
            type="password"
            className={inputClass}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            required
          />
        </Field>

        <div className="flex items-start gap-3 pt-2">
          <input
            id="agree"
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="/terms" target="_blank" className="text-indigo-600 hover:underline">
              Terms & Conditions
            </a>
          </label>
        </div>

        <ErrorMessage message={error} />

        {/* Divider + Social (placeholders) */}
        <div className="relative my-4">
          <hr />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs text-gray-500">
            Or register with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium hover:border-gray-400"
          >
            <span className="mr-2">🔍</span> Google
          </button>
          <button
            type="button"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium hover:border-gray-400"
          >
            <span className="mr-2"></span> Apple
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting || !agree}
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white
                     shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed
                     disabled:bg-indigo-300"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
};

export default Register;