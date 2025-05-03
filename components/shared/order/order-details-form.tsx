"use client";

import Image from "next/image";
import Link from "next/link";
import ActionButton from "../action-button";
import { deliverOrder, updateOrderToPaid } from "@/lib/actions/order.actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IOrder } from "@/lib/db/models/order.model";
import { cn, formatDateTime } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import ProductPrice from "../product/product-price";

export default function OrderDetailsForm({
  order,
  isAdmin,
}: {
  order: IOrder;
  isAdmin: boolean;
}) {
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    expectedDeliveryDate,
  } = order;

  return (
    <div className="grid md:grid-cols-3 md:gap-5">
      <div className="overflow-x-auto md:col-span-2 space-y-4">
        {/* Shipping Address */}
        <Card className="bg-card border border-border rounded-xl shadow-sm">
          <CardContent className="p-4 space-y-3">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            <div className="space-y-1 text-sm leading-6">
              <p>{shippingAddress.fullName} {shippingAddress.phone}</p>
              <p>
                {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.province}, {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>
            {isDelivered ? (
              <Badge className="w-fit">Delivered at {formatDateTime(deliveredAt!).dateTime}</Badge>
            ) : (
              <div className="space-y-2">
                <Badge variant="destructive" className="w-fit">Not delivered</Badge>
                <p className="text-sm text-muted-foreground">
                  Expected: {formatDateTime(expectedDeliveryDate!).dateTime}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="bg-card border border-border rounded-xl shadow-sm">
          <CardContent className="p-4 space-y-3">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            <p className="text-sm">{paymentMethod}</p>
            <Badge
              variant={isPaid ? "default" : "destructive"}
              className="w-fit"
            >
              {isPaid ? `Paid at ${formatDateTime(paidAt!).dateTime}` : "Not paid"}
            </Badge>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="bg-card border border-border rounded-xl shadow-sm">
          <CardContent className="p-4 space-y-3">
            <h2 className="text-xl font-semibold">Order Items</h2>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="text-left">Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.cartItemId} className="hover:bg-muted transition-colors">
                    <TableCell>
                      <Link href={`/product/${item.slug}`} className="flex items-center gap-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          unoptimized
                          width={48}
                          height={48}
                          className="rounded-md border"
                        />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-700">
                      ${item.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div>
        <Card className="bg-card border border-border rounded-xl shadow-sm">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <ProductPrice price={itemsPrice} plain />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <ProductPrice price={taxPrice} plain />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <ProductPrice price={shippingPrice} plain />
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <ProductPrice price={totalPrice} plain />
            </div>

            {!isPaid && ["Stripe", "PayPal"].includes(paymentMethod) && (
              <Link
                className={cn(buttonVariants({ variant: "default" }), "w-full")}
                href={`/checkout/${order._id}`}
              >
                Pay Order
              </Link>
            )}

            {isAdmin && (
              <div className="space-y-2">
                {!isPaid && paymentMethod === "Cash On Delivery" && (
                  <ActionButton
                    caption="Mark as paid"
                    action={() => updateOrderToPaid(order._id)}
                  />
                )}
                {isPaid && !isDelivered && (
                  <ActionButton
                    caption="Mark as delivered"
                    action={() => deliverOrder(order._id)}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
