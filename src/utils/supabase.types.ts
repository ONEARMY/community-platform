import type { Json } from 'src/database.types';

export function toJson<T>(value: T): Json {
  return value as unknown as Json;
}

export function fromJson<T>(value: Json | null | undefined): T | null {
  if (value === null || value === undefined) return null;
  return value as unknown as T;
}

export function fromJsonArray<T>(value: Json[] | Json | null | undefined): T[] {
  if (!value || !Array.isArray(value)) return [];
  return value as unknown as T[];
}

export function dbResult<T>(data: unknown): T {
  return data as T;
}

export function dbResultArray<T>(data: unknown): T[] {
  return (data ?? []) as T[];
}
