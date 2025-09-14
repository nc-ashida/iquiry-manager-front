'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchResult {
    id: string;
    title: string;
    description?: string;
    type: 'form' | 'signature' | 'setting';
    url: string;
}

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    onResultSelect?: (result: SearchResult) => void;
    className?: string;
    showSuggestions?: boolean;
    showHistory?: boolean;
    maxHistoryItems?: number;
}

// 仮の検索結果データ
const mockSearchResults: SearchResult[] = [
    {
        id: '1',
        title: 'お問い合わせフォーム',
        description: '一般的なお問い合わせ用のフォーム',
        type: 'form',
        url: '/forms/1'
    },
    {
        id: '2',
        title: '会社情報フォーム',
        description: '会社の基本情報を入力するフォーム',
        type: 'form',
        url: '/forms/2'
    },
    {
        id: '3',
        title: 'デフォルト署名',
        description: 'システムのデフォルト署名',
        type: 'signature',
        url: '/signatures/1'
    }
];

export default function SearchBar({
    placeholder = 'フォームを検索...',
    onSearch,
    onResultSelect,
    className,
    showSuggestions: _showSuggestions = true,
    showHistory = true,
    maxHistoryItems = 5
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 検索履歴の読み込み
    useEffect(() => {
        const savedHistory = localStorage.getItem('search-history');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (error) {
                console.error('Failed to parse search history:', error);
            }
        }
    }, []);

    // 検索履歴の保存
    const saveToHistory = useCallback((searchQuery: string) => {
        if (!searchQuery.trim() || !showHistory) return;

        const newHistory = [searchQuery, ...history.filter(item => item !== searchQuery)]
            .slice(0, maxHistoryItems);

        setHistory(newHistory);
        localStorage.setItem('search-history', JSON.stringify(newHistory));
    }, [history, maxHistoryItems, showHistory]);

    // デバウンス付き検索
    const debouncedSearch = useCallback(
        (searchQuery: string) => {
            const timeoutId = setTimeout(async () => {
                if (!searchQuery.trim()) {
                    setResults([]);
                    return;
                }

                setIsLoading(true);

                // 実際の実装では、ここでAPIを呼び出す
                await new Promise(resolve => setTimeout(resolve, 300)); // 模擬的な遅延

                const filteredResults = mockSearchResults.filter(result =>
                    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    result.description?.toLowerCase().includes(searchQuery.toLowerCase())
                );

                setResults(filteredResults);
                setIsLoading(false);
            }, 300);

            return () => clearTimeout(timeoutId);
        },
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setSelectedIndex(-1);

        if (value.trim()) {
            setIsOpen(true);
            debouncedSearch(value);
        } else {
            setIsOpen(false);
            setResults([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        const totalItems = results.length + (showHistory && history.length > 0 ? history.length + 1 : 0);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % totalItems);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    if (selectedIndex < results.length) {
                        handleResultSelect(results[selectedIndex]);
                    } else if (showHistory && history.length > 0) {
                        const historyIndex = selectedIndex - results.length - 1;
                        if (historyIndex >= 0 && historyIndex < history.length) {
                            setQuery(history[historyIndex]);
                            handleSearch(history[historyIndex]);
                        }
                    }
                } else {
                    handleSearch(query);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        saveToHistory(searchQuery);
        onSearch?.(searchQuery);
        setIsOpen(false);
        inputRef.current?.blur();
    };

    const handleResultSelect = (result: SearchResult) => {
        onResultSelect?.(result);
        setIsOpen(false);
        inputRef.current?.blur();
    };

    const clearQuery = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('search-history');
    };

    // クリックアウトサイドの処理
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTypeIcon = (type: SearchResult['type']) => {
        switch (type) {
            case 'form':
                return '📝';
            case 'signature':
                return '✍️';
            case 'setting':
                return '⚙️';
            default:
                return '📄';
        }
    };

    const getTypeLabel = (type: SearchResult['type']) => {
        switch (type) {
            case 'form':
                return 'フォーム';
            case 'signature':
                return '署名';
            case 'setting':
                return '設定';
            default:
                return 'その他';
        }
    };

    return (
        <div ref={containerRef} className={cn('relative w-full max-w-md', className)}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    type="search"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.trim() && setIsOpen(true)}
                    className="pl-10 pr-10 h-9"
                    aria-label="検索"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    role="combobox"
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearQuery}
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
                        aria-label="検索をクリア"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>

            {isOpen && (
                <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-hidden">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                <span className="ml-2 text-sm text-muted-foreground">検索中...</span>
                            </div>
                        ) : (
                            <div className="max-h-80 overflow-y-auto">
                                {/* 検索結果 */}
                                {results.length > 0 && (
                                    <div className="p-2">
                                        <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                                            検索結果
                                        </div>
                                        {results.map((result, index) => (
                                            <button
                                                key={result.id}
                                                onClick={() => handleResultSelect(result)}
                                                className={cn(
                                                    'w-full text-left p-2 rounded-md hover:bg-muted transition-colors',
                                                    selectedIndex === index && 'bg-muted'
                                                )}
                                                role="option"
                                                aria-selected={selectedIndex === index}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <span className="text-lg">{getTypeIcon(result.type)}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-sm truncate">
                                                                {result.title}
                                                            </span>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {getTypeLabel(result.type)}
                                                            </Badge>
                                                        </div>
                                                        {result.description && (
                                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                {result.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* 検索履歴 */}
                                {showHistory && history.length > 0 && (
                                    <div className="p-2 border-t">
                                        <div className="flex items-center justify-between mb-2 px-2">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    最近の検索
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearHistory}
                                                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                                            >
                                                クリア
                                            </Button>
                                        </div>
                                        {history.map((item, index) => {
                                            const resultIndex = results.length + index + 1;
                                            return (
                                                <button
                                                    key={item}
                                                    onClick={() => {
                                                        setQuery(item);
                                                        handleSearch(item);
                                                    }}
                                                    className={cn(
                                                        'w-full text-left p-2 rounded-md hover:bg-muted transition-colors',
                                                        selectedIndex === resultIndex && 'bg-muted'
                                                    )}
                                                    role="option"
                                                    aria-selected={selectedIndex === resultIndex}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-sm truncate">{item}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* 結果なし */}
                                {!isLoading && results.length === 0 && query.trim() && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        「{query}」に一致する結果が見つかりませんでした
                                    </div>
                                )}

                                {/* 初期状態 */}
                                {!isLoading && results.length === 0 && !query.trim() && showHistory && history.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        検索キーワードを入力してください
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
