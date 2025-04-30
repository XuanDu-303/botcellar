/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCartStore from "@/hooks/use-cart-store";
import { OrderItem } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";

export default function AddToCart({
  item,
  minimal = false,
}: {
  item: OrderItem;
  minimal?: boolean;
}) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const [pendingTarget, setPendingTarget] = useState<
    "cart" | "checkout" | null
  >(null);

  const handleAdd = async (goTo: "cart" | "checkout" | null) => {
    try {
      setPendingTarget(goTo);
      const itemId = await addItem(item, quantity);
      toast.success("Added to Cart");

      if (goTo === "cart") {
        router.push(`/cart/${itemId}`);
      } else if (goTo === "checkout") {
        router.push("/checkout");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setPendingTarget(null);
    }
  };

  return minimal ? (
    <Button
      className="rounded-full w-auto cursor-pointer text-muted"
      onClick={() => {
        try {
          addItem(item, 1);
          toast.success("Added to Cart", {
            action: {
              label: "Go to Cart",
              onClick: () => router.push("/cart"),
            },
          });
        } catch (error: any) {
          toast.error(error.message || "Something went wrong");
        }
      }}
    >
      Add to Cart
    </Button>
  ) : (
    <div className="w-full space-y-2">
      <Select
        value={quantity.toString()}
        onValueChange={(i) => setQuantity(Number(i))}
      >
        <SelectTrigger className="w-full">
          <SelectValue>Quantity: {quantity}</SelectValue>
        </SelectTrigger>
        <SelectContent position="popper" className="w-full">
          {Array.from({ length: item.countInStock }).map((_, i) => (
            <SelectItem key={i + 1} value={`${i + 1}`}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className="rounded-full w-full cursor-pointer"
        type="button"
        disabled={pendingTarget === "cart"}
        onClick={() => handleAdd("cart")}
      >
        {pendingTarget === "cart" ? <Loading /> : "Add to Cart"}
      </Button>
      <Button
        variant="secondary"
        className="w-full rounded-full cursor-pointer"
        type="button"
        disabled={pendingTarget === "checkout"}
        onClick={() => handleAdd("checkout")}
      >
        {pendingTarget === "checkout" ? <Loading /> : "Buy Now"}
      </Button>
    </div>
  );
}
