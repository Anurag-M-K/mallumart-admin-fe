export interface ICategory {
    _id: string;
    name: string;
    parentId: string;
    isActive: boolean;
    isPending: boolean;
    isShowOnHomePage: boolean;
}

type ICategoryFormat = Omit<ICategory, 'isPending' | 'parentId'>;

export interface ICategoryFormatted extends ICategoryFormat {
    subcategories: Omit<ICategoryFormat, 'isShowOnHomePage'>[];
}

export interface ICategorySelectOptions extends Pick<ICategory, '_id' | 'name'> {}

export interface ISubCategoryPending extends Pick<ICategory, '_id' | 'name'> {
    parentId: {
        name: string;
    };
}

// export type ICategoryFormatted = Pick<ICategory, '_id', "">;
