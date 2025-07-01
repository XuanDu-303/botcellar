import { Metadata } from "next";
import Link from "next/link";

import Pagination from "@/components/shared/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order.actions";
import { IOrder } from "@/lib/db/models/order.model";
import { formatDateTime, formatId } from "@/lib/utils";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import ProductPrice from "@/components/shared/product/product-price";

const PAGE_TITLE = "Your Orders";
export const metadata: Metadata = {
  title: PAGE_TITLE,
};
export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const orders = await getMyOrders({
    page,
  });
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex gap-2 text-sm text-muted-foreground">
        <Link href="/account" className="text-blue-600 hover:underline">
          Your Account
        </Link>
        <span>›</span>
        <span className="text-primary font-medium">{PAGE_TITLE}</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-foreground">{PAGE_TITLE}</h1>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-md border border-border bg-background shadow-sm">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="text-center text-muted-foreground py-6">
                    You have no orders yet.
                  </div>
                </TableCell>
              </TableRow>
            )}
            {orders.data.map((order: IOrder) => (
              <TableRow
                key={order._id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="text-muted-foreground text-xs">
                  {formatId(order._id)}
                </TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt!).dateTime}
                </TableCell>
                <TableCell>
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    <span className="text-green-600 font-medium">
                      {formatDateTime(order.paidAt).dateTime}
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">No</span>
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    <span className="text-green-600 font-medium">
                      {formatDateTime(order.deliveredAt).dateTime}
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">No</span>
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/account/orders/${order._id}`}
                    className="text-sm text-blue-600 hover:underline font-medium mx-2"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {orders.totalPages > 1 && (
          <div className="px-4 py-6">
            <Pagination page={page} totalPages={orders.totalPages} />
          </div>
        )}
      </div>

      {/* Browsing History */}
      <BrowsingHistoryList className="mt-16" />
    </div>
  );
}
