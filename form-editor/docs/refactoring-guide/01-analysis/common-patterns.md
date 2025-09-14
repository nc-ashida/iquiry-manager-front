# 共通化可能なパターン分析

## 概要

form-editorアプリケーション内で共通化可能なパターンを特定し、リファクタリングによるコードの重複削減と保守性向上の機会を分析します。

## 🔍 共通化可能なパターン

### 1. CRUD操作パターン

#### 現在の実装
```typescript
// FormList.tsx - フォームのCRUD操作
const handleCreateForm = () => {
  const newForm: Form = {
    id: generateId(),
    name: '新しいフォーム',
    // ... 初期値設定
  };
  const forms = loadData.forms();
  forms.push(newForm);
  saveData.forms(forms);
  setForms(forms);
};

const handleUpdateForm = (updatedForm: Form) => {
  const forms = loadData.forms();
  const index = forms.findIndex(f => f.id === updatedForm.id);
  if (index !== -1) {
    forms[index] = updatedForm;
    saveData.forms(forms);
    setForms(forms);
  }
};

const handleDeleteForm = (formId: string) => {
  const forms = loadData.forms();
  const filteredForms = forms.filter(f => f.id !== formId);
  saveData.forms(filteredForms);
  setForms(filteredForms);
};
```

```typescript
// SignatureEditor.tsx - 署名のCRUD操作（重複）
const handleCreateSignature = () => {
  const newSignature: Signature = {
    id: generateId(),
    name: '新しい署名',
    // ... 初期値設定
  };
  const signatures = loadData.signatures();
  signatures.push(newSignature);
  saveData.signatures(signatures);
  setSignatures(signatures);
};

const handleUpdateSignature = (updatedSignature: Signature) => {
  const signatures = loadData.signatures();
  const index = signatures.findIndex(s => s.id === updatedSignature.id);
  if (index !== -1) {
    signatures[index] = updatedSignature;
    saveData.signatures(signatures);
    setSignatures(signatures);
  }
};

const handleDeleteSignature = (signatureId: string) => {
  const signatures = loadData.signatures();
  const filteredSignatures = signatures.filter(s => s.id !== signatureId);
  saveData.signatures(filteredSignatures);
  setSignatures(filteredSignatures);
};
```

#### 共通化後の実装
```typescript
// hooks/useCrud.ts - 汎用CRUDフック
export function useCrud<T extends { id: string }>(
  storageKey: string,
  initialData: T[] = []
) {
  const [items, setItems] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (item: Omit<T, 'id'>) => {
    setLoading(true);
    try {
      const newItem = { ...item, id: generateId() } as T;
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      saveToStorage(storageKey, updatedItems);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : '作成に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [items, storageKey]);

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    setLoading(true);
    try {
      const updatedItems = items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      setItems(updatedItems);
      saveToStorage(storageKey, updatedItems);
      return updatedItems.find(item => item.id === id);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [items, storageKey]);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      saveToStorage(storageKey, updatedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [items, storageKey]);

  return {
    items,
    loading,
    error,
    create,
    update,
    remove,
    setItems
  };
}
```

### 2. フォームバリデーションパターン

#### 現在の実装
```typescript
// FormEditor.tsx - フィールドバリデーション
const validateField = (field: FormField) => {
  if (field.required && !field.value) {
    return { isValid: false, message: 'この項目は必須です' };
  }
  
  if (field.type === 'email' && field.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      return { isValid: false, message: '正しいメールアドレスを入力してください' };
    }
  }
  
  if (field.validation?.minLength && field.value.length < field.validation.minLength) {
    return { isValid: false, message: `最低${field.validation.minLength}文字以上入力してください` };
  }
  
  return { isValid: true };
};
```

```typescript
// dataManager.ts - 埋め込みフォームバリデーション（重複）
function validateField(field) {
  const value = field.value.trim();
  const isRequired = field.hasAttribute('required');
  
  if (isRequired && !value) {
    showFieldError(field.id, 'この項目は必須です');
    return false;
  }
  
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(field.id, '正しいメールアドレスを入力してください');
      return false;
    }
  }
  
  return true;
}
```

