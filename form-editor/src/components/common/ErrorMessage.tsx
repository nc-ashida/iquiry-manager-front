import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
    className?: string;
    variant?: 'default' | 'destructive';
}

/**
 * エラーメッセージを表示するコンポーネント
 * 統一されたエラー表示とユーザーフレンドリーなメッセージ
 */
export function ErrorMessage({
    message,
    onDismiss,
    className = '',
    variant = 'destructive'
}: ErrorMessageProps) {
    const baseClasses = 'flex items-center p-4 rounded-md border';
    const variantClasses = {
        default: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        destructive: 'bg-red-50 border-red-200 text-red-800'
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} role="alert">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <div className="flex-1">
                <p className="text-sm font-medium">エラーが発生しました</p>
                <p className="text-sm mt-1">{message}</p>
            </div>
            {onDismiss && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDismiss}
                    className="ml-3 flex-shrink-0 hover:bg-gray-100 transition-colors duration-200"
                    aria-label="エラーを閉じる"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
