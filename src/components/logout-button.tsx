import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "@/services/auth";

const LogoutButton = () => {
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.signOut();
    },
    onSuccess: () => {
      // Invalidate the authStatus query to refetch the authentication state
      queryClient.invalidateQueries({ queryKey: ["authStatus"] });
      // Redirect the user to the login page
      window.location.href = "/login";
    },
  });

  return (
    <button
      onClick={() => logoutMutation.mutate()}
      className="bg-red-500 text-white p-2 rounded"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
