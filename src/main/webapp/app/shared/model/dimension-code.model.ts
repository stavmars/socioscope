export interface IDimensionCode {
  id?: string;
  dimensionId?: string;
  notation?: string;
  name?: string;
  description?: string;
  parentId?: string;
  order?: number;
  color?: string;
}

export const defaultValue: Readonly<IDimensionCode> = {};
