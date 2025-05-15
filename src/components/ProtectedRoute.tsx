import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "../utils/authContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push("/login");
        return;
      }

      // If role-based access control is enabled
      if (allowedRoles && allowedRoles.length > 0) {
        // Check if user has the required role
        if (!userData || !allowedRoles.includes(userData.role)) {
          // Redirect to homepage or access denied page
          router.push("/");
        }
      }
    }
  }, [user, userData, loading, allowedRoles, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // If not authenticated or not authorized, render nothing (will redirect)
  if (
    !user ||
    (allowedRoles &&
      allowedRoles.length > 0 &&
      (!userData || !allowedRoles.includes(userData.role)))
  ) {
    return null;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
