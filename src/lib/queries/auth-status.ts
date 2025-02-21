import { useQuery } from "@tanstack/react-query";
import authService from "@/services/auth";

const useAuthStatus = () => {
  return useQuery({
    queryKey: ["authStatus"], // Query key
    queryFn: async () => {
      await authService.identityCheck(); // Perform identity check
      return {
        isAuthenticated: authService.isAuthenticated,
        isAdmin: authService.isAdmin,
        isAgency: authService.isAgency,
        userId: authService.userId,
        username: authService.username,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      };
    },
  });
};

export default useAuthStatus;
