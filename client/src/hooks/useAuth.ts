// Simple mock user for demo - no authentication required
const mockUser = {
  id: "demo_user",
  email: "demo@company.com",
  firstName: "Demo",
  lastName: "User",
  role: "operator",
  profileImageUrl: null
};

export function useAuth() {
  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
  };
}
