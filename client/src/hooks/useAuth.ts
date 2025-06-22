import { useState, useEffect } from "react";

// Mock user data for different roles
const mockUsers = {
  admin: {
    id: "admin1",
    email: "admin@company.com",
    firstName: "John",
    lastName: "Admin",
    role: "admin",
    profileImageUrl: null
  },
  supervisor: {
    id: "supervisor1", 
    email: "supervisor@company.com",
    firstName: "Jane",
    lastName: "Supervisor",
    role: "supervisor",
    profileImageUrl: null
  },
  operator: {
    id: "operator1",
    email: "operator@company.com", 
    firstName: "Bob",
    lastName: "Operator",
    role: "operator",
    profileImageUrl: null
  },
  readonly: {
    id: "readonly1",
    email: "readonly@company.com",
    firstName: "Alice", 
    lastName: "ReadOnly",
    role: "readonly",
    profileImageUrl: null
  }
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate loading and check localStorage for authentication
    setTimeout(() => {
      const storedAuth = localStorage.getItem('mockAuth');
      const storedRole = localStorage.getItem('mockRole') || 'operator';
      
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
        setUser(mockUsers[storedRole as keyof typeof mockUsers]);
      }
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = (role: string = 'operator') => {
    localStorage.setItem('mockAuth', 'true');
    localStorage.setItem('mockRole', role);
    setIsAuthenticated(true);
    setUser(mockUsers[role as keyof typeof mockUsers]);
  };

  const logout = () => {
    localStorage.removeItem('mockAuth');
    localStorage.removeItem('mockRole');
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
}
