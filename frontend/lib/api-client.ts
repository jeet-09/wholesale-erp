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
  // GET/HEAD must not send Content-Type: application/json — Rails may treat that
  // as a JSON body and inject empty resource keys like customer: {}.
  const method = (options.method ?? "GET").toUpperCase();
  const hasBody = options.body != null && options.body !== "";
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(options.headers ?? {}),
  };
  if (hasBody && method !== "GET" && method !== "HEAD") {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers,
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

/** GET binary (e.g. CSV template) with session cookie. */
export async function apiDownload(path: string, filename: string): Promise<void> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Download failed");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Multipart upload (e.g. product CSV import). */
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
    credentials: "include",
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
