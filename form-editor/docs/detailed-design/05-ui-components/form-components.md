# フォーム関連UIコンポーネント

フォーム作成・編集・表示で使用されるUIコンポーネントです。

## 📋 コンポーネント一覧

### 1. フォームエディターコンポーネント
- **ファイル**: `src/components/FormEditor.tsx`
- **機能**: フォームの作成・編集

### 2. フィールドエディターコンポーネント
- **ファイル**: `src/components/FieldEditor.tsx`
- **機能**: フィールドの編集

### 3. フォームプレビューコンポーネント
- **ファイル**: `src/components/FormPreview.tsx`
- **機能**: フォームのプレビュー表示

### 4. フォーム一覧コンポーネント
- **ファイル**: `src/components/FormList.tsx`
- **機能**: フォーム一覧の表示

### 5. 設定エディターコンポーネント
- **ファイル**: `src/components/SettingsEditor.tsx`
- **機能**: フォーム設定の編集

## 🔧 主要コンポーネント詳細

### 1. FormEditor コンポーネント
```typescript
interface FormEditorProps {
  form: Form;
  onFormChange: (form: Form) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function FormEditor({ form, onFormChange, onSave, onCancel }: FormEditorProps) {
  const [currentForm, setCurrentForm] = useState<Form>(form);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  // フォーム変更処理
  const handleFormChange = (updates: Partial<Form>) => {
    const updatedForm = { ...currentForm, ...updates };
    setCurrentForm(updatedForm);
    onFormChange(updatedForm);
  };

  return (
    <div className="space-y-6">
      {/* フォーム基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle>フォーム基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="form-name">フォーム名 *</Label>
              <Input
                id="form-name"
                value={currentForm.name}
                onChange={(e) => handleFormChange({ name: e.target.value })}
                placeholder="フォーム名を入力"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-description">説明</Label>
              <Input
                id="form-description"
                value={currentForm.description || ''}
                onChange={(e) => handleFormChange({ description: e.target.value })}
                placeholder="フォームの説明を入力"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* フィールド管理 */}
      <Card>
        <CardHeader>
          <CardTitle>フィールド管理</CardTitle>
        </CardHeader>
        <CardContent>
          {/* フィールドタイプ選択 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">フィールドを追加</h4>
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
          </div>

          {/* フィールド一覧 */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleFieldDragEnd}
          >
            <SortableContext
              items={currentForm.fields.map(field => field.id)}
              strategy={verticalListSortingStrategy}
            >
              {currentForm.fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  onUpdate={handleFieldUpdate}
                  onDelete={handleFieldDelete}
                  onDuplicate={handleFieldDuplicate}
                  isExpanded={expandedField === field.id}
                  onToggleExpanded={() => setExpandedField(expandedField === field.id ? null : field.id)}
                  isHighlighted={highlightedField === field.id}
                />
              ))}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      {/* フォーム設定 */}
      <Card>
        <CardHeader>
          <CardTitle>フォーム設定</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsEditor
            settings={currentForm.settings}
            signatures={signatures}
            onSettingsChange={(settings) => handleFormChange({ settings })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

### 2. FieldEditor コンポーネント
```typescript
interface FieldEditorProps {
  field: FormField;
  onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  onDelete: (fieldId: string) => void;
  onDuplicate: (fieldId: string) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  isHighlighted: boolean;
}

