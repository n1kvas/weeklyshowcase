import React, { useState } from "react";
import { useAuth, UserRole } from "../utils/authContext";

interface AuthFormProps {
  type: "login" | "register";
}

const AuthForms: React.FC<AuthFormProps> = ({ type }) => {
  const { login, register, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "login") {
      await login(email, password);
    } else {
      await register(email, password, role, name);
    }
  };

  return (
    <div className="auth-container max-w-md mx-auto p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
        {type === "login" ? "Login" : "Create an Account"}
      </h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {type === "register" && (
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
            minLength={6}
          />
        </div>

        {type === "register" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              I am a:
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center dark:text-neutral-300">
                <input
                  type="radio"
                  className="form-radio text-primary-600 dark:text-primary-500 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 dark:focus:ring-primary-600"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                />
                <span className="ml-2">Student</span>
              </label>

              <label className="inline-flex items-center dark:text-neutral-300">
                <input
                  type="radio"
                  className="form-radio text-primary-600 dark:text-primary-500 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 dark:focus:ring-primary-600"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={() => setRole("teacher")}
                />
                <span className="ml-2">Teacher</span>
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : type === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
};

export default AuthForms;
