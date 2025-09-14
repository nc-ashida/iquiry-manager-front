'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    onClose?: () => void;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    updateToast: (id: string, updates: Partial<Toast>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// ToastProvider
interface ToastProviderProps {
    children: ReactNode;
    maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = {
            id,
            duration: 5000,
            ...toast
        };

        setToasts(prev => {
            const updated = [newToast, ...prev];
            return updated.slice(0, maxToasts);
        });

        return id;
    }, [maxToasts]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
        setToasts(prev =>
            prev.map(toast =>
                toast.id === id ? { ...toast, ...updates } : toast
            )
        );
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
}

// ToastContainer
function ToastContainer() {
    const { toasts } = useToast();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}

// ToastItem
interface ToastItemProps {
    toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
    const { removeToast, updateToast: _updateToast } = useToast();
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const handleClose = useCallback(() => {
        setIsLeaving(true);
        setTimeout(() => {
            removeToast(toast.id);
            toast.onClose?.();
        }, 300);
    }, [toast, removeToast]);

    useEffect(() => {
        // アニメーション用の表示
        const showTimer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(showTimer);
    }, []);

    useEffect(() => {
        if (toast.type === 'loading' || !toast.duration) return;

        const timer = setTimeout(() => {
            handleClose();
        }, toast.duration);

        return () => clearTimeout(timer);
    }, [toast.duration, toast.type, handleClose]);

    const handleAction = useCallback(() => {
        toast.action?.onClick();
        handleClose();
    }, [toast.action, handleClose]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-600" />;
            case 'loading':
                return <Loader2 className="h-5 w-5 text-gray-600 animate-spin" />;
            default:
                return null;
        }
    };

    const _getBackgroundColor = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            case 'loading':
                return 'bg-gray-50 border-gray-200';
            default:
                return 'bg-white border-gray-200';
        }
    };

    return (
        <div
            className={cn(
                'transform transition-all duration-300 ease-in-out',
                isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
                'bg-white border rounded-lg shadow-lg p-4 min-w-80 max-w-sm'
            )}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start space-x-3">
                {getIcon()}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900">{toast.title}</h4>
                    {toast.description && (
                        <p className="mt-1 text-sm text-gray-600">{toast.description}</p>
                    )}
                    {toast.action && (
                        <div className="mt-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAction}
                                className="text-xs hover:bg-gray-50 transition-colors"
                            >
                                {toast.action.label}
                            </Button>
                        </div>
                    )}
                </div>
                {toast.type !== 'loading' && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                        aria-label="通知を閉じる"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

// 便利な関数
export function useToastHelpers() {
    const { addToast, updateToast, removeToast } = useToast();

    const success = useCallback((title: string, description?: string, options?: Partial<Toast>) => {
        return addToast({
            type: 'success',
            title,
            description,
            ...options
        });
    }, [addToast]);

    const error = useCallback((title: string, description?: string, options?: Partial<Toast>) => {
        return addToast({
            type: 'error',
            title,
            description,
            duration: 7000, // エラーは長めに表示
            ...options
        });
    }, [addToast]);

    const warning = useCallback((title: string, description?: string, options?: Partial<Toast>) => {
        return addToast({
            type: 'warning',
            title,
            description,
            ...options
        });
    }, [addToast]);

    const info = useCallback((title: string, description?: string, options?: Partial<Toast>) => {
        return addToast({
            type: 'info',
            title,
            description,
            ...options
        });
    }, [addToast]);

    const loading = useCallback((title: string, description?: string, options?: Partial<Toast>) => {
        return addToast({
            type: 'loading',
            title,
            description,
            duration: 0, // ローディングは自動で閉じない
            ...options
        });
    }, [addToast]);

    const dismiss = useCallback((id: string) => {
        removeToast(id);
    }, [removeToast]);

    const update = useCallback((id: string, updates: Partial<Toast>) => {
        updateToast(id, updates);
    }, [updateToast]);

    return {
        success,
        error,
        warning,
        info,
        loading,
        dismiss,
        update
    };
}

// プレビュー用のデモコンポーネント
export function ToastDemo() {
    const { success, error, warning, info, loading, dismiss } = useToastHelpers();

    const showSuccess = () => {
        success('保存完了', 'フォームが正常に保存されました');
    };

    const showError = () => {
        error('エラーが発生しました', 'ネットワークエラーが発生しました。しばらく時間をおいて再度お試しください。');
    };

    const showWarning = () => {
        warning('注意が必要です', 'この操作は取り消すことができません。');
    };

    const showInfo = () => {
        info('情報', '新しい機能が追加されました。');
    };

    const showLoading = () => {
        const id = loading('処理中...', 'データを保存しています');
        setTimeout(() => {
            dismiss(id);
            success('保存完了', 'データが正常に保存されました');
        }, 3000);
    };

    return (
        <div className="space-y-2">
            <Button onClick={showSuccess} variant="outline" size="sm" className="hover:bg-gray-50 transition-colors">
                成功通知
            </Button>
            <Button onClick={showError} variant="outline" size="sm" className="hover:bg-gray-50 transition-colors">
                エラー通知
            </Button>
            <Button onClick={showWarning} variant="outline" size="sm" className="hover:bg-gray-50 transition-colors">
                警告通知
            </Button>
            <Button onClick={showInfo} variant="outline" size="sm" className="hover:bg-gray-50 transition-colors">
                情報通知
            </Button>
            <Button onClick={showLoading} variant="outline" size="sm" className="hover:bg-gray-50 transition-colors">
                ローディング通知
            </Button>
        </div>
    );
}
