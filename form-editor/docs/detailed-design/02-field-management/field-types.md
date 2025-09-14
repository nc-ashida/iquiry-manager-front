# フィールドタイプ管理

フォーム内で使用できる各種フィールドタイプの定義と管理機能です。

## 📋 フィールドタイプ一覧

### 1. テキストフィールド (text)
- **用途**: 1行のテキスト入力
- **例**: 名前、メールアドレス、電話番号

### 2. 長文テキストフィールド (textarea)
- **用途**: 複数行のテキスト入力
- **例**: お問い合わせ内容、コメント

### 3. 選択肢フィールド (select)
- **用途**: ドロップダウン選択
- **例**: 都道府県、職業、お問い合わせ種別

### 4. ラジオボタンフィールド (radio)
- **用途**: 単一選択
- **例**: 性別、年齢層、満足度

### 5. チェックボックスフィールド (checkbox)
- **用途**: 複数選択
- **例**: 興味のある分野、希望する連絡方法

## 🔧 実装詳細

### フィールドタイプ定義
```typescript
const fieldTypes = [
  { 
    type: 'text', 
    label: 'テキスト', 
    icon: Type, 
    description: '1行のテキスト入力' 
  },
  { 
    type: 'textarea', 
    label: '長文テキスト', 
    icon: FileText, 
    description: '複数行のテキスト入力' 
  },
  { 
    type: 'select', 
    label: '選択肢', 
    icon: List, 
    description: 'ドロップダウン選択' 
  },
  { 
    type: 'radio', 
    label: 'ラジオボタン', 
    icon: Radio, 
    description: '単一選択' 
  },
  { 
    type: 'checkbox', 
    label: 'チェックボックス', 
    icon: CheckSquare, 
    description: '複数選択' 
  }
];
```

### フィールド型定義
```typescript
interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: FieldValidation;
  options?: string[];
  order: number;
  allowOther?: boolean;
  multiple?: boolean;
}

type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file';
```

## 🎯 各フィールドタイプの詳細

### 1. テキストフィールド (text)
```typescript
case 'text':
  return (
    <div key={field.id} className="field">
      <label htmlFor={fieldId} className="text-foreground">
        {field.label}
        {field.required && <span className="required"> *</span>}
      </label>
      <input
        type="text"
        id={fieldId}
        name={field.id}
        placeholder={field.placeholder || ''}
        disabled
        className="w-full px-3 py-2 border border-gray-300 rounded-none bg-white"
      />
    </div>
  );
```

**特徴:**
- 1行のテキスト入力
- プレースホルダー対応
- 必須項目設定可能
- バリデーション対応

### 2. 長文テキストフィールド (textarea)
```typescript
case 'textarea':
  return (
    <div key={field.id} className="field">
      <label htmlFor={fieldId} className="text-foreground">
        {field.label}
        {field.required && <span className="required"> *</span>}
      </label>
      <textarea
        id={fieldId}
        name={field.id}
        placeholder={field.placeholder || ''}
        disabled
        className="w-full px-3 py-2 border border-gray-300 rounded-none bg-white"
        rows={4}
      />
    </div>
  );
```

**特徴:**
- 複数行のテキスト入力
- 行数指定可能
- プレースホルダー対応
- 必須項目設定可能

### 3. 選択肢フィールド (select)
```typescript
case 'select':
  return (
    <div key={field.id} className="field">
      <label htmlFor={fieldId} className="text-foreground">
        {field.label}
        {field.required && <span className="required"> *</span>}
      </label>
      <select
        id={fieldId}
        name={field.id}
        disabled
        className="w-full px-3 py-2 border border-gray-300 rounded-none bg-white"
      >
        <option value="">選択してください</option>
        {field.options?.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
```

**特徴:**
- ドロップダウン選択
- 選択肢の動的設定
- デフォルト選択肢
- 必須項目設定可能

### 4. ラジオボタンフィールド (radio)
```typescript
case 'radio':
  return (
    <div key={field.id} className="field">
      <label className="text-foreground">
        {field.label}
        {field.required && <span className="required"> *</span>}
      </label>
      <div className="space-y-2 mt-2">
        {field.options?.map((option: string) => (
          <label key={option} className="flex items-center text-foreground">
            <input
              type="radio"
              name={field.id}
              value={option}
              disabled
              className="mr-2"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
```

**特徴:**
- 単一選択
- 選択肢の動的設定
- ラジオボタンUI
- 必須項目設定可能

