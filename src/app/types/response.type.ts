export interface BackendResponse<T> {
  success: boolean;
  result: {
    code: number;
    message: string | string[];
    audit: string;
    data: T;
  };
}
