import { Order, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Order[]> {
  return [
    {
      orderId: "123456",
      agencyName: "Alpha Agency",
      status: "success",
      orderDate: new Date().toISOString(),
      totalCost: 1200,
    },
    {
      orderId: "789101",
      agencyName: "Beta Corp",
      status: "pending",
      orderDate: new Date().toISOString(),
      totalCost: 800,
    },
    {
      orderId: "111213",
      agencyName: "Gamma LLC",
      status: "failed",
      orderDate: new Date().toISOString(),
      totalCost: 500,
    },
  ];
}

export default async function OrdersTable() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Recent Orders & Photocopies</h1>
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
