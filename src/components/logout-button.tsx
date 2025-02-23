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
      window.location.href = "/sign-in";
    },
  });

  return (
    <button
      onClick={() => logoutMutation.mutate()}
      className="bg-transparent hover:bg-inherit"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
