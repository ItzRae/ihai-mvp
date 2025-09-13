import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";



const Register = () => {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const { setToken } = useContext(UserContext);

    const submitRegistration = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name, email,password })
        };

        const response = await fetch("/api/users", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setError(data?.detail || 'Registration failed');
            return;
        }
        
        if (data.access_token) setToken(data.access_token);

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword || password.length < 5) {
            setError("Passwords must match and be at least 5 characters long.");
            return;
        }
        submitRegistration();
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-center">Register</h2>
                <div className="field">
                    <label className="block mb-1 font-medium">Name</label>
                    <div className="border rounded px-3 py-2">
                        <input 
                            type="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full border-0 focus:ring-0"
                            placeholder="Enter Full Name"
                            required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="block mb-1 font-medium">Email</label>
                    <div className="border rounded px-3 py-2">
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full border-0 focus:ring-0"
                            placeholder="Enter Email"
                            required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="block mb-1 font-medium">Password</label>
                    <div className="border rounded px-3 py-2">
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full border-0 focus:ring-0"
                            placeholder="Enter Password"
                            required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="block mb-1 font-medium">Confirm Password</label>
                    <div className="border rounded px-3 py-2">
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="w-full border-0 focus:ring-0"
                            placeholder="Confirm Password"
                            required
                        />
                    </div>
                </div>
                <ErrorMessage message={error}/>
                <br/>
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" type="submit">
                    Register
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
        </div>
    );

};
export default Register;