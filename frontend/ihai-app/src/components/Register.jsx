import React, { useContext, useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
import { FaUser, FaHandHoldingUsd, FaClock} from "react-icons/fa";




const ROLES = [
  {
    id: "volunteer",
    name: "User / Volunteer",
    desc: "Log shifts, earn credits, redeem, create projects & teams.",
    Icon: FaUser,
  },
  // {
  //   id: "investor",
  //   name: "Investor / Donor",
  //   desc: "Signup to donate/invest in our mission.",
  //   Icon: FaHandHoldingUsd,
  // },
  {
    id: "agent",
    name: "Agent",
    desc: "Verify user shifts, gain more rewards",
    Icon: FaClock,
  }
];

/* field wrapper */
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

  // wizard
  const [step, setStep] = useState(1);             // 1 = choose role, 2 = form
  const [role, setRole] = useState(null);          // 'general' | 'investor'

  // form fields
  const [first, setFirst] = useState("");
  const [last, setLast]   = useState("");
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // // restore pending role if you want
  // useEffect(() => {
  //   const saved = localStorage.getItem("pending_role");
  //   if (saved && !role) { setRole(saved); setStep(2); }
  // }, [role]);

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 " +
    "focus:ring-indigo-200 focus:border-indigo-500 hover:border-gray-400";

  const submitRegistration = async () => {
    setError("");
    setSubmitting(true);
    const name = `${first.trim()} ${last.trim()}`.trim();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }), // include role
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.detail || "Registration failed");
        return;
      }

      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem("user_name", name);
        const firstTrim = first.trim();
        if (firstTrim) localStorage.setItem("first_name", firstTrim);
        localStorage.setItem("user_role", role);
      } else {
        setError("Registered, but no token returned.");
        return;
      }
      navigate("/", { replace: true });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) return setError("Please select a role to continue.");
    if (!agree) return setError("Please agree to the Terms & Conditions.");
    if (password !== confirm || password.length < 5)
      return setError("Passwords must match and be at least 5 characters.");
    if (!first.trim() || !last.trim())
      return setError("Please enter your first and last name.");
    submitRegistration();
  };
  
  const selectedRole = ROLES.find(r => r.id === role);

  return (
    <div className="w-full max-w-xl">
      {/* Step 1: Role selection */}
      <div
        className={`transition-all duration-300 ${
          step === 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden"
        }`}
        aria-hidden={step !== 1}
      >
        <h2 className="text-lg font-semibold mb-1">Select Role</h2>
        <p className="text-xs text-gray-500 mb-4">
          Choose how you’ll use IHAI. You can upgrade your role later.
        </p>

        <div className="space-y-3">
          {ROLES.map(({ id, name, desc, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => { setRole(id); setStep(2); }}
              className="w-full text-left rounded-xl border px-4 py-4 bg-white
                         hover:bg-cyan-500/15 hover:border-gray-400 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                  <Icon className="text-cyan-600" />
                  {name}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Form */}
      <form
        onSubmit={handleSubmit}
        className={`space-y-5 transition-all duration-300 ${
          step === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden"
        }`}
        aria-hidden={step !== 2}
      >
        {selectedRole && (
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 px-3 py-1">
              Role: {selectedRole.name}
            </span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-indigo-600 hover:underline"
            >
              change
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First name">
            <input type="text" className={inputClass} value={first}
              onChange={(e) => setFirst(e.target.value)} placeholder="First name" required />
          </Field>
          <Field label="Last name">
            <input type="text" className={inputClass} value={last}
              onChange={(e) => setLast(e.target.value)} placeholder="Last name" required />
          </Field>
        </div>

        <Field label="Email">
          <input type="email" className={inputClass} value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </Field>

        <Field label="Password">
          <div className="relative">
            <input type={showPw ? "text" : "password"} className={inputClass + " pr-12"}
              value={password} onChange={(e) => setPw(e.target.value)}
              placeholder="Enter your password" required />
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
          <input type="password" className={inputClass} value={confirm}
            onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" required />
        </Field>

        <div className="flex items-start gap-3 pt-2">
          <input id="agree" type="checkbox" checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
          <label htmlFor="agree" className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="/terms" target="_blank" className="text-indigo-600 hover:underline">
              Terms & Conditions
            </a>
          </label>
        </div>

        <ErrorMessage message={error} />

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