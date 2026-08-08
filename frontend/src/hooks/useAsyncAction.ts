import { useCallback, useState } from "react";

export const useAsyncAction = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(async <T,>(action: () => Promise<T>): Promise<T | null> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await action();
      return result;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { isPending, error, run };
};