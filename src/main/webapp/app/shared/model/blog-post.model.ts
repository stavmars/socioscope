import { Moment } from 'moment';

export interface IBlogPost {
  id?: string;
  previewTitle?: string;
  previewImageContentType?: string;
  previewImage?: any;
  content?: string;
  postDate?: Moment;
  published?: boolean;
  previewText?: string;
}

export const defaultValue: Readonly<IBlogPost> = {
  published: false
};
