import { useAuth } from "../context/AuthContext";

const AdminOnly = ({ children }) => {
  const { user } = useAuth();

  if (!user) return null;
  else if (user.role !== "admin") return null;

  return children;
};

export default AdminOnly;
