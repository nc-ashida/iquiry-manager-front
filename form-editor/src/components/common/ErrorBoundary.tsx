import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * エラー境界コンポーネント
 * 子コンポーネントで発生したエラーをキャッチし、フォールバックUIを表示
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback;
            return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
        }

        return this.props.children;
    }
}

/**
 * デフォルトのエラーフォールバックコンポーネント
 */
function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
            <div className="text-center max-w-md">
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    エラーが発生しました
                </h2>
                <p className="text-gray-600 mb-6">
                    申し訳ございません。予期しないエラーが発生しました。
                    ページを再読み込みするか、しばらく時間をおいてから再度お試しください。
                </p>
                {process.env.NODE_ENV === 'development' && (
                    <details className="mb-6 text-left">
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                            エラー詳細（開発モード）
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                    </details>
                )}
                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={resetError}
                        variant="outline"
                        className="hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        再試行
                    </Button>
                    <Button
                        onClick={() => window.location.reload()}
                        className="hover:bg-gray-800 transition-colors duration-200"
                    >
                        ページを再読み込み
                    </Button>
                </div>
            </div>
        </div>
    );
}
