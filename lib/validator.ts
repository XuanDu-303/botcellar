import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

// Common
const Price = (field: string) =>
  z.coerce
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
      `${field} must have exactly two decimal places (e.g., 49.99)`
    );
// .transform((val) => parseFloat(formatNumberWithDecimal(val)))

export const ProductInputSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(1, "Description is required"),
  isPublished: z.boolean(),
  price: Price("Price"),
  listPrice: Price("List price"),
  countInStock: z.coerce
    .number()
    .int()
    .nonnegative("count in stock must be a non-negative number"),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  avgRating: z.coerce
    .number()
    .min(0, "Average rating must be at least 0")
    .max(5, "Average rating must be at most 5"),
  numReviews: z.coerce
    .number()
    .int()
    .nonnegative("Number of reviews must be a non-negative number"),
  ratingDistribution: z
    .array(z.object({ rating: z.number(), count: z.number() }))
    .max(5),
  reviews: z.array(z.string()).default([]),
  numSales: z.coerce // autotimatically convert string to number
    .number()
    .int()
    .nonnegative("Number of sales must be a non-negative number"),
});

export const OrderItemSchema = z.object({
  cartItemId: z.string().min(1, "Cart item ID is required"),
  product: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be a non-negative number"),
  countInStock: z
    .number({ invalid_type_error: "Stock count must be a number" })
    .int("Stock count must be an integer")
    .nonnegative("Stock count must be a non-negative number"),
  image: z
    .string()
    .url("Image must be a valid URL")
    .min(1, "Image is required"),
  price: Price("Price"),
  size: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
});

export const CartSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1, "Order must contain at least one item"),
  itemsPrice: z.number().nonnegative(),
  taxPrice: z.number().nonnegative().optional(),
  shippingPrice: z.number().nonnegative().optional(),
  totalPrice: z.number().nonnegative(),
  paymentMethod: z.string().min(1).optional(),
  deliveryDateIndex: z.number().optional(),
  expectedDeliveryDate: z.date().optional(),
});