### 5. チェックボックスフィールド (checkbox)
```typescript
case 'checkbox':
  return (
    <div key={field.id} className="field">
      <label className="text-foreground">
        {field.label}
        {field.required && <span className="required"> *</span>}
      </label>
      <div className="space-y-2 mt-2">
        {field.options?.map((option: string) => (
          <label key={option} className="flex items-center text-foreground">
            <input
              type="checkbox"
              name={field.id}
              value={option}
              disabled
              className="mr-2"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
```

**特徴:**
- 複数選択
- 選択肢の動的設定
- チェックボックスUI
- 必須項目設定可能

## 🎨 フィールドタイプ選択UI

### レスポンシブグリッド
```typescript
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
  {fieldTypes.map((fieldType) => (
    <div
      key={fieldType.type}
      className="flex flex-col items-center p-2 sm:p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
      onClick={() => handleFieldAdd(fieldType.type)}
    >
      <fieldType.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mb-1 sm:mb-2" />
      <span className="text-xs sm:text-sm font-medium text-center">{fieldType.label}</span>
      <div className="text-xs text-muted-foreground leading-tight hidden sm:block">
        {fieldType.description}
      </div>
    </div>
  ))}
</div>
```

### フィールド追加処理
```typescript
const handleFieldAdd = (type: string) => {
  const newField: FormField = {
    id: generateId(),
    type: type as FormField['type'],
    label: '新しい項目',
    placeholder: '',
    required: false,
    order: currentForm.fields.length,
    options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['選択肢1', '選択肢2'] : undefined
  };

  handleFormChange({
    fields: [...currentForm.fields, newField]
  });

  // 追加した項目を選択状態にして、その項目にフォーカス
  setTimeout(() => {
    setHighlightedField(newField.id);
    setExpandedField(newField.id);
    // スクロール処理
    const addedField = document.querySelector(`[data-field-id="${newField.id}"]`);
    if (addedField) {
      addedField.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
    // ハイライト効果を3秒後に解除
    setTimeout(() => {
      setHighlightedField(null);
    }, 3000);
  }, 100);
};
```

## 🔄 フィールドタイプの管理

### フィールドタイプの追加
```typescript
// 新しいフィールドタイプの追加例
const addFieldType = (newType: FieldTypeDefinition) => {
  fieldTypes.push(newType);
};
```

### フィールドタイプの更新
```typescript
// フィールドタイプの更新例
const updateFieldType = (type: string, updates: Partial<FieldTypeDefinition>) => {
  const index = fieldTypes.findIndex(ft => ft.type === type);
  if (index >= 0) {
    fieldTypes[index] = { ...fieldTypes[index], ...updates };
  }
};
```

### フィールドタイプの削除
```typescript
// フィールドタイプの削除例
const removeFieldType = (type: string) => {
  const index = fieldTypes.findIndex(ft => ft.type === type);
  if (index >= 0) {
    fieldTypes.splice(index, 1);
  }
};
```

## ⚠️ リファクタリング時の注意点

1. **フィールドタイプ定義**: 現在の5種類のフィールドタイプを維持
2. **型定義**: FormField型の整合性を維持
3. **UI表示**: 現在のフィールドタイプ選択UIを維持
4. **追加処理**: フィールド追加時の処理を維持
5. **レスポンシブ対応**: 現在のレスポンシブ対応を維持

## 📁 関連ファイル

- `src/components/FormEditor.tsx` - フィールドタイプ選択UI
- `src/shared/types/index.ts` - 型定義
- `src/shared/utils/dataManager.ts` - フィールド生成機能

## 🔗 関連機能

- **フィールド管理**: フィールドの作成・編集
- **フィールドバリデーション**: フィールドの検証
- **フォーム生成**: フィールドのHTML生成
- **プレビュー機能**: フィールドのプレビュー表示

## 📝 テストケース

### 正常系
1. フィールドタイプの表示
2. フィールドタイプの選択
3. フィールドの追加
4. 各フィールドタイプの動作
5. レスポンシブ表示

### 異常系
1. 無効なフィールドタイプ
2. フィールド追加の失敗
3. 型定義の不整合

## 🚀 改善提案

1. **カスタムフィールド**: ユーザー定義フィールドタイプ
2. **フィールドテンプレート**: よく使われるフィールドのテンプレート
3. **フィールド検索**: フィールドタイプの検索機能
4. **フィールドプレビュー**: リアルタイムプレビュー
5. **フィールドバリデーション**: より詳細なバリデーション
6. **フィールドエクスポート**: フィールド設定のエクスポート
