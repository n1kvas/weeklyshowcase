"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaPalette } from "react-icons/fa";
import ThemeToggle from "../../components/ThemeToggle";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-150"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center">
          <div className="relative w-12 h-12 mr-4">
            <Image
              src="/logo.svg"
              alt="Weekly Showcase Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold dark:text-white">
              Application Settings
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Customize your experience with Weekly Showcase
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-8 mb-6">
          <div className="flex items-start mb-6">
            <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg mr-4">
              <FaPalette className="text-primary-600 dark:text-primary-300 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold dark:text-white">
                Appearance
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Choose how Weekly Showcase looks to you
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-medium mb-3 dark:text-white">Theme</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Select a theme preference for the application interface.
            </p>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Space for additional settings sections */}
        <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-8 opacity-50">
          <p className="text-center text-neutral-600 dark:text-neutral-400">
            Additional settings will appear here in future updates
          </p>
        </div>
      </div>
    </main>
  );
}
