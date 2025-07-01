import { Metadata } from "next";
import Link from "next/link";

import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { formatDateTime, formatId } from "@/lib/utils";
import { IOrderList } from "@/types";
import ProductPrice from "@/components/shared/product/product-price";

export const metadata: Metadata = {
  title: "Admin Orders",
};
export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const searchParams = await props.searchParams;

  const { page = "1" } = searchParams;

  const orders = await getAllOrders({
    page: Number(page),
  });
  return (
    <div className="space-y-2">
      <h1 className="h1-bold">Orders</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead className="text-center w-[130px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order: IOrderList) => (
              <TableRow
                key={order._id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="text-xs text-muted-foreground">
                  {formatId(order._id)}
                </TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt!).dateTime}
                </TableCell>
                <TableCell
                  className="max-w-[200px] truncate"
                  title={order.user?.name}
                >
                  {order.user?.name ?? (
                    <span className="text-red-500 italic">Deleted User</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-green-600">
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    <span className="text-green-600 font-semibold">
                      {formatDateTime(order.paidAt).dateTime}
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">No</span>
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    <span className="text-green-600 font-semibold">
                      {formatDateTime(order.deliveredAt).dateTime}
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">No</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-1">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/orders/${order._id}`}>Details</Link>
                    </Button>
                    <DeleteDialog id={order._id} action={deleteOrder} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders.totalPages!} />
        )}
      </div>
    </div>
  );
}
