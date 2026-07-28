import type { Remake } from 'oa-shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import { remakeService } from 'src/services/remakeService';

interface UseRemakesReturn {
  remakes: Remake[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  addRemake: (remake: Remake) => void;
  replaceRemake: (remake: Remake) => void;
  removeRemake: (remakeId: number) => void;
}

const FETCH_ERROR_MESSAGE = 'Error loading remakes. Please try again later.';

/**
 * Owns the remakes list for a project: fetch lifecycle (incl. reload) and the
 * local mutations that keep it in sync after create/update/delete, without a
 * round trip to the server. `onCountChange` fires only once the list reflects
 * a real count - never while loading or errored.
 */
export const useRemakes = (
  projectId: number,
  onCountChange?: (count: number) => void,
): UseRemakesReturn => {
  const [remakes, setRemakes] = useState<Remake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const onCountChangeRef = useRef(onCountChange);
  onCountChangeRef.current = onCountChange;

  useEffect(() => {
    let ignore = false;

    const fetchRemakes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await remakeService.getRemakes(projectId);

        if (ignore) {
          return;
        }

        setRemakes(result);
        onCountChangeRef.current?.(result.length);
      } catch (err) {
        console.error(err);

        if (!ignore) {
          setError(FETCH_ERROR_MESSAGE);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchRemakes();

    return () => {
      ignore = true;
    };
  }, [projectId, reloadKey]);

  const refetch = useCallback(() => setReloadKey((current) => current + 1), []);

  const addRemake = useCallback((remake: Remake) => {
    setRemakes((current) => {
      const next = [remake, ...current];
      onCountChangeRef.current?.(next.length);
      return next;
    });
  }, []);

  const replaceRemake = useCallback((remake: Remake) => {
    setRemakes((current) => current.map((x) => (x.id === remake.id ? remake : x)));
  }, []);

  const removeRemake = useCallback((remakeId: number) => {
    setRemakes((current) => {
      const next = current.filter((x) => x.id !== remakeId);
      onCountChangeRef.current?.(next.length);
      return next;
    });
  }, []);

  return { remakes, isLoading, error, refetch, addRemake, replaceRemake, removeRemake };
};
