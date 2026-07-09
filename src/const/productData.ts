import productsJson from "@/data/products.json";

export interface Product {
    id: number;
    title: string;
    subtitle: string;
    price: number;
    oldPrice?: number;
    discount?: string;
    badge?: string;
    imgOne: string;
    imgTwo: string;
    categories: string[];
    size: string[];
    availability: string;
    colors: string[];
    review?: number;
    shortDesc?: string;
}

export const products: Product[] = productsJson as Product[];
