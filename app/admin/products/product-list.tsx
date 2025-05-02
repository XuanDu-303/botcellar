"use client";
import Link from "next/link";

import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteProduct,
  getAllProductsForAdmin,
} from "@/lib/actions/product.actions";
import { IProduct } from "@/lib/db/models/product.model";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { formatDateTime, formatId } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "@/components/shared/loading";

type ProductListDataProps = {
  products: IProduct[];
  totalPages: number;
  totalProducts: number;
  to: number;
  from: number;
};
const ProductList = () => {
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [data, setData] = useState<ProductListDataProps>();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (changeType: "next" | "prev") => {
    const newPage = changeType === "next" ? page + 1 : page - 1;
    if (changeType === "next") {
      setPage(newPage);
    } else {
      setPage(newPage);
    }
    startTransition(async () => {
      const data = await getAllProductsForAdmin({
        query: inputValue,
        page: newPage,
      });
      setData(data);
    });
  };

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value) {
      debounceRef.current = setTimeout(() => {
        startTransition(async () => {
          const data = await getAllProductsForAdmin({ query: value, page: 1 });
          setData(data);
        });
      }, 500);
    } else {
      startTransition(async () => {
        const data = await getAllProductsForAdmin({ query: "", page });
        setData(data);
      });
    }
  };

  useEffect(() => {
    startTransition(async () => {
      const data = await getAllProductsForAdmin({ query: "" });
      setData(data);
    });
  }, []);

  return (
    <div>
      <div className="space-y-2">
        <div className="flex-between flex-wrap gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-bold text-lg">Products</h1>
            <div className="flex flex-wrap items-center gap-2 ">
              <Input
                className="w-auto"
                type="text "
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Filter name..."
              />

              {isPending ? (
                <div className="flex justify-center items-center gap-1 text-sm"><Loading />Loading...</div>
              ) : (
                <p>
                  {data?.totalProducts === 0
                    ? "No"
                    : `${data?.from}-${data?.to} of ${data?.totalProducts}`}
                  {" results"}
                </p>
              )}
            </div>
          </div>

          <Button asChild variant="default">
            <Link href="/admin/products/create">Create Product</Link>
          </Button>
        </div>
        <div className="space-y-4">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Id</TableHead>
        <TableHead>Name</TableHead>
        <TableHead className="text-right">Price</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Stock</TableHead>
        <TableHead>Rating</TableHead>
        <TableHead>Published</TableHead>
        <TableHead>Last Update</TableHead>
        <TableHead className="text-center w-[130px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data?.products.map((product: IProduct) => (
        <TableRow
          key={product._id}
          className="hover:bg-muted/50 transition-colors"
        >
          <TableCell className="text-xs text-muted-foreground">
            {formatId(product._id)}
          </TableCell>
          <TableCell className="max-w-[200px] truncate" title={product.name}>
            <Link
              className="hover:text-primary font-medium"
              href={`/admin/products/${product._id}`}
            >
              {product.name}
            </Link>
          </TableCell>
          <TableCell className="text-right font-semibold text-green-600">
            ${product.price}
          </TableCell>
          <TableCell>{product.category}</TableCell>
          <TableCell>{product.countInStock}</TableCell>
          <TableCell>{product.avgRating}</TableCell>
          <TableCell>
            {product.isPublished ? (
              <span className="text-green-600 font-semibold">Yes</span>
            ) : (
              <span className="text-red-500 font-semibold">No</span>
            )}
          </TableCell>
          <TableCell>
            {formatDateTime(product.updatedAt).dateTime}
          </TableCell>
          <TableCell>
            <div className="flex justify-center gap-1">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/products/${product._id}`}>Edit</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link target="_blank" href={`/product/${product.slug}`}>
                  View
                </Link>
              </Button>
              <DeleteDialog
                id={product._id}
                action={deleteProduct}
                callbackAction={() => {
                  startTransition(async () => {
                    const data = await getAllProductsForAdmin({
                      query: inputValue,
                    })
                    setData(data)
                  })
                }}
              />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

  {(data?.totalPages ?? 0) > 1 && (
    <div className="flex justify-center items-center gap-4 pt-4 text-sm text-muted-foreground">
      <Button
        variant="outline"
        onClick={() => handlePageChange("prev")}
        disabled={Number(page) <= 1}
        className="w-28 cursor-pointer"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
      </Button>
      <span className="font-medium">
        Page {page} of {data?.totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => handlePageChange("next")}
        disabled={Number(page) >= (data?.totalPages ?? 0)}
        className="w-28 cursor-pointer"
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default ProductList;
