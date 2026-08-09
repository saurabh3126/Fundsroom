import { useState } from "react";
import { login } from "../services/api";

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const result = await login(email, password);

            if (!result.success) {
                throw new Error(
                    result.message || "Login failed."
                );
            }

            localStorage.setItem(
                "token",
                result.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(result.user)
            );

            onLogin(result.user);

        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.message || "Unable to login."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">

                <div className="mb-8 text-center">

                    <h1 className="text-3xl font-bold text-slate-800">
                        Fundsroom
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Admin Login
                    </p>

                </div>


                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="admin@fundsroom.com"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />

                    </div>


                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter password"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />

                    </div>


                    {error && (
                        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;