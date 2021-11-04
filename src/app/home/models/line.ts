import { ISupplier } from "./supplier";

export interface ILine {
  readonly _id?: string;
  readonly identifier: string;
  readonly supplier: ISupplier;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly countKeys?: number;
};
