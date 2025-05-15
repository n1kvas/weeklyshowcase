import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Weekly Showcase",
  description:
    "Manage student presentations and feedback with interactive timers",
  keywords: "education, presentations, student feedback, classroom management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-neutral-50 text-neutral-900 min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900">
        <div className="flex flex-col min-h-screen">
          <header className="bg-white border-b border-neutral-200">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary-600">
                Weekly Showcase
              </h1>
            </div>
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="bg-white border-t border-neutral-200 py-4 text-center text-neutral-500 text-sm">
            <div className="container mx-auto px-4">
              <p>Weekly Showcase &copy; {new Date().getFullYear()}</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
