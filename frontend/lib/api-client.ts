/**
 * Central HTTP client for the Rails API.
 * Uses cookie sessions — always send credentials.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export type ApiError = { code: string; message: string };

export type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; errors: ApiError[] };

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public errors: ApiError[]
  ) {
    super(errors[0]?.message ?? "Request failed");
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers ?? {}),
    },
  });

  const body = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !body.success) {
    const errors =
      "errors" in body && body.errors?.length
        ? body.errors
        : [{ code: "http_error", message: response.statusText }];
    throw new ApiClientError(response.status, errors);
  }

  return body.data;
}
