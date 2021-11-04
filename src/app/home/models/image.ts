export interface IImage {
  readonly idN: number;
  readonly status: 0 | 1 | 2 | 3 | 4 | 5 | number;
  readonly public_id: string | null;
  readonly url: string | null;
}
