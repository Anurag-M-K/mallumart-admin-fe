export interface IProduct {
    name: string;
    images: string[];
    price: number;
    category: string;
    isActive: boolean;
    description?: string | undefined;
    offerPrice?: number | undefined;
    isPending: boolean;
}
