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
    <form action="/search" method="GET" className="flex items-stretch h-[38px] rounded-md overflow-hidden bg-muted/50">
      <Select name="category">
        <SelectTrigger className="w-auto min-h-[38px] bg-muted/90 dark:border-gray-200 focus:border-primary dark:focus:border-primary text-foreground border-border border-r-0 rounded-r-none rounded-l-ms">
          <SelectValue placeholder="All" />
        </SelectTrigger>  
        <SelectContent position="popper" className="bg-popover text-foreground border border-border shadow-md">
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="flex-1 dark:border-gray-200 focus:border-primary dark:focus:border-primary rounded-none bg-muted text-foreground text-base h-full"
        placeholder={`Search Site ${APP_NAME}`}
        name="q"
        type="search"
      />
      <button
        type="submit"
        className="bg-primary text-primary-foreground rounded-r-sm border-primary flex items-center justify-center hover:bg-primary/90 transition-colors px-[10px] cursor-pointer"
      >
        <SearchIcon className="size-6" />
      </button>
    </form>
  );
}
