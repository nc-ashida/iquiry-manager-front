import { useState, useCallback } from 'react';

export interface UseAsyncOperationOptions {
    onError?: (error: Error) => void;
    onSuccess?: (result: unknown) => void;
}

export interface UseAsyncOperationReturn<T, P extends unknown[]> {
    loading: boolean;
    error: string | null;
    execute: (...args: P) => Promise<T | null>;
    clearError: () => void;
}

/**
 * 非同期操作を管理するフック
 * ローディング状態、エラーハンドリング、成功時のコールバックを統一化
 */
export function useAsyncOperation<T, P extends unknown[]>(
    operation: (...args: P) => Promise<T>,
    options: UseAsyncOperationOptions = {}
): UseAsyncOperationReturn<T, P> {
    const { onError, onSuccess } = options;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (...args: P): Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await operation(...args);
            onSuccess?.(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '操作に失敗しました';
            setError(errorMessage);

            const error = err instanceof Error ? err : new Error(errorMessage);
            onError?.(error);

            return null;
        } finally {
            setLoading(false);
        }
    }, [operation, onError, onSuccess]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        execute,
        clearError
    };
}
