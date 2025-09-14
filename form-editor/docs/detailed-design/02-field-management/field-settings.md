# フィールド設定機能

フィールドの詳細設定（ラベル、プレースホルダー、必須項目、選択肢等）を管理する機能です。

## 📋 機能概要

フィールドの各種設定項目を編集し、フォームの動作をカスタマイズします。

## 🔧 実装詳細

### フィールド設定項目
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

### フィールド設定UI
```typescript
interface SortableFieldProps {
  field: FormField;
  onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  onDelete: (fieldId: string) => void;
  onDuplicate: (fieldId: string) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  isHighlighted: boolean;
}
```

## 🎯 主要機能

### 1. フィールド設定パネル
```typescript
{/* 展開された編集パネル */}
{isExpanded && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.2 }}
    className="overflow-hidden"
  >
    <Card className="mt-2 border-l-4 border-l-primary bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Icon className="h-4 w-4" />
          <span>項目設定</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 各種設定項目 */}
      </CardContent>
    </Card>
  </motion.div>
)}
```

### 2. ラベル設定
```typescript
{/* ラベル編集 */}
<div>
  <Label className="text-xs sm:text-sm font-medium">ラベル</Label>
  <Input
    value={field.label}
    onChange={(e) => onUpdate(field.id, { label: e.target.value })}
    className="h-8 sm:h-9 mt-1"
    placeholder="フィールドのラベルを入力"
  />
</div>
```

**特徴:**
- フィールドの表示名を設定
- リアルタイム更新
- プレビューでの確認

### 3. プレースホルダー設定
```typescript
{/* プレースホルダー編集 */}
<div>
  <Label className="text-xs sm:text-sm font-medium">プレースホルダー</Label>
  <Input
    value={field.placeholder || ''}
    onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
    className="h-8 sm:h-9 mt-1"
    placeholder="プレースホルダーテキストを入力"
  />
</div>
```

**特徴:**
- 入力欄のヒントテキストを設定
- オプション項目
- ユーザビリティの向上

### 4. 必須項目設定
```typescript
{/* 必須項目設定 */}
<div className="flex items-center space-x-2">
  <input
    type="checkbox"
    id={`required-${field.id}`}
    checked={field.required}
    onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
    className="rounded h-4 w-4"
  />
  <Label htmlFor={`required-${field.id}`} className="text-xs sm:text-sm">
    必須項目
  </Label>
</div>
```

**特徴:**
- チェックボックスで簡単設定
- 視覚的な必須項目表示
- バリデーションとの連携

### 5. 選択肢設定（select, radio, checkbox）
```typescript
{/* 選択肢編集 */}
{(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
  <div>
    <Label className="text-xs sm:text-sm font-medium">選択肢</Label>
    <div className="space-y-2 mt-1">
      {field.options?.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={option}
            onChange={(e) => {
              const newOptions = [...(field.options || [])];
              newOptions[index] = e.target.value;
              onUpdate(field.id, { options: newOptions });
            }}
            className="h-8 sm:h-9"
            placeholder="選択肢を入力"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newOptions = [...(field.options || [])];
              newOptions.splice(index, 1);
              onUpdate(field.id, { options: newOptions });
            }}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const newOptions = [...(field.options || []), '新しい選択肢'];
          onUpdate(field.id, { options: newOptions });
        }}
        className="h-8 w-full border-dashed hover:bg-gray-50"
      >
        <Plus className="h-3 w-3 mr-1" />
        選択肢を追加
      </Button>
    </div>
  </div>
)}
```

**特徴:**
- 動的な選択肢の追加・削除
- リアルタイム更新
- 直感的な操作

### 6. バリデーション設定
```typescript
{/* バリデーション設定 */}
<div className="space-y-3">
  <Label className="text-xs sm:text-sm font-medium">バリデーション設定</Label>
  
  {/* 文字数制限 */}
  <div className="grid grid-cols-2 gap-2">
    <div>
      <Label className="text-xs">最小文字数</Label>
      <Input
        type="number"
        min="0"
        value={field.validation?.minLength || ''}
        onChange={(e) => {
          const value = e.target.value ? parseInt(e.target.value) : undefined;
          onUpdate(field.id, {
            validation: { ...field.validation, minLength: value }
          });
        }}
        className="h-8 sm:h-9"
        placeholder="0"
      />
    </div>
    <div>
      <Label className="text-xs">最大文字数</Label>
      <Input
        type="number"
        min="0"
        value={field.validation?.maxLength || ''}
        onChange={(e) => {
          const value = e.target.value ? parseInt(e.target.value) : undefined;
          onUpdate(field.id, {
            validation: { ...field.validation, maxLength: value }
          });
        }}
        className="h-8 sm:h-9"
        placeholder="無制限"
      />
    </div>
  </div>

  {/* パターンマッチング */}
  <div>
    <Label className="text-xs">正規表現パターン</Label>
    <Input
      value={field.validation?.pattern || ''}
      onChange={(e) => {
        onUpdate(field.id, {
          validation: { ...field.validation, pattern: e.target.value }
        });
      }}
      className="h-8 sm:h-9"
      placeholder="例: ^[0-9]+$"
    />
    <p className="text-xs text-gray-500 mt-1">
      正規表現で入力形式を制限できます
    </p>
  </div>
</div>
```

**特徴:**
- 文字数制限の設定
- 正規表現パターンの設定
- バリデーションタイプの選択

## 🎨 フィールド設定のUI要素

