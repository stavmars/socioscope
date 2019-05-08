import { IUser } from 'app/shared/model/user.model';
import { ICodelist } from 'app/shared/model/codelist.model';

export interface IDimension {
  id?: string;
  name?: string;
  type?: string;
  codelist?: ICodelist;
  creator?: IUser;
}

export const defaultValue: Readonly<IDimension> = {};
