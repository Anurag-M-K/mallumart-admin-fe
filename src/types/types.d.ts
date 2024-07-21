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
    storeProviding:"productBased" | "serviceBased";
    addedBy:string;

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

type TSearchedProducts = {
    _id:string;
    productName:string;
    searchCount:number;
}
type TForgotPasswordPhoneField = {
    phone:string;
}
type TOtp = {
    otp:string
}

type TConfirmPassword = {
    newPassword:string;
    confirmPassword:string;
}
type TUsers = {
     email:string;
     fullName:string;
     phone:string;
     _id:string;
     isVerified:string;
     isBlocked:boolean;
}

type TResponseUsers = {
    users:Array<TUsers>;
    total:number;
}

interface Slot {
    date: Date;
    startTime: string;
    endTime: string;
    token: number;
  }
  
  interface TSlot {
    slots: Slot[];
  }