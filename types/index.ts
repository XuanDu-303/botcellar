import {
  ProductInputSchema,
  OrderItemSchema,
  CartSchema,
  UserInputSchema,
  UserSignInSchema,
  UserSignUpSchema,
  ShippingAddressSchema,
  OrderInputSchema,
  ReviewInputSchema,
  UserNameSchema,
} from "@/lib/validator";
import { z } from "zod";

export type IProductInput = z.infer<typeof ProductInputSchema>;

export type Option = {
  label: string;
  value: string;
};

export type Data = {
  users: IUserInput[];
  products: IProductInput[];
  reviews: {
    title: string;
    rating: number;
    comment: string;
  }[];
  headerMenus: {
    name: string;
    href: string;
  }[];
  carousels: {
    image: string;
    url: string;
    title: string;
    buttonCaption: string;
    isPublished: boolean;
  }[];

  categories: Option[];
  brands: Option[];
  sizes: Option[];
  tags: Option[];
};


export type CardItem = {
  title: string
  link: { text: string; href: string }
  items: {
    name: string
    items?: string[]
    image: string
    href: string
  }[]
}

export type IReviewInput = z.infer<typeof ReviewInputSchema>

export type IReviewDetails = IReviewInput & {
  _id: string
  createdAt: string
  user: {
    name: string
    image: string
  }
}

export type IOrderList = IOrderInput & {
  _id: string
  user: {
    name: string
    email: string
  }
  createdAt: Date
}

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type IOrderInput = z.infer<typeof OrderInputSchema>
export type Cart = z.infer<typeof CartSchema>;
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

export type IUserInput = z.infer<typeof UserInputSchema>;
export type IUserSignIn = z.infer<typeof UserSignInSchema>;
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IUserName = z.infer<typeof UserNameSchema>