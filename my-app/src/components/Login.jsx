import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login(props) {
    const [cin, setCin] = useState("");
    const [password, setPassword] = useState("");

    const Submit = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post("https://notes.devlop.tech/api/login", {
                cin,
                password,
            });
            console.log(resp.data);
            localStorage.setItem("token", resp.data.token);
            localStorage.setItem("first", resp.data.user.first_name);
            localStorage.setItem("last", resp.data.user.last_name);
            props.setisConect(true);
        } catch (err) {
            console.error("Login error:", err.response ? err.response.data : err.message);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="login-dark-container">
            <div className="login-dark-card">
                <h3 className="text-center mb-4 login">Login</h3>
                <form onSubmit={Submit}>
                    <div className="mb-3">
                        <label htmlFor="cin" className="form-label">
                            CIN
                        </label>
                        <input
                            type="text"
                            id="cin"
                            className="form-control"
                            placeholder="Enter your CIN"
                            value={cin}
                            onChange={(e) => setCin(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
                <div className="text-center mt-3">
                    <small>
                        Don't have an account? <a href="/register">Register</a>
                    </small>
                </div>
            </div>
        </div>
    );
}

export default Login;
