export interface ICode {
  id?: string;
  name?: string;
  description?: string;
  parentCodeId?: string;
  order?: number;
  color?: string;
}

export const defaultValue: Readonly<ICode> = {};
