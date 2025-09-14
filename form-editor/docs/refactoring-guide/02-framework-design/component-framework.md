# コンポーネントフレームワーク設計

## 概要

form-editorアプリケーションのコンポーネントフレームワークを設計し、再利用可能で保守性の高いコンポーネントアーキテクチャを構築します。

## 🏗️ フレームワーク設計原則

### 1. 単一責任の原則
各コンポーネントは一つの明確な責務を持つ

### 2. 再利用性の最大化
複数の場所で使用できる汎用的なコンポーネント

### 3. 型安全性の確保
TypeScriptによる完全な型安全性

### 4. アクセシビリティの確保
WCAG 2.1 AA準拠のアクセシビリティ

### 5. パフォーマンスの最適化
メモ化とレンダリング最適化

## 📁 コンポーネント階層設計

```
src/components/
├── ui/                          # 基本UIコンポーネント
│   ├── Button/                  # ボタンコンポーネント
│   │   ├── Button.tsx
│   │   ├── Button.types.ts
│   │   ├── Button.stories.tsx
│   │   └── Button.test.tsx
│   ├── Input/                   # 入力コンポーネント
│   ├── Modal/                   # モーダルコンポーネント
│   └── ...
├── forms/                       # フォーム関連コンポーネント
│   ├── FormEditor/              # フォームエディター
│   │   ├── FormEditor.tsx
│   │   ├── FormEditor.types.ts
│   │   ├── FormEditor.hooks.ts
│   │   └── FormEditor.test.tsx
│   ├── FieldEditor/             # フィールドエディター
│   ├── FormPreview/             # フォームプレビュー
│   └── ...
├── layout/                      # レイアウトコンポーネント
│   ├── Header/                  # ヘッダー
│   ├── Sidebar/                 # サイドバー
│   ├── MainLayout/              # メインレイアウト
│   └── ...
├── business/                    # ビジネスロジックコンポーネント
│   ├── FormList/                # フォーム一覧
│   ├── SignatureManager/        # 署名管理
│   ├── InquiryManager/          # 問合せ管理
│   └── ...
└── common/                      # 共通コンポーネント
    ├── LoadingSpinner/          # ローディングスピナー
    ├── ErrorBoundary/           # エラー境界
    ├── ConfirmDialog/           # 確認ダイアログ
    └── ...
```

## 🧩 基本UIコンポーネント

### 1. Button コンポーネント

#### 設計
```typescript
// components/ui/Button/Button.types.ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface ButtonRef extends HTMLButtonElement {}
```

#### 実装
```typescript
// components/ui/Button/Button.tsx
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-black text-white hover:bg-gray-800',
        secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700'
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export const Button = forwardRef<ButtonRef, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading, 
    leftIcon, 
    rightIcon, 
    fullWidth,
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### 使用例
```typescript
// 使用例
<Button variant="primary" size="md" loading={isLoading}>
  保存
</Button>

<Button variant="outline" leftIcon={<Plus />}>
  新規作成
</Button>

<Button variant="destructive" rightIcon={<Trash2 />}>
  削除
</Button>
```

### 2. Input コンポーネント

#### 設計
```typescript
// components/ui/Input/Input.types.ts
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface InputRef extends HTMLInputElement {}
```

#### 実装
```typescript
// components/ui/Input/Input.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/Label';

export const Input = forwardRef<InputRef, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    fullWidth,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
          </Label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:ring-red-500',
              fullWidth && 'w-full',
              className
            )}
            ref={ref}
            id={inputId}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### 3. Modal コンポーネント

#### 設計
```typescript
// components/ui/Modal/Modal.types.ts
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export interface ModalRef extends HTMLDivElement {}
```

