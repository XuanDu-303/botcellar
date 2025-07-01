"use client";

import { cn, round2 } from "@/lib/utils";
import useSettingStore from "@/hooks/use-setting-store";
import { useFormatter, useTranslations } from "next-intl";

const ProductPrice = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,
  forListing = true,
  plain = false,
  hideDiscount = false,
}: {
  price: number;
  isDeal?: boolean;
  listPrice?: number;
  className?: string;
  forListing?: boolean;
  plain?: boolean;
  hideDiscount?: boolean;
}) => {
  const { getCurrency } = useSettingStore();
  const currency = getCurrency();
  const t = useTranslations("Product");
  const format = useFormatter();

  const convertedPrice = round2(currency.convertRate * price);
  const convertedListPrice = round2(currency.convertRate * listPrice);

  const discountPercent =
    !hideDiscount && convertedListPrice > 0
      ? Math.round(100 - (convertedPrice / convertedListPrice) * 100)
      : 0;

  const formattedPrice = format.number(convertedPrice, {
    style: "currency",
    currency: currency.code,
    currencyDisplay: "narrowSymbol",
  });

  const formattedListPrice = format.number(convertedListPrice, {
    style: "currency",
    currency: currency.code,
    currencyDisplay: "narrowSymbol",
  });

  if (plain) {
    return formattedPrice;
  }

  if (convertedListPrice === 0) {
    return (
      <div className={cn("text-2xl", className)}>
        {formattedPrice}
      </div>
    );
  }

  if (isDeal) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {!hideDiscount && (
            <span className="bg-red-700 rounded-sm p-1 text-white text-sm font-semibold">
              {discountPercent}% {t("Off")}
            </span>
          )}
          <span className="text-red-700 text-xs font-bold">
            {t("Limited time deal")}
          </span>
        </div>
        <div className={`flex ${forListing ? "" : ""} items-center gap-2`}>
          <div className={cn("text-2xl", className)}>
            {formattedPrice}
          </div>
          <div className="text-muted-foreground text-xs py-2">
            {t("Was")}:{" "}
            <span className="line-through">
              {formattedListPrice}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-3">
        {!hideDiscount && (
          <div className="text-2xl text-orange-700">-{discountPercent}%</div>
        )}
        <div className={cn("text-2xl", className)}>
          {formattedPrice}
        </div>
      </div>
      <div className="text-muted-foreground text-xs py-2">
        {t("List price")}:{" "}
        <span className="line-through">
          {formattedListPrice}
        </span>
      </div>
    </div>
  );
};

export default ProductPrice;