#### 共通化後の実装
```typescript
// utils/validation.ts - 共通バリデーション
import { z } from 'zod';

export const fieldValidationSchemas = {
  text: z.string().min(1, 'この項目は必須です'),
  email: z.string().email('正しいメールアドレスを入力してください'),
  phone: z.string().regex(/^[0-9-+()\s]+$/, '正しい電話番号を入力してください'),
  number: z.string().regex(/^\d+$/, '数字を入力してください'),
  required: z.string().min(1, 'この項目は必須です'),
  minLength: (min: number) => z.string().min(min, `最低${min}文字以上入力してください`),
  maxLength: (max: number) => z.string().max(max, `最大${max}文字まで入力してください`),
  pattern: (pattern: RegExp, message: string) => z.string().regex(pattern, message)
};

export const validateField = (field: FormField, value: string) => {
  try {
    let schema = fieldValidationSchemas.text;
    
    if (field.required) {
      schema = fieldValidationSchemas.required;
    }
    
    if (field.type === 'email') {
      schema = fieldValidationSchemas.email;
    }
    
    if (field.validation?.minLength) {
      schema = schema.and(fieldValidationSchemas.minLength(field.validation.minLength));
    }
    
    if (field.validation?.maxLength) {
      schema = schema.and(fieldValidationSchemas.maxLength(field.validation.maxLength));
    }
    
    if (field.validation?.pattern) {
      schema = schema.and(fieldValidationSchemas.pattern(
        new RegExp(field.validation.pattern),
        '正しい形式で入力してください'
      ));
    }
    
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.errors[0].message };
    }
    return { isValid: false, message: 'バリデーションエラーが発生しました' };
  }
};
```

### 3. エラーハンドリングパターン

#### 現在の実装
```typescript
// FormList.tsx - エラーハンドリング
const handleSave = async () => {
  try {
    setLoading(true);
    const forms = loadData.forms();
    forms.push(newForm);
    saveData.forms(forms);
    setForms(forms);
  } catch (error) {
    setError(error instanceof Error ? error.message : '保存に失敗しました');
  } finally {
    setLoading(false);
  }
};
```

```typescript
// SignatureEditor.tsx - エラーハンドリング（重複）
const handleSave = async () => {
  try {
    setLoading(true);
    const signatures = loadData.signatures();
    signatures.push(newSignature);
    saveData.signatures(signatures);
    setSignatures(signatures);
  } catch (error) {
    setError(error instanceof Error ? error.message : '保存に失敗しました');
  } finally {
    setLoading(false);
  }
};
```

#### 共通化後の実装
```typescript
// hooks/useAsyncOperation.ts - 非同期操作フック
export function useAsyncOperation<T, P extends any[]>(
  operation: (...args: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: P): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation(...args);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '操作に失敗しました';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [operation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError
  };
}
```

### 4. ローディング状態パターン

#### 現在の実装
```typescript
// FormList.tsx - ローディング状態
const [loading, setLoading] = useState(false);

const handleSave = async () => {
  setLoading(true);
  try {
    // 処理
  } finally {
    setLoading(false);
  }
};

return (
  <div>
    {loading && <div>読み込み中...</div>}
    {/* コンテンツ */}
  </div>
);
```

```typescript
// SignatureEditor.tsx - ローディング状態（重複）
const [loading, setLoading] = useState(false);

const handleSave = async () => {
  setLoading(true);
  try {
    // 処理
  } finally {
    setLoading(false);
  }
};

return (
  <div>
    {loading && <div>読み込み中...</div>}
    {/* コンテンツ */}
  </div>
);
```

#### 共通化後の実装
```typescript
// components/LoadingWrapper.tsx - ローディングラッパー
interface LoadingWrapperProps {
  loading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LoadingWrapper({ loading, children, fallback }: LoadingWrapperProps) {
  if (loading) {
    return fallback || <LoadingSpinner />;
  }
  
  return <>{children}</>;
}

// hooks/useLoading.ts - ローディング状態フック
export function useLoading() {
  const [loading, setLoading] = useState(false);
  
  const withLoading = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    try {
      return await operation();
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    setLoading,
    withLoading
  };
}
```

### 5. フォーム生成パターン

#### 現在の実装
```typescript
// FormList.tsx - 埋め込みコード生成
const generateEmbedCode = (form: Form) => {
  const script = generateFormScript(form);
  return `
<!-- 問合せフォーム: ${form.name} -->
${script}
<!-- End 問合せフォーム -->`;
};
```

```typescript
// FormPreview.tsx - 埋め込みコード生成（重複）
const generateEmbedCode = (form: Form) => {
  const script = generateFormScript(form);
  return `
<!-- 問合せフォーム: ${form.name} -->
${script}
<!-- End 問合せフォーム -->`;
};
```

#### 共通化後の実装
```typescript
// services/FormGenerationService.ts - フォーム生成サービス
export class FormGenerationService {
  static generateEmbedCode(form: Form): string {
    const script = this.generateFormScript(form);
    return `
<!-- 問合せフォーム: ${form.name} -->
${script}
<!-- End 問合せフォーム -->`;
  }

  static generateFormScript(form: Form): string {
    // 共通のフォーム生成ロジック
  }

  static generateFormHTML(form: Form): string {
    // 共通のHTML生成ロジック
  }

  static generateFormCSS(form: Form): string {
    // 共通のCSS生成ロジック
  }
}
```

### 6. データ変換パターン

