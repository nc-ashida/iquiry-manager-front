# フォーム編集機能

## 📋 機能概要

フォームの詳細編集を行う中核機能です。1,416行の巨大コンポーネントで、フォームの基本情報、設定、フィールド管理、プレビュー機能を統合しています。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/components/FormEditor.tsx` (1,416行)
- **主要関数**: `FormEditor`, `SortableField`, `SortableOption`

### コンポーネント構成
```typescript
interface FormEditorProps {
  form: Form | null;
  onSave: (form: Form) => void;
  onCancel: () => void;
}
```

## 🎯 主要機能

### 1. フォーム基本情報編集
```typescript
// フォーム名と説明の編集
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="form-name" className="text-sm font-medium">
      フォーム名 <span className="text-red-500">*</span>
    </Label>
    <Input
      id="form-name"
      type="text"
      value={currentForm.name}
      onChange={(e) => handleFormChange({ name: e.target.value })}
      placeholder="フォーム名を入力"
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="form-description" className="text-sm font-medium">説明</Label>
    <Input
      id="form-description"
      type="text"
      value={currentForm.description || ''}
      onChange={(e) => handleFormChange({ description: e.target.value })}
      placeholder="フォームの説明を入力"
    />
  </div>
</div>
```

### 2. フォーム設定編集

#### 自動返信設定
```typescript
<div className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
  <div className="space-y-2 flex-1 pr-4">
    <Label htmlFor="autoReply" className="text-base font-semibold cursor-pointer text-gray-900">
      自動返信
    </Label>
    <p className="text-sm text-gray-600 leading-relaxed">
      フォーム送信時に自動返信メールを送信します
    </p>
  </div>
  <div className="flex-shrink-0">
    <Switch
      id="autoReply"
      checked={currentForm.settings.autoReply}
      onCheckedChange={(checked: boolean) =>
        handleFormChange({
          settings: { ...currentForm.settings, autoReply: checked }
        })
      }
    />
  </div>
</div>
```

#### ファイルアップロード設定
```typescript
// ファイルアップロードの有効/無効
<Switch
  id="fileUpload"
  checked={currentForm.settings.fileUpload?.enabled || false}
  onCheckedChange={(checked: boolean) => {
    const currentFileUpload = currentForm.settings.fileUpload || {
      enabled: false,
      maxFiles: 1,
      maxFileSize: 10
    };
    handleFormChange({
      settings: {
        ...currentForm.settings,
        fileUpload: {
          ...currentFileUpload,
          enabled: checked
        }
      }
    });
  }}
/>

