"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthForms from "../../components/AuthForms";
import { useAuth } from "../../utils/authContext";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to home page
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  // If loading or already authenticated, show loading state
  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-secondary-600 dark:from-primary-500 dark:to-secondary-400">
        Weekly Showcase
      </h1>

      <AuthForms type="login" />

      <div className="text-center mt-6">
        <p className="text-neutral-600 dark:text-neutral-300">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
