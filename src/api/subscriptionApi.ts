import instance from '../config/axiosInstance';

import { ISubscriptionPlans } from '../types/subscription-plan';

export const getSubsciptionPlans = async (): Promise<ISubscriptionPlans[]> => {
    const { data } = await instance.get('/api/subscription');
    return data as ISubscriptionPlans[];
};
