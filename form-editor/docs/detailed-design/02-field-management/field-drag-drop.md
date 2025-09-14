# フィールドドラッグ&ドロップ機能

フィールドの並び替えを行うドラッグ&ドロップ機能です。

## 📋 機能概要

@dnd-kitライブラリを使用して、フィールドの並び替えを直感的に行うことができます。

## 🔧 実装詳細

### ライブラリ構成
```typescript
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
```

### ドラッグ&ドロップのセンサー設定
```typescript
// ドラッグアンドドロップのセンサー設定
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

## 🎯 主要機能

### 1. ドラッグ&ドロップコンテキスト
```typescript
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
```

### 2. フィールドの並び替え処理
```typescript
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

### 3. ソータブルフィールドコンポーネント
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

function SortableField({
  field,
  onUpdate,
  onDelete,
  onDuplicate,
  isExpanded,
  onToggleExpanded,
  isHighlighted
}: SortableFieldProps) {
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

## 🎨 ドラッグ&ドロップのUI要素

### ドラッグハンドル
```typescript
// ドラッグハンドル
<div
  {...attributes}
  {...listeners}
  className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
>
  <GripVertical className="h-4 w-4 text-gray-400" />
</div>
```

### ドラッグ中のスタイル
```typescript
// ドラッグ中のスタイル
<div
  ref={setNodeRef}
  style={style}
  className={`group relative border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200 ${
    isDragging ? 'opacity-50' : ''
  } ${isHighlighted ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
>
  {/* フィールド内容 */}
</div>
```

### ハイライト効果
```typescript
// ハイライト効果
const [highlightedField, setHighlightedField] = useState<string | null>(null);

// フィールド追加時のハイライト
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
```

## 🔄 キーボード操作対応

### キーボードセンサー
```typescript
// キーボードセンサーの設定
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

### キーボード操作
- **Space**: ドラッグ開始
- **Arrow Keys**: 移動
- **Enter**: ドロップ
- **Escape**: キャンセル

## 🎨 レスポンシブ対応

### モバイル対応
```typescript
// モバイルでのドラッグ&ドロップ
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

### タッチ操作対応
```typescript
// タッチ操作の制約
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  })
);
```

## ⚠️ リファクタリング時の注意点

1. **@dnd-kitライブラリ**: 現在の@dnd-kitの機能を維持
2. **ドラッグ&ドロップ**: 現在のドラッグ&ドロップ機能を維持
3. **キーボード操作**: 現在のキーボード操作対応を維持
4. **アニメーション**: 現在のアニメーション効果を維持
5. **レスポンシブ対応**: 現在のレスポンシブ対応を維持

## 📁 関連ファイル

- `src/components/FormEditor.tsx` - ドラッグ&ドロップ実装
- `package.json` - @dnd-kit依存関係
- `src/shared/types/index.ts` - 型定義

## 🔗 関連機能

- **フィールド管理**: フィールドの並び替え
- **フィールド編集**: フィールドの編集機能
- **アニメーション**: ドラッグ&ドロップのアニメーション
- **ユーザー体験**: 直感的な操作体験

## 📝 テストケース

### 正常系
1. フィールドのドラッグ&ドロップ
2. キーボード操作
3. タッチ操作
4. 並び替えの永続化
5. アニメーション効果

### 異常系
1. ドラッグ&ドロップの失敗
2. キーボード操作の失敗
3. タッチ操作の失敗
4. 並び替えの失敗

## 🚀 改善提案

1. **ドラッグ&ドロップの最適化**: パフォーマンスの向上
2. **アニメーションの改善**: より滑らかなアニメーション
3. **アクセシビリティの向上**: スクリーンリーダー対応
4. **タッチ操作の改善**: モバイルでの操作性向上
5. **ドラッグ&ドロップの拡張**: より高度な操作
6. **キーボード操作の拡張**: より多くのキーボードショートカット
