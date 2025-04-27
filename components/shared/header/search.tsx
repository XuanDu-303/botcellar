import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from '@/lib/actions/product.actions'
import { APP_NAME } from "@/lib/constants";


export default async function Search() {
  const categories = await getAllCategories()
  
  return (
    <form action="/search" method="GET" className="flex items-stretch h-[38px]">
      <Select name="category">
        <SelectTrigger className="w-auto min-h-[38px] dark:border-gray-200 bg-gray-100 text-black border-r rounded-r-none rounded-l-sm">
          <SelectValue placeholder="All" />
        </SelectTrigger>  
        <SelectContent position="popper">
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full"
        placeholder={`Search Site ${APP_NAME}`}
        name="q"
        type="search"
      />
      <button
        type="submit"
        className="bg-primary horver:bg-gray-800 text-primary-foreground rounded-s-none rounded-e-sm h-full px-[10px] cursor-pointer"
      >
        <SearchIcon className="size-6" />
      </button>
    </form>
  );
}
