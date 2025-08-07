export interface PaginatedResult<T> {
  result: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNextPage: boolean;
  };
}
