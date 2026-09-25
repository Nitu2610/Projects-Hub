export interface ParentCategory {
  _id: string | null;
  name: string | null;
}


export interface AddCategoryRequest {
  name: string;
  parent?: string | null;
}

export interface UpdateCategoryRequest {
  id: string;
  name: string;
}

export interface UpdateCategoryStatusRequest {
  id: string;
  active: boolean;
}


export interface CustomerCategory {
  _id: string;
  name: string;
  active: boolean;
  parent: string | null;
}


export interface AdminCategory {
  _id: string;
  name: string;
  active: boolean;
  productCount: number;
  parent: ParentCategory | null;
}