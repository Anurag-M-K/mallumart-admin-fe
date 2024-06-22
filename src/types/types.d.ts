type TStoreValues = {
    [key:string]:any;
    shopImgUrl :string;
    storeName : string;
    district: string;
    wholeSale?:boolean;
    retail?:boolean;
    email:string;
    address:string;
    category:string;
    phone:string;
    storeOwnerName:string;
    bio:string;
    storeId?:string;
    location: {
        latitude: number;
        longitude: number;
    };
}
type ICategorySchema = {
    label: string;
    value: string;
}

type TChangePassword = {
    password:string;
    newPassword:string;
    reEnterPassword:string;
}
type TStoreLiveStatus = {
    temporarilyClosed?:string;
    permenantlyClosed?:string;
    open?:string;
}

type TCarousal = {
    images: string[];
    isShow: string;
}

type TAdvertisement = {
    image:string;
    isMainAdvertisementShow?:boolean;
    isSecondAdvertisementShow?:boolean;
    store?:string;
}

type TAdvertisementUpdate = {
    advertisementId:string;
    advertisement:string;
}
type TTarget = {
    target:number;
    staffId :string;
}

type TStaffData = {
        _id: string;
        name: string;
        email: string;
        password: string;
        status: string;
        addedStores: Array<string>;
        addedProducts:Array<string>;
        target:number;
        addedStoresCount:number;
}

type TRecordsData = {
    storeName:string;
    district:string;
    phone:string;
    email:string;
    wholeSale:any;
    retail:any;
    status:any;
    _id:string;

}