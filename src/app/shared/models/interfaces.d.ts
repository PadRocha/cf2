export interface DataPaginated<T> {
  data?: T[];
  totalDocs: number;
  limit: number;
  page: number;
  nextPage: number | null;
  prevPage: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
}
export interface HttpError {
  status: number;
  message: string;
}
