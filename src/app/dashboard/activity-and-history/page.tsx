import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersTable from "./components/orders-table";
import NotesLibrary from "./components/notes-library";
import Reviews from "./components/reviews";
type Props = {};

export default function ActivityAndHistoryPage({}: Props) {
  return (
    <div className="p-4 w-full">
      <Tabs
        defaultValue="Recent Orders & Photocopies"
        className=" w-full max-w-7xl"
      >
        <TabsList className="w-auto  ">
          <TabsTrigger value="Recent Orders & Photocopies">
            Recent Orders & Photocopies
          </TabsTrigger>
          <div className="w-[1px] h-full mx-1 bg-primary-foreground"></div>
          <TabsTrigger value="Notes and Uploads">Notes and Uploads</TabsTrigger>
          <div className="w-[1px] h-full mx-1 bg-primary-foreground"></div>

          <TabsTrigger value="Reviews and Feedback">
            Reviews and Feedback
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Recent Orders & Photocopies">
          <OrdersTable />
        </TabsContent>
        <TabsContent value="Notes and Uploads">
          <NotesLibrary />
        </TabsContent>
        <TabsContent value="Reviews and Feedback">
          <Reviews />
        </TabsContent>
      </Tabs>
    </div>
  );
}
