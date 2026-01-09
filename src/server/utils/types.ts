export type PaginatedResult<T> = {
  items: T[];
  pagination: {
    total: number;
    take: number;
    skip: number;
  };
};