#### 実装
```typescript
// components/ui/Modal/Modal.tsx
import React, { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

export const Modal = forwardRef<ModalRef, ModalProps>(
  ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = 'md',
    closeOnOverlayClick = true,
    closeOnEscape = true
  }, ref) => {
    useEffect(() => {
      if (!isOpen) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, onClose, closeOnEscape]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <div
          ref={ref}
          className={cn(
            'relative bg-white rounded-lg shadow-lg w-full mx-4',
            sizeClasses[size]
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h2 id="modal-title" className="text-lg font-semibold">
                {title}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="閉じる"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = 'Modal';
```

## 🏢 ビジネスロジックコンポーネント

### 1. FormEditor コンポーネント

#### 設計
```typescript
// components/forms/FormEditor/FormEditor.types.ts
export interface FormEditorProps {
  form: Form | null;
  onSave: (form: Form) => void;
  onCancel: () => void;
  mode?: 'create' | 'edit';
}

export interface FormEditorRef extends HTMLDivElement {}
```

#### 実装
```typescript
// components/forms/FormEditor/FormEditor.tsx
import React, { forwardRef, useState, useCallback } from 'react';
import { Form } from '@/shared/types';
import { FieldEditor } from '../FieldEditor';
import { FormPreview } from '../FormPreview';
import { SettingsEditor } from '../SettingsEditor';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useFormEditor } from './FormEditor.hooks';

export const FormEditor = forwardRef<FormEditorRef, FormEditorProps>(
  ({ form, onSave, onCancel, mode = 'edit' }, ref) => {
    const {
      currentForm,
      updateForm,
      addField,
      updateField,
      deleteField,
      moveField,
      isDirty,
      isValid,
      saveForm,
      resetForm
    } = useFormEditor(form, onSave);

    const [activeTab, setActiveTab] = useState('fields');

    const handleSave = useCallback(async () => {
      if (isValid) {
        await saveForm();
      }
    }, [isValid, saveForm]);

    const handleCancel = useCallback(() => {
      if (isDirty) {
        if (confirm('変更が保存されていません。本当にキャンセルしますか？')) {
          resetForm();
          onCancel();
        }
      } else {
        onCancel();
      }
    }, [isDirty, resetForm, onCancel]);

    return (
      <div ref={ref} className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-semibold">
            {mode === 'create' ? '新しいフォームを作成' : 'フォームを編集'}
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              キャンセル
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={!isValid}
            >
              保存
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fields">フィールド</TabsTrigger>
              <TabsTrigger value="preview">プレビュー</TabsTrigger>
              <TabsTrigger value="settings">設定</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fields" className="h-full">
              <FieldEditor
                form={currentForm}
                onAddField={addField}
                onUpdateField={updateField}
                onDeleteField={deleteField}
                onMoveField={moveField}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="h-full">
              <FormPreview form={currentForm} />
            </TabsContent>
            
            <TabsContent value="settings" className="h-full">
              <SettingsEditor
                form={currentForm}
                onUpdateForm={updateForm}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }
);

FormEditor.displayName = 'FormEditor';
```

