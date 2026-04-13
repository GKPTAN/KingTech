import React from "react";

import { useAuth } from "@/context/useAuth";

interface AdminOnlyProps {
  children: React.ReactNode;
}

const AdminOnly = ({ children }: AdminOnlyProps) => {
  const { user } = useAuth();

  if (!user) return null;
  else if (user.role !== "admin") return null;

  return children;
};

export default AdminOnly;
