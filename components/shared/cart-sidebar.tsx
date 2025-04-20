import useCartStore from "@/hooks/use-cart-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { TrashIcon } from "lucide-react";
import ProductPrice from "./product/product-price";
import { FREE_SHIPPING_MIN_PRICE } from "@/lib/constants";

export default function CartSidebar() {
  const {
    cart: { items, itemsPrice },
    isLoading,
    updateItem,
    removeItem,
  } = useCartStore();

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000) // giả lập delay
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="min-w-36 overflow-y-auto">
      <div className="fixed border-l h-full w-36 bg-background">
        <div className="p-2 h-full w-full flex flex-col gap-2 justify-start items-center">
          <div className="text-center space-y-2">
            <div>Subtotal</div>
            <div className="font-bold">
              <ProductPrice price={itemsPrice} plain />
            </div>
            {itemsPrice > FREE_SHIPPING_MIN_PRICE && (
              <div className="text-center text-xs">
                Your order qualifies for FREE Shipping
              </div>
            )}

            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full hover:no-underline w-full"
              )}
              href="/cart"
            >
              Go to Cart
            </Link>
            <Separator className="mt-3" />
          </div>

          <ScrollArea className="flex-1 w-full">
            {loading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <CartItemSkeleton key={i} />
                ))
              : items.map((item) => (
                  <div key={item.cartItemId} className="my-3">
                    <Link href={`/product/${item.slug}`}>
                      <div className="relative h-24">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="20vw"
                          className="object-contain"
                        />
                      </div>
                    </Link>

                    <div className="text-sm text-center font-bold">
                      <ProductPrice price={item.price} plain />
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center justify-center gap-2 mt-2">
                      {item.quantity === 1 ? (
                        <Button
                          onClick={() => removeItem(item)}
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => updateItem(item, item.quantity - 1)}
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                        >
                          –
                        </Button>
                      )}

                      <span className="w-6 text-center text-sm font-medium">
                        {isLoading ? "--" : item.quantity}
                      </span>

                      <Button
                        onClick={() => {
                          if (item.quantity < item.countInStock) {
                            updateItem(item, item.quantity + 1);
                          }
                        }}
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                      >
                        +
                      </Button>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

function CartItemSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-2">
      <div className="relative h-24 w-full rounded bg-gray-200" />
      <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded" />
      <div className="flex justify-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded" />
        <div className="w-6 h-4 bg-gray-200 rounded" />
        <div className="w-8 h-8 bg-gray-200 rounded" />
      </div>
      <Separator />
    </div>
  );
}