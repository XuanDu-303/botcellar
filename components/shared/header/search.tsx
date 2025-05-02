import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/product.actions";
import { APP_NAME } from "@/lib/constants";

export default async function Search() {
  const categories = await getAllCategories();

  return (
    <form
      action="/search"
      method="GET"
      className="group flex items-stretch h-[38px] bg-muted/50 overflow-hidden rounded-md 
    transition focus-within:ring-3 focus-within:ring-primary/50 focus-within:outline-none"
    >
      {/* Select Category */}
      <Select name="category">
        <SelectTrigger
          className="w-auto min-h-[38px] rounded-none rounded-l-md !bg-muted/90
        text-foreground 
        focus:outline-none focus:ring-0 transition
        border border-r-0 border-muted-foreground 
        group-focus-within:border-y-primary group-focus-within:border-l-primary
      "
        >
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="bg-popover text-foreground border border-border shadow-md"
        >
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search Input */}
      <Input
        name="q"
        type="search"
        placeholder={`Search Site ${APP_NAME}`}
        className="flex-1 min-h-[38px] bg-muted text-foreground text-base 
        rounded-none border border-x-0 border-muted-foreground 
        
        focus:!outline-none focus:!ring-0
        focus:border-x-transparent
        group-focus-within:!border-y-primary
        shadow-none
        appearance-none
    "
      />

      {/* Search Button */}
      <button
        type="submit"
        className="bg-primary text-primary-foreground flex items-center justify-center 
      px-[10px] rounded-r-md hover:bg-primary/90 transition-colors cursor-pointer"
      >
        <SearchIcon className="size-6" />
      </button>
    </form>
  );
}
