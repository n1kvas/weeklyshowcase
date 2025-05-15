import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProviderWrapper from "../components/AuthProviderWrapper";
import Navigation from "../components/Navigation";
import { ThemeProvider } from "../components/ThemeProvider";

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
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body
        className="bg-neutral-50 text-neutral-900 min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900 dark:bg-neutral-900 dark:text-neutral-50 dark:selection:bg-primary-900 dark:selection:text-primary-100"
        suppressHydrationWarning
      >
        <AuthProviderWrapper>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              <header className="bg-white border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                <div className="container mx-auto px-4 py-3">
                  <Navigation />
                </div>
              </header>
              <main className="flex-grow">{children}</main>
              <footer className="bg-white border-t border-neutral-200 py-4 text-center text-neutral-500 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                <div className="container mx-auto px-4">
                  <p suppressHydrationWarning>
                    Weekly Showcase &copy; {new Date().getFullYear()}
                  </p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
