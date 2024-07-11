
export interface IAddStore {
    otp?: string;
    storeName: string;
    uniqueName: string;
    retail: boolean;
    wholesale: boolean;
    latitude: number;
    longitude: number;
    city: string;
    address?: string;
    storeOwnerName: string;
    district: string;
    phone: string;
    whatsapp: string;
    category: string;
    bio?: string;
    email?: string;
    shopImgUrl: string;      
    subscriptionPlan: string;
}

interface Location {
    type: string;
    coordinates: [number, number];
}

interface SubscriptionPlan {
    _id: string;
    name: string;
}

interface Subscription {
    plan: SubscriptionPlan;
    activatedAt: string;
    expiresAt: string;
}

interface Category {
    _id: string;
    name: string;
}

export interface IStore {
    location: Location;
    subscription: Subscription;
    _id: string;
    storeName: string;
    uniqueName: string;
    category: Category;
    retail: boolean;
    wholesale: boolean;
    city: string;
    district: string;
    address: string;
    storeOwnerName: string;
    phone: string;
    whatsapp: string;
    email: string;
    bio: string;
    shopImgUrl: string;
    isActive: boolean;
    isAvailable: boolean;
    addedBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}