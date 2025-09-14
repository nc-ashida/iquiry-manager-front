'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'dots' | 'pulse' | 'spin' | 'bounce' | 'wave';
    color?: 'primary' | 'secondary' | 'muted' | 'white';
    className?: string;
    label?: string;
}

const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
};

const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted-foreground',
    white: 'text-white'
};

export default function LoadingSpinner({
    size = 'md',
    variant = 'spin',
    color = 'primary',
    className,
    label = '読み込み中...'
}: LoadingSpinnerProps) {
    const baseClasses = cn(
        sizeClasses[size],
        colorClasses[color],
        className
    );

    const renderSpinner = () => {
        switch (variant) {
            case 'dots':
                return (
                    <div className="flex space-x-1" role="status" aria-label={label}>
                        <div className={cn('rounded-full animate-bounce', baseClasses)} style={{ animationDelay: '0ms' }} />
                        <div className={cn('rounded-full animate-bounce', baseClasses)} style={{ animationDelay: '150ms' }} />
                        <div className={cn('rounded-full animate-bounce', baseClasses)} style={{ animationDelay: '300ms' }} />
                    </div>
                );

            case 'pulse':
                return (
                    <div className={cn('rounded-full animate-pulse bg-current', baseClasses)} role="status" aria-label={label} />
                );

            case 'bounce':
                return (
                    <div className={cn('rounded-full animate-bounce bg-current', baseClasses)} role="status" aria-label={label} />
                );

            case 'wave':
                return (
                    <div className="flex space-x-1" role="status" aria-label={label}>
                        <div className={cn('rounded-full animate-pulse bg-current', baseClasses)} style={{ animationDelay: '0ms' }} />
                        <div className={cn('rounded-full animate-pulse bg-current', baseClasses)} style={{ animationDelay: '200ms' }} />
                        <div className={cn('rounded-full animate-pulse bg-current', baseClasses)} style={{ animationDelay: '400ms' }} />
                    </div>
                );

            case 'spin':
            default:
                return (
                    <div className={cn('animate-spin rounded-full border-2 border-current border-t-transparent', baseClasses)} role="status" aria-label={label} />
                );
        }
    };

    return renderSpinner();
}

// 専用のローディングコンポーネント
export function LoadingDots(props: Omit<LoadingSpinnerProps, 'variant'>) {
    return <LoadingSpinner {...props} variant="dots" />;
}

export function LoadingPulse(props: Omit<LoadingSpinnerProps, 'variant'>) {
    return <LoadingSpinner {...props} variant="pulse" />;
}

export function LoadingBounce(props: Omit<LoadingSpinnerProps, 'variant'>) {
    return <LoadingSpinner {...props} variant="bounce" />;
}

export function LoadingWave(props: Omit<LoadingSpinnerProps, 'variant'>) {
    return <LoadingSpinner {...props} variant="wave" />;
}

// フルスクリーンローディング
interface FullScreenLoadingProps {
    message?: string;
    variant?: LoadingSpinnerProps['variant'];
    size?: LoadingSpinnerProps['size'];
}

export function FullScreenLoading({
    message = '読み込み中...',
    variant = 'spin',
    size = 'lg'
}: FullScreenLoadingProps) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-4">
                <LoadingSpinner variant={variant} size={size} />
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}

// インラインローディング
interface InlineLoadingProps {
    message?: string;
    variant?: LoadingSpinnerProps['variant'];
    size?: LoadingSpinnerProps['size'];
    className?: string;
}

export function InlineLoading({
    message = '読み込み中...',
    variant = 'spin',
    size = 'sm',
    className
}: InlineLoadingProps) {
    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <LoadingSpinner variant={variant} size={size} />
            <span className="text-sm text-muted-foreground">{message}</span>
        </div>
    );
}

// ボタン内ローディング
interface ButtonLoadingProps {
    variant?: LoadingSpinnerProps['variant'];
    size?: LoadingSpinnerProps['size'];
    className?: string;
}

export function ButtonLoading({
    variant = 'spin',
    size = 'sm',
    className
}: ButtonLoadingProps) {
    return (
        <LoadingSpinner
            variant={variant}
            size={size}
            color="white"
            className={className}
        />
    );
}

// カードローディング
interface CardLoadingProps {
    message?: string;
    variant?: LoadingSpinnerProps['variant'];
    size?: LoadingSpinnerProps['size'];
    className?: string;
}

export function CardLoading({
    message = '読み込み中...',
    variant = 'spin',
    size = 'md',
    className
}: CardLoadingProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-8', className)}>
            <LoadingSpinner variant={variant} size={size} />
            {message && (
                <p className="text-sm text-muted-foreground mt-2">{message}</p>
            )}
        </div>
    );
}

// スケルトンローディング
interface SkeletonLoadingProps {
    lines?: number;
    className?: string;
}

export function SkeletonLoading({
    lines = 3,
    className
}: SkeletonLoadingProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        'h-4 bg-muted rounded animate-pulse',
                        index === lines - 1 ? 'w-3/4' : 'w-full'
                    )}
                />
            ))}
        </div>
    );
}

// テーブルローディング
interface TableLoadingProps {
    rows?: number;
    columns?: number;
    className?: string;
}

export function TableLoading({
    rows = 5,
    columns = 4,
    className
}: TableLoadingProps) {
    return (
        <div className={cn('space-y-3', className)}>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex space-x-4">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className={cn(
                                'h-4 bg-muted rounded animate-pulse flex-1',
                                colIndex === columns - 1 ? 'w-1/2' : 'w-full'
                            )}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
