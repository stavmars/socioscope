import { ILang } from 'app/shared/model/language.interface';

export interface IDimensionGroup {
  id?: string;
  name?: ILang;
  description?: ILang;
}

export const defaultValue: Readonly<IDimensionGroup> = { name: {} };
