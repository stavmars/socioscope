interface ILang {
  el?: string;
  en?: string;
}

export interface IDimensionCode {
  id?: string;
  dimensionId?: string;
  notation?: string;
  name?: ILang;
  description?: ILang;
  parentId?: string;
  order?: number;
  color?: string;
}

export const defaultValue: Readonly<IDimensionCode> = {};
