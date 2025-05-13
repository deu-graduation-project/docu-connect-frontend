'use client';

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersTable from "./components/orders-table";
import NotesLibrary from "./components/notes-library";
import Reviews from "./components/reviews";
import useAuthStatus from "@/lib/queries/auth-status";

interface Props {
  userType: "user" | "agency"; // Kullanıcı tipini belirten prop
}

export default function ActivityAndHistoryPage({ userType }: Props) {
  const { data: authStatus } = useAuthStatus()
  return (
    <div className="grid w-full max-w-5xl items-start gap-10 p-4 md:p-8 lg:p-12">
      <div className="flex flex-col gap-6">
        <h1 className="mb-6 text-left text-xl font-bold md:text-2xl lg:text-3xl">
          Activity & History
        </h1>
      </div>

      <Tabs
        defaultValue={authStatus?.isAgency ? "Recent Orders & Photocopies" : "Reviews and Feedback"}
        className="w-full"
      >
       <TabsList className={`grid gap-2 grid-cols-1 ${authStatus?.isAgency ? "md:grid-cols-2" : ""}`} >                                                                                     
          {authStatus?.isAgency && (
            <TabsTrigger value="Recent Orders & Photocopies">
              Recent Orders & Photocopies
            </TabsTrigger>
          )}
          <TabsTrigger value="Reviews and Feedback">
            Reviews and Feedback
          </TabsTrigger>
        </TabsList>

        {authStatus?.isAgency && (
          <TabsContent value="Recent Orders & Photocopies">
            <div className="space-y-8 py-6">
              <div className="min-w-full">
                <OrdersTable />
              </div>
            </div>
          </TabsContent>
        )}

        <TabsContent value="Reviews and Feedback">
          <div className="space-y-8 py-6">
            <Reviews />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}