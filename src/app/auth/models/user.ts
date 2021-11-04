import { IImage } from './image';

export interface IUser {
  readonly _id?: string;
  readonly sub?: string;
  readonly image?: IImage;
  readonly password?: string;
  readonly role?: string;
}
