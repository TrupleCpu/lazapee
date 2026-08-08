import { useCallback, useEffect, useRef, useState } from "react";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseFetchOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
}

export const useFetch = <T,>(
  fetcher: () => Promise<T>,
  options: UseFetchOptions = {},
) => {
  const { immediate = true, onSuccess } = options;
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });
  const cancelledRef = useRef(false);
  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    fetcherRef.current = fetcher;
    onSuccessRef.current = onSuccess;
  });

  const run = useCallback(async () => {
    cancelledRef.current = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      if (cancelledRef.current) return;
      setState({ data, loading: false, error: null });
      onSuccessRef.current?.(data);
    } catch (error) {
      if (cancelledRef.current) return;
      setState({ data: null, loading: false, error: error as Error });
    }
  }, []);

  useEffect(() => {
    if (!immediate) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    void run();
    return () => {
      cancelledRef.current = true;
    };
  }, [run, immediate]);

  return { ...state, refetch: run };
};