"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 px-4 py-3 rounded-md text-md transition-all ${
            theme === "light"
              ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium"
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
          }`}
          title="Light mode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>
          <span>Light</span>
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 px-4 py-3 rounded-md text-md transition-all ${
            theme === "dark"
              ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium"
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
          }`}
          title="Dark mode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
          </svg>
          <span>Dark</span>
        </button>

        <button
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 px-4 py-3 rounded-md text-md transition-all ${
            theme === "system"
              ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium"
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
          }`}
          title="System theme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
            />
          </svg>
          <span>System</span>
        </button>
      </div>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 px-1">
        {theme === "system"
          ? "Using your device's theme preference"
          : `Using ${theme} theme mode`}
      </p>
    </div>
  );
}
