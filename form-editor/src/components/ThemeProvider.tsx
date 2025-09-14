'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: 'light',
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = 'light',
    storageKey: _storageKey = 'vite-ui-theme',
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const [mounted, setMounted] = useState(false);

    // クライアントサイドでのマウント後にライトモードを強制設定
    useEffect(() => {
        setMounted(true);
        setTheme('light');
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;

        // ダークモードクラスを削除し、ライトモードクラスを追加
        root.classList.remove('dark');
        root.classList.add('light');
    }, [theme, mounted]);

    const value = {
        theme,
        setTheme: (_theme: Theme) => {
            // ライトモードのみを許可
            setTheme('light');
        },
    };

    // マウント前はライトモードでレンダリング
    if (!mounted) {
        return (
            <ThemeProviderContext.Provider {...props} value={value}>
                {children}
            </ThemeProviderContext.Provider>
        );
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};
