export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.code === 'number' &&
    typeof candidate.message === 'string' &&
    typeof candidate.timestamp === 'string' &&
    'data' in candidate
  );
}

export async function readJsonSafe(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function normalizePaginatedData<T>(
  payload: unknown,
  defaults: { page?: number; pageSize?: number } = {}
): PaginatedData<T> {
  if (Array.isArray(payload)) {
    const total = payload.length;
    return {
      items: payload as T[],
      pagination: {
        page: defaults.page ?? 1,
        pageSize: defaults.pageSize ?? total,
        total,
        totalPages: total > 0 ? 1 : 0,
      },
    };
  }

  if (!payload || typeof payload !== 'object') {
    return {
      items: [],
      pagination: {
        page: defaults.page ?? 1,
        pageSize: defaults.pageSize ?? 20,
        total: 0,
        totalPages: 0,
      },
    };
  }

  const record = payload as Record<string, unknown>;
  const paginationRecord =
    record.pagination && typeof record.pagination === 'object'
      ? (record.pagination as Record<string, unknown>)
      : {};

  const items = Array.isArray(record.items) ? (record.items as T[]) : [];
  const page =
    typeof paginationRecord.page === 'number'
      ? paginationRecord.page
      : typeof record.page === 'number'
        ? record.page
        : defaults.page ?? 1;
  const pageSize =
    typeof paginationRecord.pageSize === 'number'
      ? paginationRecord.pageSize
      : typeof record.pageSize === 'number'
        ? record.pageSize
        : typeof record.size === 'number'
          ? record.size
          : defaults.pageSize ?? 20;
  const total =
    typeof paginationRecord.total === 'number'
      ? paginationRecord.total
      : typeof record.total === 'number'
        ? record.total
        : items.length;
  const totalPages =
    typeof paginationRecord.totalPages === 'number'
      ? paginationRecord.totalPages
      : pageSize > 0
        ? Math.ceil(total / pageSize)
        : 0;

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}
