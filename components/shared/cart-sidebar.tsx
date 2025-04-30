import useCartStore from "@/hooks/use-cart-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { TrashIcon, PlusIcon, MinusIcon} from "lucide-react";
import ProductPrice from "./product/product-price";
import { FREE_SHIPPING_MIN_PRICE } from "@/lib/constants";
import Loading from "./loading";

export default function CartSidebar() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore();

  const [loading, setLoading] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); // giả lập delay
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-w-34 overflow-y-auto">
      <div className="fixed border-l h-full w-34 bg-background">
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
          </div>
            <Separator className="my-1" />

          <ScrollArea className="flex-1 w-full px-1 max-h-[72vh]">
            {loading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <CartItemSkeleton key={i} />
                ))
              : items.map((item) => (
                  <div key={item.cartItemId}>
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

                    <div className="text-sm text-center py-1 font-bold">
                      <ProductPrice price={item.price} plain />
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center justify-between gap-2 mt-2 border-2 border-primary rounded-full">
                      {item.quantity === 1 ? (
                        <Button
                          onClick={() => removeItem(item)}
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 cursor-pointer rounded-full text-foreground font-bold"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={async () => {
                            setLoadingItemId(item.cartItemId); // set item đang loading
                            await updateItem(item, item.quantity - 1);
                            setLoadingItemId(null); // reset
                          }}
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 cursor-pointer rounded-full text-foreground font-bold"
                        >
                          <MinusIcon />
                        </Button>
                      )}

                      <span className="w-6 text-center text-sm text-foreground font-bold">
                        {loadingItemId === item.cartItemId ? (
                          <Loading />
                        ) : (
                          item.quantity
                        )}
                      </span>

                      <Button
                        onClick={async () => {
                          if (item.quantity < item.countInStock) {
                            setLoadingItemId(item.cartItemId); // set item đang loading
                            await updateItem(item, item.quantity + 1);
                            setLoadingItemId(null); // reset
                          }
                        }}
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 cursor-pointer rounded-full text-foreground font-bold"
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                    <Separator className="my-3" />
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
    <div className="animate-pulse space-y-2 p-2">
      <div className="relative h-24 w-full rounded bg-gray-200" />
      <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded" />
      <div className="flex items-center justify-between gap-2 border-2 mt-2 bg-gray-200 h-7 rounded-full">
      </div>
      <Separator />
    </div>
  );
}