#### カスタムフック
```typescript
// components/forms/FormEditor/FormEditor.hooks.ts
import { useState, useCallback, useEffect } from 'react';
import { Form, FormField } from '@/shared/types';
import { generateId } from '@/shared/utils/dataManager';

export function useFormEditor(initialForm: Form | null, onSave: (form: Form) => void) {
  const [currentForm, setCurrentForm] = useState<Form | null>(initialForm);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setCurrentForm(initialForm);
    setIsDirty(false);
  }, [initialForm]);

  const updateForm = useCallback((updates: Partial<Form>) => {
    setCurrentForm(prev => prev ? { ...prev, ...updates } : null);
    setIsDirty(true);
  }, []);

  const addField = useCallback((field: Omit<FormField, 'id'>) => {
    if (!currentForm) return;
    
    const newField: FormField = {
      ...field,
      id: generateId(),
      order: currentForm.fields.length
    };
    
    setCurrentForm(prev => prev ? {
      ...prev,
      fields: [...prev.fields, newField]
    } : null);
    setIsDirty(true);
  }, [currentForm]);

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    if (!currentForm) return;
    
    setCurrentForm(prev => prev ? {
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    } : null);
    setIsDirty(true);
  }, [currentForm]);

  const deleteField = useCallback((fieldId: string) => {
    if (!currentForm) return;
    
    setCurrentForm(prev => prev ? {
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    } : null);
    setIsDirty(true);
  }, [currentForm]);

  const moveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
    if (!currentForm) return;
    
    const fields = [...currentForm.fields];
    const index = fields.findIndex(field => field.id === fieldId);
    
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= fields.length) return;
    
    [fields[index], fields[newIndex]] = [fields[newIndex], fields[index]];
    
    setCurrentForm(prev => prev ? {
      ...prev,
      fields: fields.map((field, idx) => ({ ...field, order: idx }))
    } : null);
    setIsDirty(true);
  }, [currentForm]);

  const saveForm = useCallback(async () => {
    if (!currentForm) return;
    
    const formToSave: Form = {
      ...currentForm,
      updatedAt: new Date().toISOString()
    };
    
    onSave(formToSave);
    setIsDirty(false);
  }, [currentForm, onSave]);

  const resetForm = useCallback(() => {
    setCurrentForm(initialForm);
    setIsDirty(false);
  }, [initialForm]);

  const isValid = currentForm?.name && currentForm.fields.length > 0;

  return {
    currentForm,
    updateForm,
    addField,
    updateField,
    deleteField,
    moveField,
    isDirty,
    isValid,
    saveForm,
    resetForm
  };
}
```

## 🔧 共通コンポーネント

### 1. LoadingSpinner コンポーネント

#### 実装
```typescript
// components/common/LoadingSpinner/LoadingSpinner.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-b-2 border-gray-900',
          sizeClasses[size]
        )}
        role="status"
        aria-label="読み込み中"
      />
      {text && <span className="ml-2">{text}</span>}
    </div>
  );
}
```

### 2. ErrorBoundary コンポーネント

#### 実装
```typescript
// components/common/ErrorBoundary/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

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

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-semibold text-red-600 mb-4">エラーが発生しました</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <Button onClick={resetError}>再試行</Button>
    </div>
  );
}
```

## 📊 コンポーネント設計メトリクス

### 現在の状況
- **コンポーネント数**: 15個
- **最大コンポーネントサイズ**: 1,416行
- **再利用性**: 30%
- **型安全性**: 60%

### 目標
- **コンポーネント数**: 40-50個
- **最大コンポーネントサイズ**: 200行以下
- **再利用性**: 80%以上
- **型安全性**: 95%以上

## 🧪 テスト戦略

### 1. 単体テスト
```typescript
// components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 2. 統合テスト
```typescript
// components/forms/FormEditor/FormEditor.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FormEditor } from './FormEditor';

describe('FormEditor', () => {
  it('renders form editor with tabs', () => {
    render(<FormEditor form={mockForm} onSave={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText('フィールド')).toBeInTheDocument();
    expect(screen.getByText('プレビュー')).toBeInTheDocument();
    expect(screen.getByText('設定')).toBeInTheDocument();
  });

  it('saves form when save button is clicked', async () => {
    const onSave = jest.fn();
    render(<FormEditor form={mockForm} onSave={onSave} onCancel={jest.fn()} />);
    fireEvent.click(screen.getByText('保存'));
    expect(onSave).toHaveBeenCalled();
  });
});
```

## 📚 参考資料

### 設計原則
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [Component Composition](https://reactjs.org/docs/composition-vs-inheritance.html)
- [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)

### 技術ドキュメント
- [React Components](https://reactjs.org/docs/components-and-props.html)
- [TypeScript React](https://www.typescriptlang.org/docs/handbook/react.html)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**注意**: コンポーネントフレームワークの実装時は、既存の機能を壊さないよう段階的に進め、各段階でテストを実装してください。