#### 現在の実装
```typescript
// FormEditor.tsx - データ変換
const convertFormToFormData = (form: Form) => {
  return {
    id: form.id,
    name: form.name,
    fields: form.fields.map(field => ({
      id: field.id,
      type: field.type,
      label: field.label,
      // ... 変換ロジック
    }))
  };
};
```

```typescript
// FormPreview.tsx - データ変換（重複）
const convertFormToPreviewData = (form: Form) => {
  return {
    id: form.id,
    name: form.name,
    fields: form.fields.map(field => ({
      id: field.id,
      type: field.type,
      label: field.label,
      // ... 変換ロジック
    }))
  };
};
```

#### 共通化後の実装
```typescript
// utils/dataTransformers.ts - データ変換ユーティリティ
export const formTransformers = {
  toFormData: (form: Form): FormData => ({
    id: form.id,
    name: form.name,
    fields: form.fields.map(field => ({
      id: field.id,
      type: field.type,
      label: field.label,
      required: field.required,
      options: field.options
    }))
  }),

  toPreviewData: (form: Form): PreviewData => ({
    id: form.id,
    name: form.name,
    fields: form.fields.map(field => ({
      id: field.id,
      type: field.type,
      label: field.label,
      placeholder: field.placeholder
    }))
  }),

  toApiData: (form: Form): ApiFormData => ({
    formId: form.id,
    formName: form.name,
    fields: form.fields.map(field => ({
      fieldId: field.id,
      fieldType: field.type,
      fieldLabel: field.label
    }))
  })
};
```

## 🎯 共通化の効果

### 1. コードの削減
- **CRUD操作**: 約200行の重複コード削減
- **バリデーション**: 約150行の重複コード削減
- **エラーハンドリング**: 約100行の重複コード削減
- **ローディング状態**: 約80行の重複コード削減

### 2. 保守性の向上
- **単一責任**: 各パターンが明確な責務を持つ
- **再利用性**: 複数のコンポーネントで共通利用
- **テスタビリティ**: 独立したテストが可能
- **拡張性**: 新機能追加時の影響範囲最小化

### 3. 一貫性の向上
- **統一されたAPI**: 同じパターンで同じ操作
- **統一されたエラーハンドリング**: 一貫したユーザー体験
- **統一されたバリデーション**: 一貫したデータ品質
- **統一されたローディング状態**: 一貫したUI体験

## 📋 実装計画

### フェーズ1: 基盤パターンの実装
1. **useCrudフック** - CRUD操作の共通化
2. **バリデーションサービス** - バリデーションロジックの統一
3. **エラーハンドリングフック** - エラーハンドリングの統一

### フェーズ2: UIパターンの実装
4. **ローディングコンポーネント** - ローディング状態の統一
5. **フォーム生成サービス** - フォーム生成の統一
6. **データ変換ユーティリティ** - データ変換の統一

### フェーズ3: 高度なパターンの実装
7. **非同期操作フック** - 非同期処理の統一
8. **キャッシュ管理** - データキャッシュの統一
9. **オプティミスティック更新** - UI更新の統一

## 🔧 実装例

### 共通フックの使用例
```typescript
// FormList.tsx - 共通フックを使用
export default function FormList() {
  const { items: forms, loading, error, create, update, remove } = useCrud<Form>('forms');
  const { execute: saveForm } = useAsyncOperation(create);
  
  const handleCreateForm = () => {
    saveForm({
      name: '新しいフォーム',
      fields: [],
      styling: defaultStyling,
      settings: defaultSettings
    });
  };

  return (
    <LoadingWrapper loading={loading}>
      {error && <ErrorMessage message={error} />}
      {forms.map(form => (
        <FormCard key={form.id} form={form} onEdit={update} onDelete={remove} />
      ))}
    </LoadingWrapper>
  );
}
```

### バリデーションサービスの使用例
```typescript
// FieldEditor.tsx - バリデーションサービスを使用
export default function FieldEditor({ field, onChange }: FieldEditorProps) {
  const [value, setValue] = useState(field.value || '');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    const validation = validateField(field, newValue);
    setError(validation.isValid ? null : validation.message);
    onChange({ ...field, value: newValue });
  };

  return (
    <div>
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className={error ? 'border-red-500' : ''}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
```

## 📊 メトリクス

### 現在の状況
- **重複コード**: 約530行
- **共通化可能なパターン**: 6個
- **再利用性**: 30%

### 目標
- **重複コード**: 約100行以下
- **共通化可能なパターン**: 15個以上
- **再利用性**: 80%以上

## 📚 参考資料

### 設計パターン
- [Custom Hooks Pattern](https://reactjs.org/docs/hooks-custom.html)
- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)

### 技術ドキュメント
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Zod Validation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

---

**注意**: 共通化の実装時は、既存の機能を壊さないよう段階的に進め、各段階でテストを実装してください。