### フィールドヘッダー
```typescript
{/* フィールドヘッダー */}
<div className="flex items-center justify-between mb-2">
  <div className="flex items-center space-x-2">
    <Icon className="h-4 w-4 text-gray-500" />
    <span className="text-sm font-medium text-gray-900">{field.label}</span>
    {field.required && (
      <Badge variant="destructive" className="text-xs">必須</Badge>
    )}
  </div>
  <div className="flex items-center space-x-1">
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggleExpanded}
      className="h-6 w-6 p-0"
    >
      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onDuplicate(field.id)}
      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Copy className="h-3 w-3" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onDelete(field.id)}
      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  </div>
</div>
```

### フィールドプレビュー
```typescript
{/* フィールドプレビュー */}
<div className="text-xs text-gray-500 mb-2">
  {field.type === 'text' && 'テキスト入力'}
  {field.type === 'textarea' && '長文テキスト'}
  {field.type === 'select' && `選択肢 (${field.options?.length || 0}項目)`}
  {field.type === 'radio' && `ラジオボタン (${field.options?.length || 0}項目)`}
  {field.type === 'checkbox' && `チェックボックス (${field.options?.length || 0}項目)`}
</div>
```

### 設定パネルのアニメーション
```typescript
{/* 設定パネルのアニメーション */}
<motion.div
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: 'auto' }}
  exit={{ opacity: 0, height: 0 }}
  transition={{ duration: 0.2 }}
  className="overflow-hidden"
>
  <Card className="mt-2 border-l-4 border-l-primary bg-primary/5">
    {/* 設定内容 */}
  </Card>
</motion.div>
```

## 🔄 フィールド設定の管理

### フィールド更新処理
```typescript
// フィールド更新処理
const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
  const updatedFields = currentForm.fields.map(field =>
    field.id === fieldId ? { ...field, ...updates } : field
  );
  handleFormChange({ fields: updatedFields });
};
```

### フィールド削除処理
```typescript
// フィールド削除処理
const handleFieldDelete = (fieldId: string) => {
  const updatedFields = currentForm.fields.filter(field => field.id !== fieldId);
  // orderプロパティを更新
  updatedFields.forEach((field, index) => {
    field.order = index;
  });
  handleFormChange({ fields: updatedFields });
};
```

### フィールド複製処理
```typescript
// フィールド複製処理
const handleFieldDuplicate = (fieldId: string) => {
  const fieldToDuplicate = currentForm.fields.find(field => field.id === fieldId);
  if (!fieldToDuplicate) return;

  const duplicatedField: FormField = {
    ...fieldToDuplicate,
    id: generateId(),
    label: `${fieldToDuplicate.label} (コピー)`,
    order: currentForm.fields.length
  };

  const updatedFields = [...currentForm.fields, duplicatedField];
  handleFormChange({ fields: updatedFields });
};
```

## 🎨 レスポンシブ対応

### 設定項目のレイアウト
```typescript
{/* レスポンシブグリッド */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
  <div>
    <Label className="text-xs">最小文字数</Label>
    <Input
      type="number"
      min="0"
      value={field.validation?.minLength || ''}
      onChange={(e) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        onUpdate(field.id, {
          validation: { ...field.validation, minLength: value }
        });
      }}
      className="h-8 sm:h-9"
      placeholder="0"
    />
  </div>
  <div>
    <Label className="text-xs">最大文字数</Label>
    <Input
      type="number"
      min="0"
      value={field.validation?.maxLength || ''}
      onChange={(e) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        onUpdate(field.id, {
          validation: { ...field.validation, maxLength: value }
        });
      }}
      className="h-8 sm:h-9"
      placeholder="無制限"
    />
  </div>
</div>
```

### テキストサイズの調整
```typescript
{/* レスポンシブテキストサイズ */}
<Label className="text-xs sm:text-sm font-medium">ラベル</Label>
<Input
  value={field.label}
  onChange={(e) => onUpdate(field.id, { label: e.target.value })}
  className="h-8 sm:h-9 mt-1"
  placeholder="フィールドのラベルを入力"
/>
```

## ⚠️ リファクタリング時の注意点

1. **設定項目**: 現在の設定項目を維持
2. **UI要素**: 現在の設定UIを維持
3. **アニメーション**: 現在のアニメーション効果を維持
4. **レスポンシブ対応**: 現在のレスポンシブ対応を維持
5. **バリデーション**: 現在のバリデーション機能を維持

## 📁 関連ファイル

- `src/components/FormEditor.tsx` - フィールド設定UI
- `src/shared/types/index.ts` - 型定義
- `src/shared/utils/dataManager.ts` - フィールド管理機能

## 🔗 関連機能

- **フィールド管理**: フィールドの作成・編集
- **フィールドバリデーション**: フィールドの検証
- **フォーム生成**: フィールドのHTML生成
- **プレビュー機能**: フィールドのプレビュー表示

## 📝 テストケース

### 正常系
1. フィールド設定の表示
2. ラベルの編集
3. プレースホルダーの設定
4. 必須項目の設定
5. 選択肢の追加・削除
6. バリデーション設定

### 異常系
1. 無効な設定値
2. 設定の保存失敗
3. バリデーションエラー

## 🚀 改善提案

1. **設定テンプレート**: よく使われる設定のテンプレート
2. **設定のインポート/エクスポート**: 設定データの移行
3. **設定のプレビュー**: 設定変更のプレビュー機能
4. **設定のバージョン管理**: 設定の履歴管理
5. **設定の検証**: より詳細な設定値の検証
6. **設定の一括操作**: 複数フィールドの設定一括変更
