import { IImage } from "./image";
import { ILine } from "./line";

export interface IKey {
  readonly _id: string;
  line?: ILine;
  code: string;
  desc: string;
  image: IImage[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
