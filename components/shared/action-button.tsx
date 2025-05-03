"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Loading from "./loading";

export default function ActionButton({
  caption,
  action,
  className = "w-full",
  variant = "default",
  size = "default",
}: {
  caption: string;
  action: () => Promise<{ success: boolean; message: string }>;
  className?: string;
  variant?: "default" | "outline" | "destructive";
  size?: "default" | "sm" | "lg";
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const res = await action();
        if (res.success) {
          toast.success("Success", { description: res.message });
        } else {
          toast.error("Failed", { description: res.message });
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error("Unexpected Error", {
          description: err?.message || "Something went wrong",
        });
      }
    });
  };

  return (
    <Button
      type="button"
      className={cn("rounded-full cursor-pointer", className)}
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? (
        <div className="flex items-center gap-2">
          <Loading className="fill-primary-foreground" /> Processing...
        </div>
      ) : (
        caption
      )}
    </Button>
  );
}
