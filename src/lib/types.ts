export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  color?: string;
  isCover?: boolean;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  subtitle: string;
  price: string;
  clpPrice?: string;
  order: number;
  active: boolean;
  images: ProductImage[];
  colors: string[];
};

export type Category = {
  id: string;
  name: string;
  tagline: string;
  tone: "red" | "blue" | "dark" | "gold";
  order: number;
};

export type CatalogData = {
  categories: Category[];
  products: Product[];
};
