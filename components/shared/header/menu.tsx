import CartButton from "./cart-button";
import UserButton from "./user-button";
import ThemeSwitcher from "./theme-switcher";
import LanguageSwitcher from "./language-switcher";

import { EllipsisVertical } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useTranslations } from "next-intl";

const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  const t = useTranslations("Header");

  return (
    <div className="flex justify-end">
      {/* Desktop */}
      <nav className="hidden md:flex gap-2 w-full items-center justify-end">
        <ThemeSwitcher />
        <LanguageSwitcher />
        <UserButton />
        {!forAdmin && <CartButton />}
      </nav>

      {/* Mobile */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle header-button">
            <EllipsisVertical className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent className="bg-popover text-popover-foreground w-1/2 items-start p-2">
            <SheetHeader className="flex items-start justify-between w-full border">
                <SheetTitle>{t("Site Menu")}</SheetTitle>
            </SheetHeader>
            <hr className="border-border border-[1.5px] w-full m-0 rounded-2xl" />
            <div className="px-2 flex flex-col items-end gap-4 w-full">
              <ThemeSwitcher />
              <hr className="border-border w-full rounded-2xl" />
              <LanguageSwitcher />
              <hr className="border-border w-full rounded-2xl" />
              <UserButton />
              <hr className="border-border w-full rounded-2xl" />
              {!forAdmin && <CartButton />}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
