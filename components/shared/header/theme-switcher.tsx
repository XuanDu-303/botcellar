"use client";

import * as React from "react";
import { ChevronDownIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useColorStore from "@/hooks/use-color-store";
import useIsMounted from "@/hooks/use-is-mounted";
import { useTranslations } from "next-intl";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { availableColors, color, setColor } = useColorStore(theme);
  const isMounted = useIsMounted();
  const t = useTranslations("Header");

  const handleChangeTheme = (value: string) => {
    setTheme(value);
  };

  const handleChangeColor = (value: string) => {
    setColor(value, true);
  };

  const isDark = theme === "dark" && isMounted;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="header-button h-[41px]">
        <div className="flex items-center gap-1">
          {isDark ? (
            <Moon className="h-4 w-4 text-primary" />
          ) : (
            <Sun className="h-4 w-4 text-primary" />
          )}
          {isDark ? t("Dark") : t("Light")}
          <ChevronDownIcon />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        {/* Theme switcher */}
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={handleChangeTheme}>
          <DropdownMenuRadioItem value="dark">
            <Moon className="h-4 w-4 mr-1 text-primary" /> {t("Dark")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <Sun className="h-4 w-4 mr-1 text-primary" /> {t("Light")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        {/* Color switcher */}
        <DropdownMenuLabel>{t("Color")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={color.name}
          onValueChange={handleChangeColor}
        >
          {availableColors.map((c) => (
            <DropdownMenuRadioItem key={c.name} value={c.name}>
              <div
                style={{ backgroundColor: c.name }}
                className="h-4 w-4 mr-1 rounded-full"
              />
              {t(c.name)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
