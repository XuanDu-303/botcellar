"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import useSettingStore from "@/hooks/use-setting-store";
import { i18n } from "@/i18n-config";
import { setCurrencyOnServer } from "@/lib/actions/setting.actions";
import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LanguageSwitcher() {
  const { locales } = i18n;
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");

  const {
    setting: { availableCurrencies, currency },
    setCurrency,
  } = useSettingStore();
  console.log(availableCurrencies)
  const handleCurrencyChange = async (newCurrency: string) => {
    await setCurrencyOnServer(newCurrency);
    setCurrency(newCurrency);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 header-button h-[41px]">
        <div className="flex items-center gap-1">
          <span className="text-xl pb-2">
            {locales.find((l) => l.code === locale)?.icon}
          </span>
          <span className="text-xs pt-1">
            ⁄ {availableCurrencies.find(c => c.code === currency)?.symbol || currency}
          </span>
        </div>
          <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t("Language")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale}>
          {locales.map((c) => (
            <DropdownMenuRadioItem key={c.name} value={c.code}>
              <Link
                className="w-full flex items-center gap-1"
                href={pathname}
                locale={c.code}
              >
                <span className="text-lg">{c.icon}</span> {t(c.name)}
              </Link>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>{t("Currency")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={currency}
          onValueChange={handleCurrencyChange}
        >
          {availableCurrencies.map((c) => (
            <DropdownMenuRadioItem key={c.name} value={c.code}>
              {c.symbol} {c.code}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
