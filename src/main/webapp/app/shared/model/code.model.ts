export interface ICode {
  id?: string;
  name?: string;
  description?: string;
  parentId?: string;
  order?: number;
  color?: string;
}

export const defaultValue: Readonly<ICode> = {};
