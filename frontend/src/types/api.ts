export interface APIResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  correlation_id?: string;
}

export interface PaginatedList<T> {
  items: T[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: "citizen" | "surveyor" | "officer" | "admin";
  accessToken: string;
}
