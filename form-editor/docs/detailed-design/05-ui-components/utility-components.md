# ユーティリティコンポーネント

アプリケーション全体で使用される共通のユーティリティコンポーネントです。

## 📋 コンポーネント一覧

### 1. LoadingSpinner コンポーネント
- **ファイル**: `src/components/LoadingSpinner.tsx`
- **機能**: ローディング表示

### 2. ToastNotification コンポーネント
- **ファイル**: `src/components/ToastNotification.tsx`
- **機能**: トースト通知表示

### 3. SearchBar コンポーネント
- **ファイル**: `src/components/SearchBar.tsx`
- **機能**: 検索バー

### 4. ThemeProvider コンポーネント
- **ファイル**: `src/components/ThemeProvider.tsx`
- **機能**: テーマ管理

## 🔧 主要コンポーネント詳細

### 1. LoadingSpinner コンポーネント
```typescript
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '',
  text = '読み込み中...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && (
        <span className="text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
}
```

**特徴:**
- 3サイズのローディングスピナー
- カスタマイズ可能なテキスト
- アニメーション効果
- 再利用可能なコンポーネント

### 2. ToastNotification コンポーネント
```typescript
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastNotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function ToastNotification({
  type,
  message,
  duration = 5000,
  onClose
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4 animate-in slide-in-from-right-2 duration-300`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.textColor}`}>
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className={`${config.textColor} hover:opacity-75 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
```

**特徴:**
- 4種類の通知タイプ
- 自動非表示機能
- カスタマイズ可能な継続時間
- アニメーション効果

### 3. SearchBar コンポーネント
```typescript
import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export default function SearchBar({
  placeholder = '検索...',
  value = '',
  onChange,
  onClear,
  className = ''
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setSearchValue('');
    onChange?.('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      {searchValue && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
```

**特徴:**
- 検索アイコン表示
- クリアボタン
- カスタマイズ可能なプレースホルダー
- コールバック関数対応

### 4. ThemeProvider コンポーネント
```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // ローカルストレージからテーマを読み込み
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // システム設定を確認
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // テーマをローカルストレージに保存
    localStorage.setItem('theme', theme);
    
    // HTML要素にクラスを追加/削除
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

**特徴:**
- ライト・ダークテーマの切り替え
- ローカルストレージでの永続化
- システム設定の自動検出
- コンテキストAPI使用

## 🎨 ユーティリティコンポーネントの使用例

### 1. ローディングスピナーの使用
```typescript
// 基本的な使用
<LoadingSpinner />

// サイズとテキストを指定
<LoadingSpinner size="lg" text="データを読み込み中..." />

// カスタムクラスを指定
<LoadingSpinner className="my-4" />
```

### 2. トースト通知の使用
```typescript
// 成功通知
<ToastNotification
  type="success"
  message="保存が完了しました"
  duration={3000}
  onClose={() => console.log('通知を閉じました')}
/>

// エラー通知
<ToastNotification
  type="error"
  message="エラーが発生しました"
  duration={0} // 自動で閉じない
/>

// 警告通知
<ToastNotification
  type="warning"
  message="注意が必要です"
/>

// 情報通知
<ToastNotification
  type="info"
  message="新しい機能が利用可能です"
/>
```

### 3. 検索バーの使用
```typescript
// 基本的な使用
<SearchBar
  placeholder="フォームを検索..."
  onChange={(value) => setSearchQuery(value)}
/>

// 初期値とクリア機能
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  onClear={() => setSearchQuery('')}
  className="mb-4"
/>
```

### 4. テーマプロバイダーの使用
```typescript
// アプリケーション全体でテーマプロバイダーを使用
<ThemeProvider>
  <App />
</ThemeProvider>

// コンポーネント内でテーマを使用
function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <button onClick={toggleTheme}>
        テーマを切り替え
      </button>
    </div>
  );
}
```

## 🔄 ユーティリティコンポーネントの状態管理

### ローディング状態の管理
```typescript
// ローディング状態の管理
const [isLoading, setIsLoading] = useState(false);

const handleDataLoad = async () => {
  setIsLoading(true);
  try {
    const data = await fetchData();
    setData(data);
  } catch (error) {
    console.error('データの読み込みに失敗しました:', error);
  } finally {
    setIsLoading(false);
  }
};

// ローディングスピナーの表示
{isLoading && <LoadingSpinner text="データを読み込み中..." />}
```

### 通知状態の管理
```typescript
// 通知状態の管理
const [notifications, setNotifications] = useState<ToastNotificationProps[]>([]);

const addNotification = (notification: ToastNotificationProps) => {
  const id = Date.now().toString();
  setNotifications(prev => [...prev, { ...notification, id }]);
};

const removeNotification = (id: string) => {
  setNotifications(prev => prev.filter(n => n.id !== id));
};

// 通知の表示
{notifications.map(notification => (
  <ToastNotification
    key={notification.id}
    {...notification}
    onClose={() => removeNotification(notification.id)}
  />
))}
```

## 🎨 レスポンシブ対応

### ローディングスピナーのレスポンシブ対応
```typescript
// レスポンシブサイズ
const getResponsiveSize = (isMobile: boolean) => {
  return isMobile ? 'sm' : 'md';
};

// レスポンシブテキスト
const getResponsiveText = (isMobile: boolean) => {
  return isMobile ? '読み込み中...' : 'データを読み込み中...';
};
```

### トースト通知のレスポンシブ対応
```typescript
// レスポンシブ位置
const getResponsivePosition = (isMobile: boolean) => {
  return isMobile ? 'top-2 right-2 left-2' : 'top-4 right-4';
};

// レスポンシブサイズ
const getResponsiveSize = (isMobile: boolean) => {
  return isMobile ? 'max-w-full' : 'max-w-sm';
};
```

### 検索バーのレスポンシブ対応
```typescript
// レスポンシブサイズ
const getResponsiveSize = (isMobile: boolean) => {
  return isMobile ? 'text-sm' : 'text-base';
};

// レスポンシブパディング
const getResponsivePadding = (isMobile: boolean) => {
  return isMobile ? 'py-1.5' : 'py-2';
};
```

## ⚠️ リファクタリング時の注意点

1. **コンポーネント構造**: 現在のコンポーネント構造を維持
2. **プロパティ**: 現在のプロパティ定義を維持
3. **状態管理**: 現在の状態管理を維持
4. **レスポンシブ対応**: 現在のレスポンシブ対応を維持
5. **アクセシビリティ**: 現在のアクセシビリティ対応を維持

## 📁 関連ファイル

- `src/components/LoadingSpinner.tsx` - ローディングスピナー
- `src/components/ToastNotification.tsx` - トースト通知
- `src/components/SearchBar.tsx` - 検索バー
- `src/components/ThemeProvider.tsx` - テーマプロバイダー

## 🔗 関連機能

- **フォーム管理**: フォーム一覧の検索
- **メール管理**: メール一覧の検索
- **データ管理**: データ読み込み時のローディング
- **通知機能**: 操作完了時の通知

## 📝 テストケース

### 正常系
1. ローディングスピナーの表示
2. トースト通知の表示
3. 検索バーの動作
4. テーマの切り替え
5. レスポンシブ表示

### 異常系
1. ローディングスピナーの表示エラー
2. トースト通知の表示エラー
3. 検索バーの動作エラー
4. テーマの切り替えエラー

## 🚀 改善提案

1. **コンポーネントの最適化**: パフォーマンスの向上
2. **アクセシビリティの向上**: キーボード操作とスクリーンリーダー対応
3. **アニメーションの改善**: より滑らかなアニメーション
4. **テーマの拡張**: より多くのテーマオプション
5. **国際化**: 多言語対応
6. **コンポーネントの再利用性**: より再利用可能なコンポーネント設計