// 詳細設定（有効時のみ表示）
{currentForm.settings.fileUpload?.enabled && (
  <div className="space-y-6 pl-8 border-l-2 border-black bg-gray-50/50 p-6 rounded-r-xl">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-3">
        <Label htmlFor="maxFiles" className="text-sm font-semibold text-gray-900">
          最大ファイル数
        </Label>
        <Input
          id="maxFiles"
          type="number"
          min="1"
          max="5"
          value={currentForm.settings.fileUpload?.maxFiles || 1}
          onChange={(e) => {
            const value = Math.min(5, Math.max(1, parseInt(e.target.value) || 1));
            handleFormChange({
              settings: {
                ...currentForm.settings,
                fileUpload: {
                  ...currentForm.settings.fileUpload!,
                  maxFiles: value
                }
              }
            });
          }}
          className="h-10"
        />
        <p className="text-sm text-gray-600">1〜5ファイルまで</p>
      </div>
      {/* 最大ファイルサイズ設定も同様 */}
    </div>
  </div>
)}
```

#### 許可ドメイン設定
```typescript
// ドメイン一覧の表示・編集
{currentForm.settings.allowedDomains?.map((domain, index) => (
  <div key={index} className="flex items-center space-x-2">
    <Input
      type="text"
      value={domain}
      onChange={(e) => {
        const newDomains = [...(currentForm.settings.allowedDomains || [])];
        newDomains[index] = e.target.value;
        handleFormChange({
          settings: {
            ...currentForm.settings,
            allowedDomains: newDomains
          }
        });
      }}
      placeholder="example.com"
      className={`flex-1 ${!domain.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
    />
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => {
        const currentDomains = currentForm.settings.allowedDomains || [];
        if (currentDomains.length <= 1) return; // 最低1つは残す
        const newDomains = [...currentDomains];
        newDomains.splice(index, 1);
        handleFormChange({
          settings: {
            ...currentForm.settings,
            allowedDomains: newDomains
          }
        });
      }}
      disabled={(currentForm.settings.allowedDomains || []).length <= 1}
    >
      削除
    </Button>
  </div>
)) || []}
```

### 3. フィールド管理機能

#### フィールド追加
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

#### ドラッグ&ドロップによる並び替え
```typescript
// ドラッグアンドドロップのセンサー設定
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

// フィールドの並び替え処理
const handleFieldDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || !currentForm) return;

  const activeId = active.id as string;
  const overId = over.id as string;
  if (activeId === overId) return;

  const oldIndex = currentForm.fields.findIndex(field => field.id === activeId);
  const newIndex = currentForm.fields.findIndex(field => field.id === overId);
  if (oldIndex === -1 || newIndex === -1) return;

  const newFields = arrayMove(currentForm.fields, oldIndex, newIndex);
  // orderプロパティを更新
  newFields.forEach((field, index) => {
    field.order = index;
  });
  setCurrentForm({ ...currentForm, fields: newFields });
};
```

### 4. フィールド編集機能

#### インライン編集パネル
```typescript
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
        {/* その他の設定項目 */}
      </CardContent>
    </Card>
  </motion.div>
)}
```

### 5. プレビュー機能

#### プレビューモーダル
```typescript
<AnimatePresence>
  {showPreview && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4"
      onClick={() => setShowPreview(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">プレビュー</h2>
            <Button
              variant="ghost"
              onClick={() => setShowPreview(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600"
            >
              ×
            </Button>
          </div>
          <FormPreview form={currentForm} />
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

## 🔄 状態管理

### 主要な状態
```typescript
const [currentForm, setCurrentForm] = useState<Form | null>(form);
const [showPreview, setShowPreview] = useState(false);
const [signatures, setSignatures] = useState<Signature[]>([]);
const [highlightedField, setHighlightedField] = useState<string | null>(null);
const [expandedField, setExpandedField] = useState<string | null>(null);
```

### 状態更新関数
```typescript
const handleFormChange = (updates: Partial<Form>) => {
  setCurrentForm({ ...currentForm, ...updates });
};

const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
  const updatedFields = currentForm.fields.map(field =>
    field.id === fieldId ? { ...field, ...updates } : field
  );
  handleFormChange({ fields: updatedFields });
};
```

## ⚠️ リファクタリング時の注意点

### 1. コンポーネント分割
- **FormBasicInfo**: 基本情報編集部分
- **FormSettings**: 設定編集部分
- **FieldList**: フィールド一覧部分
- **FieldEditor**: フィールド編集部分
- **FormPreview**: プレビュー部分

### 2. 状態管理の統一
- 現在の状態管理パターンを維持
- Zustand等でグローバル状態に移行
- プロップドリリングの解消

### 3. 機能の維持
- ドラッグ&ドロップ機能
- リアルタイムプレビュー
- インライン編集
- バリデーション機能
- アニメーション効果

### 4. パフォーマンス
- 大量フィールド時の仮想化
- メモ化による最適化
- 不要な再レンダリングの防止

## 🔗 関連機能

- **フォーム保存**: `handleSave()`でフォームを保存
- **フォームキャンセル**: `onCancel()`で編集をキャンセル
- **署名管理**: 署名データの読み込み・表示
- **データ管理**: ローカルストレージとの連携

## 📝 テストケース

### 正常系
1. フォーム基本情報の編集
2. 設定の変更
3. フィールドの追加・削除・編集
4. ドラッグ&ドロップによる並び替え
5. プレビュー機能
6. 保存・キャンセル機能

### 異常系
1. 無効な設定値の入力
2. 必須項目の未入力
3. ドメイン設定のバリデーション
4. ファイルアップロード設定の制限

## 🚀 改善提案

1. **コンポーネント分割**: 1,416行の巨大コンポーネントを分割
2. **状態管理の統一**: Zustand等でのグローバル状態管理
3. **パフォーマンス最適化**: メモ化と仮想化
4. **テストの充実**: 単体テストと統合テスト
5. **アクセシビリティ**: キーボード操作とスクリーンリーダー対応
