"use client";

import React from "react";
import { AuthProvider } from "../utils/authContext";

interface AuthProviderWrapperProps {
  children: React.ReactNode;
}

const AuthProviderWrapper: React.FC<AuthProviderWrapperProps> = ({
  children,
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthProviderWrapper;
