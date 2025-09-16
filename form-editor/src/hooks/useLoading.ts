import { useState, useCallback } from 'react';

export interface UseLoadingReturn {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    withLoading: <T>(operation: () => Promise<T>) => Promise<T | null>;
}

/**
 * ローディング状態を管理するフック
 * 非同期操作のローディング状態を簡単に管理
 */
export function useLoading(): UseLoadingReturn {
    const [loading, setLoading] = useState(false);

    const withLoading = useCallback(async <T>(
        operation: () => Promise<T>
    ): Promise<T | null> => {
        setLoading(true);
        try {
            return await operation();
        } catch (error) {
            console.error('Operation failed:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        setLoading,
        withLoading
    };
}
