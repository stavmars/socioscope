import { Moment } from 'moment';

export interface INewsPost {
  id?: string;
  content?: string;
  previewImageContentType?: string;
  previewImage?: any;
  previewTitle?: string;
  previewSubtitle?: string;
  published?: boolean;
  postDate?: Moment;
}

export const defaultValue: Readonly<INewsPost> = {
  published: false
};
