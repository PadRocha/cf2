export interface IStatus {
  defective: number;
  found: number;
  photographed: number;
  prepared: number;
  edited: number;
  saved: number;
}

export interface IKeyInfo {
  status: IStatus;
  success: number;
}

export interface IPaginate {
  totalDocs: number;
  limit: number;
  page: number;
  nextPage: number | null;
  prevPage: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
}
