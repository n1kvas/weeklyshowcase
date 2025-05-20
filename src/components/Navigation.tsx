"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../utils/authContext";
import { FaCog } from "react-icons/fa";

const Navigation: React.FC = () => {
  const { user, userData, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative mr-2 w-10 h-10">
          <div className="relative w-full h-full">
            <Image
              src="/logo.svg"
              alt="Weekly Showcase Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </div>
        <span className="text-xl font-bold text-primary-600">
          Weekly Showcase
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        {loading ? (
          <div className="w-5 h-5 border-t-2 border-primary-500 rounded-full animate-spin"></div>
        ) : user ? (
          <>
            {userData?.role === "teacher" && (
              <Link
                href="/manage-students"
                className="text-neutral-600 hover:text-primary-600 transition-colors dark:text-neutral-300 dark:hover:text-primary-400"
              >
                Manage Students
              </Link>
            )}
            <Link
              href="/settings"
              className="text-neutral-600 hover:text-primary-600 transition-colors dark:text-neutral-300 dark:hover:text-primary-400 p-2"
              title="Settings"
            >
              <FaCog className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-neutral-600 dark:text-neutral-300">
                <span className="font-medium">
                  {userData?.name || userData?.email}
                </span>
                <span className="ml-2 text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 rounded-full">
                  {userData?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-neutral-600 hover:text-primary-600 transition-colors dark:text-neutral-300 dark:hover:text-primary-400"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              href="/settings"
              className="text-neutral-600 hover:text-primary-600 transition-colors dark:text-neutral-300 dark:hover:text-primary-400 p-2"
              title="Settings"
            >
              <FaCog className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="text-neutral-600 hover:text-primary-600 transition-colors dark:text-neutral-300 dark:hover:text-primary-400"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
