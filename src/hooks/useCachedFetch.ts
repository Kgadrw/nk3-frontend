'use client';

import { useState, useEffect, useCallback } from 'react';
import { cachedFetch, invalidateCache } from '@/lib/apiCache';

interface UseCachedFetchOptions {
  ttl?: number; // Time to live in milliseconds
  enabled?: boolean; // Whether to fetch immediately
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseCachedFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  invalidate: () => void;
}

/**
 * Custom hook for fetching data with caching
 */
export function useCachedFetch<T = any>(
  url: string | null,
  options?: UseCachedFetchOptions
): UseCachedFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(url !== null && (options?.enabled !== false));
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await cachedFetch<T>(url, undefined, options?.ttl);
      
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [url, options?.ttl, options?.onSuccess, options?.onError]);

  const invalidate = useCallback(() => {
    if (url) {
      invalidateCache(url);
    }
  }, [url]);

  useEffect(() => {
    if (url && options?.enabled !== false) {
      fetchData();
    }
  }, [url, options?.enabled, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    invalidate,
  };
}
