"use client";
import React from "react";
import useAuthStatus from "@/lib/queries/auth-status";
import { userService } from "@/services/user-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetBeAnAgencyRequests, BeAnAgencyRequestState } from "../../../types/classes";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { boolean } from "zod";
import {toast} from "sonner"
import { useEffect } from "react";
export default function AgencyRequestsPage() {
  const {
    data: authData,
    isLoading: authLoading,
    error: authError,
  } = useAuthStatus();
  const queryClient = useQueryClient();
  const router = useRouter();

useEffect(() => {
  if(authData?.isAuthenticated === false)
  {

    router.push("/sign-in");
  }
}, [authData, router])
  

  // Fetch agency requests
  const {
    data: agencyRequests,
    isLoading: requestsLoading,
    error: requestsError,
  } = useQuery({
    queryKey: ["agencyRequests"],
    queryFn: () => userService.getBeAnAgencyRequests(1, 10), // Pass default pagination values
  });

  // handle approve request
 const {mutate: handleAgencyRequest} = useMutation( {
  mutationFn: ({requestId, isConfirmed}: {requestId: string, isConfirmed:boolean}) => userService.beAnAgencyConfirm(requestId, isConfirmed),
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ["agencyRequests"]})
    toast.success("Agency request updated successfully")
},
  onError: (error) => {
    console.error("Failed to update agency request", error);
    toast.error("Failed to update agency request");
  }
 })

 // @ts-ignore
 const pendingRequests = agencyRequests?.beAnAgencyRequests.filter(request => request.beAnAgencyRequestState === "Pending");


  // Handle loading state
  if (authLoading || requestsLoading) {
    return (
      <div className="max-h-screen flex mt-12 p-4 items-center w-full mx-auto">
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-[300px] w-auto animate-pulse rounded-xl bg-muted/50" />
        <div className="h-[300px] w-auto animate-pulse rounded-xl bg-muted/50" />
        <div className="h-[300px] hidden lg:flex w-auto animate-pulse rounded-xl bg-muted/50" />
        </div>
        <div className="flex w-full h-full gap-4">
        <div className="h-[300px] w-auto mb-2 animate-pulse rounded-xl bg-muted/50"></div>
        <div className="h-[300px] w-auto mb-2 animate-pulse rounded-xl bg-muted/50"></div>
        </div>
      </div>
      </div>
    );
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

  // Handle empty state
  if (!pendingRequests || pendingRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h1 className="text-2xl font-bold mb-4">Agency Requests</h1>
        <p className="text-muted-foreground">No pending agency requests found.</p>
      </div>
    );
  }


  return (
    <div className="flex   overflow-hidden flex-col items-start justify-center mx-4">
      <h1 className=" text-2xl font-bold mb-4">Agency Requests</h1>
      <div className="overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full sm:w-auto gap-4    ">
        { pendingRequests?.map(
          // Use lowercase 'b'
          
          (request: GetBeAnAgencyRequests) =>  { 
            return   (
            <div
              key={request.beAnAgencyRequestId} // Use a unique key
              className=" border  flex flex-col gap-2  shadow-md rounded-md p-4 my-4"
            >
              {request.profilePhoto ? (
                <div className="">
                  <Image
                    src={`data:image/jpeg;base64,${request.profilePhoto}`} // Ensure this is a valid base64 string
                    width={100}
                    height={100}
                    alt={`Profile of ${request.name}`}
                    className="rounded-full  object-cover  w-16 h-16 border"
                  />
                </div>
              ) : (
                <div className="p-4 flex items-center justify-center font-semibold text-[17px] rounded-full bg-transparent border w-16 h-16">
                  {request.name.slice(0, 1)}
                  {request.surname.slice(0, 1)}
                </div>
              )}
              <h2 className="text-lg pt-2 font-semibold">
                {request.agencyName}
              </h2>

              <p className="text-muted-foreground mt-2 text-sm">
                <strong className="text-white">Name:</strong> {request.name}{" "}
                {request.surname}
              </p>
              <p className="text-muted-foreground text-sm">
                <strong className="text-white">Email:</strong> {request.email}
              </p>
              <p className="text-muted-foreground text-sm">
                <strong className="text-white">Address:</strong>{" "}
                {request.address.province}, {request.address.district}
              </p>

              <div className="flex pt-2 justify-between w-full items-center">
                <Button
                onClick={() => handleAgencyRequest({requestId: request.beAnAgencyRequestId, isConfirmed: true})}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    " text-white w-full bg-outline px-4 py-1 rounded-md mr-2"
                  )}
                >
                  Approve
                </Button>
                <button
                onClick={() => handleAgencyRequest({requestId: request.beAnAgencyRequestId, isConfirmed: false})}
                  className={cn(
                    buttonVariants({ variant: "destructive" }),
                    " text-white w-full  px-4 py-1 rounded-md mr-2"
                  )}
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        )
      
        }
      </div>
    </div>
  );
}