function FieldEditor({
  field,
  onUpdate,
  onDelete,
  onDuplicate,
  isExpanded,
  onToggleExpanded,
  isHighlighted
}: FieldEditorProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-field-id={field.id}
      className={`group relative border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      } ${isHighlighted ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
    >
      {/* ドラッグハンドル */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      {/* フィールド内容 */}
      <div className="ml-6">
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

        {/* フィールドプレビュー */}
        <div className="text-xs text-gray-500 mb-2">
          {field.type === 'text' && 'テキスト入力'}
          {field.type === 'textarea' && '長文テキスト'}
          {field.type === 'select' && `選択肢 (${field.options?.length || 0}項目)`}
          {field.type === 'radio' && `ラジオボタン (${field.options?.length || 0}項目)`}
          {field.type === 'checkbox' && `チェックボックス (${field.options?.length || 0}項目)`}
        </div>

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
                {/* ラベル編集 */}
                <div>
                  <Label className="text-xs sm:text-sm font-medium">ラベル</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                    className="h-8 sm:h-9 mt-1"
                  />
                </div>

                {/* プレースホルダー編集 */}
                <div>
                  <Label className="text-xs sm:text-sm font-medium">プレースホルダー</Label>
                  <Input
                    value={field.placeholder || ''}
                    onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                    className="h-8 sm:h-9 mt-1"
                  />
                </div>

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

                {/* 選択肢編集（select, radio, checkbox） */}
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
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newOptions = [...(field.options || [])];
                              newOptions.splice(index, 1);
                              onUpdate(field.id, { options: newOptions });
                            }}
                            className="h-8 w-8 p-0 text-red-600"
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
                        className="h-8 w-full border-dashed"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        選択肢を追加
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
```

### 3. FormPreview コンポーネント
```typescript
interface FormPreviewProps {
  form: Form;
}

export default function FormPreview({ form }: FormPreviewProps) {
  const renderField = (field: FormField) => {
    const fieldId = `preview-${field.id}`;

    switch (field.type) {
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

      case 'file':
        return (
          <div key={field.id} className="field">
            <label htmlFor={fieldId} className="text-foreground">
              {field.label}
              {field.required && <span className="required"> *</span>}
            </label>
            <input
              type="file"
              id={fieldId}
              name={field.id}
              multiple={field.multiple || false}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-none bg-white"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ファイルを選択してください
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="form-container bg-white border border-gray-200 rounded-lg"
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '24px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'hsl(var(--background))',
        border: '1px solid hsl(var(--border))',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        minHeight: '200px'
      }}
    >
      <form>
        {form.fields.map(renderField)}

        {/* 添付ファイル機能が有効な場合、自動的にファイルアップロードフィールドを表示 */}
        {form.settings.fileUpload?.enabled && (
          <div className="field">
            <label className="text-foreground">
              添付ファイル
              {form.settings.fileUpload.maxFiles > 1 && (
                <span className="text-sm text-muted-foreground ml-2">
                  (最大{form.settings.fileUpload.maxFiles}ファイル、1ファイルあたり{form.settings.fileUpload.maxFileSize}MBまで)
                </span>
              )}
            </label>
            <input
              type="file"
              name="attachments"
              multiple={form.settings.fileUpload.maxFiles > 1}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-none bg-white"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ファイルを選択してください
              {form.settings.fileUpload.maxFiles > 1 && (
                <span> (最大{form.settings.fileUpload.maxFiles}ファイル)</span>
              )}
              <span> (1ファイルあたり{form.settings.fileUpload.maxFileSize}MBまで)</span>
            </p>
          </div>
        )}
        
        <button
          type="submit"
          disabled
          className="mt-6 bg-gray-400 text-white px-6 py-3 rounded-none cursor-not-allowed"
        >
          送信
        </button>
      </form>
    </div>
  );
}
```

## 🎨 レスポンシブ対応

### フォームエディターのレスポンシブ対応
```typescript
{/* フォーム基本情報のレスポンシブグリッド */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="form-name">フォーム名 *</Label>
    <Input
      id="form-name"
      value={currentForm.name}
      onChange={(e) => handleFormChange({ name: e.target.value })}
      placeholder="フォーム名を入力"
      className="h-9 sm:h-10"
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="form-description">説明</Label>
    <Input
      id="form-description"
      value={currentForm.description || ''}
      onChange={(e) => handleFormChange({ description: e.target.value })}
      placeholder="フォームの説明を入力"
      className="h-9 sm:h-10"
    />
  </div>
</div>
```

### フィールドタイプ選択のレスポンシブ対応
```typescript
{/* フィールドタイプ選択のレスポンシブグリッド */}
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

## ⚠️ リファクタリング時の注意点

1. **コンポーネント構造**: 現在のコンポーネント構造を維持
2. **プロパティ**: 現在のプロパティ定義を維持
3. **状態管理**: 現在の状態管理を維持
4. **レスポンシブ対応**: 現在のレスポンシブ対応を維持
5. **アニメーション**: 現在のアニメーション効果を維持

## 📁 関連ファイル

- `src/components/FormEditor.tsx` - フォームエディター
- `src/components/FieldEditor.tsx` - フィールドエディター
- `src/components/FormPreview.tsx` - フォームプレビュー
- `src/components/FormList.tsx` - フォーム一覧
- `src/components/SettingsEditor.tsx` - 設定エディター

## 🔗 関連機能

- **フォーム管理**: フォームの作成・編集・削除
- **フィールド管理**: フィールドの作成・編集・削除
- **フォーム生成**: フォームのHTML生成
- **設定管理**: フォーム設定の管理

## 📝 テストケース

### 正常系
1. フォームエディターの表示
2. フィールドの追加・編集・削除
3. フォームプレビューの表示
4. フォーム一覧の表示
5. 設定エディターの表示

### 異常系
1. フォームデータの読み込み失敗
2. フィールドの追加・編集・削除の失敗
3. フォームプレビューの表示エラー
4. 設定の保存失敗

## 🚀 改善提案

1. **コンポーネントの最適化**: パフォーマンスの向上
2. **アクセシビリティの向上**: キーボード操作とスクリーンリーダー対応
3. **アニメーションの改善**: より滑らかなアニメーション
4. **テーマ対応**: ダークモードの完全対応
5. **国際化**: 多言語対応
6. **コンポーネントの再利用性**: より再利用可能なコンポーネント設計
