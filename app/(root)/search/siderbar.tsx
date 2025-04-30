"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import CollapsibleOnMobile from "@/components/shared/collapsible-on-mobile";
import { getAllCategories, getAllTags } from "@/lib/actions/product.actions";
import { getFilterUrl, toSlug } from "@/lib/utils";
import Rating from "@/components/shared/product/rating";

const prices = [
  { name: "$1 to $20", value: "1-20" },
  { name: "$21 to $50", value: "21-50" },
  { name: "$51 to $1000", value: "51-1000" },
];

function toggleTag(currentTags: string[], tag: string) {
  const slug = toSlug(tag);
  const normalizedTags = currentTags.map(toSlug);
  if (normalizedTags.includes(slug)) {
    return normalizedTags.filter((t) => t !== slug).join(",");
  } else {
    return [...normalizedTags, slug].join(",");
  }
}

export default function Sidebar() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<string[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]);

  const params = Object.fromEntries(searchParams.entries());
  const {
    category = "all",
    price = "all",
    rating = "all",
    tags = "all",
  } = params;
  const selectedTags = tags !== "all" ? tags.split(",") : [];

  useEffect(() => {
    async function fetchData() {
      const [cats, tagsArr] = await Promise.all([
        getAllCategories(),
        getAllTags(),
      ]);
      setCategories(cats);
      setTagsList(tagsArr);
    }

    fetchData();
  }, []);

  return (
    <CollapsibleOnMobile title="Filters">
      <div className="space-y-4">
        {/* Department */}
        <div>
          <div className="font-bold my-[2px]">Department</div>
          <ul>
            <li>
              <Link
                href={getFilterUrl({ category: "all", params })}
                className={`hover:text-primary ${category === "all" ? "font-semibold" : ""}`}
              >
                All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={getFilterUrl({ category: c, params })}
                  className={`hover:text-primary ${c === category ? "font-semibold" : ""}`}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div>
          <div className="font-bold my-[2px]">Price</div>
          <ul>
            <li>
              <Link
                href={getFilterUrl({ price: "all", params })}
                className={`hover:text-primary ${price === "all" ? "font-semibold" : ""}`}
              >
                All
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  href={getFilterUrl({ price: p.value, params })}
                  className={`hover:text-primary ${price === p.value ? "font-semibold" : ""}`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Rating */}
        <div>
          <div className="font-bold my-[2px]">Customer Review</div>
          <ul>
            <li>
              <Link
                href={getFilterUrl({ rating: "all", params })}
                className={`hover:text-primary ${rating === "all" ? "font-semibold" : ""}`}
              >
                All
              </Link>
            </li>
            <li>
              <Link
                href={getFilterUrl({ rating: "4", params })}
                className={`hover:text-primary ${rating === "4" ? "font-semibold" : ""}`}
              >
                <div className="flex items-center gap-1">
                  <Rating size={4} rating={4} />
                  <span className="text-xs">& Up</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        {/* Tags */}
        <div>
          <div className="flex justify-between items-center font-bold my-[2px]">
            Tags
            {selectedTags.length > 0 && (
              <Link
                href={getFilterUrl({ params, tags: "all" })}
                className="text-xs text-primary hover:underline"
              >
                Clear All
              </Link>
            )}
          </div>
          <ul className="space-y-1">
            {tagsList.map((t) => {
              const slug = toSlug(t);
              const isChecked = selectedTags.includes(slug);
              return (
                <li key={t}>
                  <Link
                    href={getFilterUrl({
                      params,
                      tags: toggleTag(selectedTags, t),
                    })}
                    className="group flex items-center gap-2 hover:text-primary"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="size-4 accent-primary rounded-md group-hover:border-primary transition"
                    />
                    <span className={`${isChecked ? "font-semibold" : ""}`}>
                      {t}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </CollapsibleOnMobile>
  );
}
