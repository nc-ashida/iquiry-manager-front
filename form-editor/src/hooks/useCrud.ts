import { useState, useCallback, useEffect } from 'react';
import { generateId } from '@/shared/utils/dataManager';

export interface CrudItem {
    id: string;
}

export interface UseCrudOptions<T> {
    storageKey: string;
    initialData?: T[];
    onError?: (error: Error) => void;
}

export interface UseCrudReturn<T extends CrudItem> {
    items: T[];
    loading: boolean;
    error: string | null;
    create: (item: Omit<T, 'id'>) => Promise<T>;
    update: (id: string, updates: Partial<T>) => Promise<T | undefined>;
    remove: (id: string) => Promise<void>;
    setItems: (items: T[]) => void;
    clearError: () => void;
    refresh: () => void;
}

/**
 * 汎用CRUD操作フック
 * フォーム、署名、問い合わせなどのCRUD操作を統一化
 */
export function useCrud<T extends CrudItem>(
    options: UseCrudOptions<T>
): UseCrudReturn<T> {
    const { storageKey, initialData = [], onError } = options;

    const [items, setItems] = useState<T[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ローカルストレージからデータを読み込み
    const loadFromStorage = useCallback((): T[] => {
        if (typeof window === 'undefined') return initialData;

        try {
            const data = localStorage.getItem(storageKey);
            return data ? JSON.parse(data) : initialData;
        } catch (err) {
            console.error(`Failed to load data from ${storageKey}:`, err);
            return initialData;
        }
    }, [storageKey, initialData]);

    // ローカルストレージにデータを保存
    const saveToStorage = useCallback((data: T[]) => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (err) {
            console.error(`Failed to save data to ${storageKey}:`, err);
            throw new Error('データの保存に失敗しました');
        }
    }, [storageKey]);

    // 初期データの読み込み
    useEffect(() => {
        const loadedItems = loadFromStorage();
        setItems(loadedItems);
    }, [loadFromStorage]);

    // エラーハンドリング
    const handleError = useCallback((err: unknown, defaultMessage: string) => {
        const error = err instanceof Error ? err : new Error(defaultMessage);
        setError(error.message);
        onError?.(error);
        throw error;
    }, [onError]);

    // 作成
    const create = useCallback(async (item: Omit<T, 'id'>): Promise<T> => {
        setLoading(true);
        setError(null);

        try {
            const newItem = { ...item, id: generateId() } as T;
            const updatedItems = [...items, newItem];

            setItems(updatedItems);
            saveToStorage(updatedItems);

            return newItem;
        } catch (err) {
            return handleError(err, '作成に失敗しました');
        } finally {
            setLoading(false);
        }
    }, [items, saveToStorage, handleError]);

    // 更新
    const update = useCallback(async (id: string, updates: Partial<T>): Promise<T | undefined> => {
        setLoading(true);
        setError(null);

        try {
            const updatedItems = items.map(item =>
                item.id === id ? { ...item, ...updates } : item
            );

            setItems(updatedItems);
            saveToStorage(updatedItems);

            return updatedItems.find(item => item.id === id);
        } catch (err) {
            return handleError(err, '更新に失敗しました');
        } finally {
            setLoading(false);
        }
    }, [items, saveToStorage, handleError]);

    // 削除
    const remove = useCallback(async (id: string): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const updatedItems = items.filter(item => item.id !== id);

            setItems(updatedItems);
            saveToStorage(updatedItems);
        } catch (err) {
            handleError(err, '削除に失敗しました');
        } finally {
            setLoading(false);
        }
    }, [items, saveToStorage, handleError]);

    // エラーをクリア
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // データをリフレッシュ
    const refresh = useCallback(() => {
        const loadedItems = loadFromStorage();
        setItems(loadedItems);
    }, [loadFromStorage]);

    return {
        items,
        loading,
        error,
        create,
        update,
        remove,
        setItems,
        clearError,
        refresh
    };
}
