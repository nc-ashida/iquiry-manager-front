# フィールド管理機能

フォーム内のフィールド（入力項目）の作成・編集・管理を行う機能です。

## 📋 機能一覧

### 1. フィールドタイプ管理
- **ファイル**: `src/components/FormEditor.tsx` (fieldTypes配列)
- **機能**: 各種フィールドタイプの定義と管理
- **詳細**: [field-types.md](./field-types.md)

### 2. フィールドバリデーション
- **ファイル**: `src/components/FormEditor.tsx` (バリデーション設定部分)
- **機能**: フィールドの入力値検証
- **詳細**: [field-validation.md](./field-validation.md)

### 3. ドラッグ&ドロップ機能
- **ファイル**: `src/components/FormEditor.tsx` (DndContext部分)
- **機能**: フィールドの並び替え
- **詳細**: [field-drag-drop.md](./field-drag-drop.md)

### 4. フィールド設定
- **ファイル**: `src/components/FormEditor.tsx` (SortableField部分)
- **機能**: フィールドの詳細設定
- **詳細**: [field-settings.md](./field-settings.md)

## 🔧 主要な実装詳細

### フィールドタイプ定義
```typescript
const fieldTypes = [
  { type: 'text', label: 'テキスト', icon: Type, description: '1行のテキスト入力' },
  { type: 'textarea', label: '長文テキスト', icon: FileText, description: '複数行のテキスト入力' },
  { type: 'select', label: '選択肢', icon: List, description: 'ドロップダウン選択' },
  { type: 'radio', label: 'ラジオボタン', icon: Radio, description: '単一選択' },
  { type: 'checkbox', label: 'チェックボックス', icon: CheckSquare, description: '複数選択' }
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
```

### バリデーション型定義
```typescript
interface FieldValidation {
  type?: ValidationType;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  required?: boolean;
}
```

## 🎯 主要機能

### 1. フィールド追加
- 5種類のフィールドタイプから選択
- デフォルト設定でフィールドを初期化
- 追加後の自動フォーカスとハイライト

### 2. フィールド編集
- インライン編集パネル
- ラベル、プレースホルダーの編集
- 必須項目の設定
- バリデーション設定

### 3. フィールド並び替え
- ドラッグ&ドロップによる並び替え
- キーボード操作対応
- 視覚的フィードバック

### 4. フィールド削除・複製
- 個別フィールドの削除
- フィールドの複製機能
- 確認ダイアログ

## 🔄 状態管理

### フィールド状態
```typescript
const [currentForm, setCurrentForm] = useState<Form | null>(form);
const [highlightedField, setHighlightedField] = useState<string | null>(null);
const [expandedField, setExpandedField] = useState<string | null>(null);
```

### 状態更新関数
```typescript
const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
  const updatedFields = currentForm.fields.map(field =>
    field.id === fieldId ? { ...field, ...updates } : field
  );
  handleFormChange({ fields: updatedFields });
};
```

## ⚠️ リファクタリング時の注意点

1. **フィールドタイプ**: 現在の5種類のフィールドタイプを維持
2. **バリデーション**: 現在のバリデーション機能を維持
3. **ドラッグ&ドロップ**: @dnd-kitの機能を維持
4. **インライン編集**: 現在の編集UIを維持
5. **アニメーション**: framer-motionのアニメーションを維持

## 📁 関連ファイル

- `src/components/FormEditor.tsx` - メイン実装
- `src/components/FieldEditor.tsx` - 独立したフィールドエディター
- `src/shared/types/index.ts` - 型定義
- `src/shared/utils/dataManager.ts` - データ管理

## 🔗 関連機能

- **フォーム管理**: フォーム内のフィールドとして管理
- **プレビュー機能**: フィールドのプレビュー表示
- **フォーム生成**: フィールドのHTML/JS生成
- **バリデーション**: クライアントサイドバリデーション
