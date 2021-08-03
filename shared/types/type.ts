export interface IResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

export type RequestOmitPaginator<T> = Omit<T, "page" | "limit">;
export interface Paginator {
  page: number;
  limit: number;
}

export interface ListResponse {
  total: number;
  paginator?: Paginator;
}

export interface QueryParams {
  [key: string]: string | number;
}
