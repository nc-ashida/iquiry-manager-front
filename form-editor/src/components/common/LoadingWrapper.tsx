import React from 'react';
import LoadingSpinner from '../LoadingSpinner';

interface LoadingWrapperProps {
    loading: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    className?: string;
}

/**
 * ローディング状態を表示するラッパーコンポーネント
 * ローディング中はフォールバックコンテンツを表示し、完了後に子コンポーネントを表示
 */
export function LoadingWrapper({
    loading,
    children,
    fallback,
    className = ''
}: LoadingWrapperProps) {
    if (loading) {
        return (
            <div className={`flex items-center justify-center p-8 ${className}`}>
                {fallback || <LoadingSpinner />}
            </div>
        );
    }

    return <>{children}</>;
}
