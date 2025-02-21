import React from "react";
import { useRouter } from "next/navigation";
import useAuthStatus from "@/lib/queries/auth-status";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const { data, isLoading } = useAuthStatus();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!data?.isAuthenticated) {
      router.push("/sign-in"); // Redirect to login if not authenticated
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
