import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import Sidebar from "./sidebar";
import { getAllCategories } from "@/lib/actions/product.actions";
import data from "@/lib/data";
import Search from "./search";
import { auth } from "@/lib/auth";

export default async function Header() {
  
  const session = await auth();
  const categories = await getAllCategories();
  return (
    <header className="bg-black text-white">
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex gap-1 items-center header-button font-extrabold text-2xl m-1 "
            >
              <Image
                src="/icons/logo.svg"
                width={40}
                height={40}
                alt={`${APP_NAME} logo`}
              />
              {APP_NAME}
            </Link>
          </div>
          <div className="hidden md:block flex-1 max-w-xl">
            <Search categories={categories}/>
          </div>
          <Menu />
        </div>
        <div className="md:hidden block py-2">
          <Search categories={categories}/>
        </div>
      </div>
      <div className="flex px-3 bg-gray-800 border-y border-gray-800">
        <Sidebar categories={categories} session={session}/>
        <div className="flex items-center text-sm flex-wrap gap-3 overflow-hidden">
          {data.headerMenus.map((menu) => (
            <Link href={menu.href} key={menu.href} className="header-button !py-[10px]">
              {menu.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
