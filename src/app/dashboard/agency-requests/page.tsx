"use client";
import React from "react";
import useAuthStatus from "@/lib/queries/auth-status";
import userService from "@/services/user-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetBeAnAgencyRequests } from "../../../types/classes";

export default function AgencyRequestsPage() {
  const {
    data: authData,
    isLoading: authLoading,
    error: authError,
  } = useAuthStatus();
  const queryClient = useQueryClient();

  // Fetch agency requests
  const {
    data: agencyRequests,
    isLoading: requestsLoading,
    error: requestsError,
  } = useQuery({
    queryKey: ["agencyRequests"],
    queryFn: () => userService.getBeAnAgencyRequests(0, 10), // Pass default pagination values
  });

  // Handle loading state
  if (authLoading || requestsLoading) {
    return <div>Loading...</div>;
  }

  // Handle unauthorized access
  if (authData?.isAdmin === false) {
    return <div>Unauthorized: You are not an admin.</div>;
  }

  // Handle errors
  if (authError) {
    return <div>Error: {authError.message}</div>;
  }
  if (requestsError) {
    return <div>Error: {requestsError.message}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Agency Requests</h1>
      <div>
        {agencyRequests?.BeAnAgencyRequests.map(
          (request: GetBeAnAgencyRequests) => (
            <div
              key={request.id}
              className="bg-white shadow-md rounded-md p-4 my-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{request.agencyName}</h2>
                <div>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">
                    Approve
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                    Reject
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mt-2">{request.description}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
