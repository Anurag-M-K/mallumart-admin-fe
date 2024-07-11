export interface ISubscriptionPlan {
    _id: string;
    name: string;
    maxProductImages: number;
}

export type ISubscriptionPlans = ISubscriptionPlan[];