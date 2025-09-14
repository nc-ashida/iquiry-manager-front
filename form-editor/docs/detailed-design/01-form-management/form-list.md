# フォーム一覧機能

作成されたフォームの一覧表示・管理を行う機能です。

## 📋 機能概要

フォーム一覧の表示、検索、フィルタリング、ページネーション、各種操作（編集、削除、複製、プレビュー）を提供します。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/components/FormList.tsx` (413行)
- **インターフェース**: `FormListProps`

### コンポーネント構成
```typescript
interface FormListProps {
  forms: Form[];
  onCreateForm: () => void;
  onEditForm: (form: Form) => void;
  onDeleteForm: (formId: string) => void;
  onPreviewForm: (form: Form) => void;
  onDuplicateForm: (form: Form) => void;
}
```

## 🎯 主要機能

### 1. フォーム一覧表示
```typescript
<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
  {paginatedForms.map((form) => (
    <Card key={form.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-fit">
      <CardHeader className="pb-3 px-4 py-4 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3">
          {/* フォーム名 */}
          <div className="w-full">
            <CardTitle className="text-xs sm:text-sm font-semibold break-words leading-tight">
              {form.name}
            </CardTitle>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end">
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
              {/* 各種操作ボタン */}
            </div>
          </div>

          {/* 説明文 */}
          {form.description && (
            <CardDescription className="line-clamp-2 text-xs text-muted-foreground">
              {form.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-4 pb-4 sm:px-6 sm:pb-6">
        {/* フォーム情報 */}
      </CardContent>
    </Card>
  ))}
</div>
```

### 2. 検索機能
```typescript
// 検索バー
{forms.length > 0 && (
  <div className="mb-6">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="フォーム名で検索..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
    {searchQuery && (
      <p className="text-xs text-muted-foreground mt-2">
        {filteredForms.length}件のフォームが見つかりました
      </p>
    )}
  </div>
)}

// 検索ロジック
const filteredForms = useMemo(() => {
  if (!searchQuery.trim()) return forms;
  return forms.filter(form =>
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
}, [forms, searchQuery]);
```

### 3. ページネーション
```typescript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

// ページネーション計算
const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedForms = filteredForms.slice(startIndex, endIndex);

// ページネーションUI
{filteredForms.length > itemsPerPage && (
  <div className="mt-6 flex items-center justify-between">
    <div className="text-sm text-muted-foreground">
      {startIndex + 1}-{Math.min(endIndex, filteredForms.length)} / {filteredForms.length}件
    </div>
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {/* ページ番号ボタン */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
)}
```

### 4. フォーム操作機能

#### コードコピー機能
```typescript
const handleCopyScript = async (form: Form) => {
  const namespace = `ir-form-${form.id}`;
  const formId = `${namespace}-container`;
  const formElementId = `${namespace}-form`;

  const script = `
<!-- 問合せフォーム: ${form.name} -->
<div id="${formId}" class="ir-form-container">
  <form id="${formElementId}" class="ir-form">
    ${form.fields.map(field => {
      const fieldId = `${namespace}-field-${field.id}`;
      const required = field.required ? 'required' : '';

      switch (field.type) {
        case 'text':
          return `<div class="ir-form-field">
            <label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label>
            <input type="text" id="${fieldId}" name="${field.id}" class="ir-form-input" placeholder="${field.placeholder || ''}" ${required}>
          </div>`;
        // その他のフィールドタイプ...
      }
    }).join('\n    ')}
    <button type="submit" class="ir-form-submit">送信</button>
  </form>
</div>

<style>
${form.styling.css}
</style>

<script>
${generateFormJavaScript(form, formElementId)}
</script>`;

  try {
    await navigator.clipboard.writeText(script);
    alert('JavaScriptコードをクリップボードにコピーしました');
  } catch (err) {
    console.error('Failed to copy: ', err);
    alert('コピーに失敗しました');
  }
};
```

#### 削除確認ダイアログ
```typescript
<Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
  <DialogContent className="bg-white border border-gray-200 shadow-lg">
    <DialogHeader>
      <DialogTitle className="text-gray-900">フォームを削除</DialogTitle>
      <DialogDescription className="text-gray-600">
        この操作は取り消せません。フォームとその関連データが完全に削除されます。
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
        キャンセル
      </Button>
      <Button
        variant="destructive"
        onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        削除
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 🎨 レスポンシブ対応

### 1. グリッドレイアウト
```typescript
// レスポンシブグリッド
<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
  {/* フォームカード */}
</div>
```
- **モバイル**: 1列 (`grid-cols-1`)
- **タブレット**: 2列 (`sm:grid-cols-2`)
- **デスクトップ**: 3列 (`xl:grid-cols-3`)

### 2. カード内レイアウト
```typescript
<CardHeader className="pb-3 px-4 py-4 sm:px-6 sm:py-4">
  {/* パディングの調整 */}
</CardHeader>

<CardContent className="pt-0 px-4 pb-4 sm:px-6 sm:pb-6">
  {/* パディングの調整 */}
</CardContent>
```

### 3. テキストサイズ
```typescript
<CardTitle className="text-xs sm:text-sm font-semibold break-words leading-tight">
  {form.name}
</CardTitle>

<CardDescription className="line-clamp-2 text-xs text-muted-foreground">
  {form.description}
</CardDescription>
```

### 4. アクションボタン
```typescript
<div className="flex space-x-1 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleCopyScript(form)}
    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
    title="コードをコピー"
  >
    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
  </Button>
  {/* その他のボタン */}
</div>
```

### 5. 空状態の表示
```typescript
{forms.length === 0 ? (
  <div className="text-center py-8 sm:py-12">
    <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mb-4 sm:mb-6">
      <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
    </div>
    <h3 className="text-sm sm:text-base font-semibold mb-2">フォームがありません</h3>
    <p className="text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto text-xs sm:text-sm">
      最初のフォームを作成して、問合せシステムを始めましょう
    </p>
    <Button onClick={onCreateForm} size="lg" className="shadow-lg w-full sm:w-auto hover:shadow-xl transition-all duration-200">
      <Plus className="h-4 w-4 mr-2" />
      フォームを作成
    </Button>
  </div>
) : (
  /* フォーム一覧 */
)}
```

## 🔄 状態管理

### ローカル状態
```typescript
const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
const [searchQuery, setSearchQuery] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
```

### 状態更新関数
```typescript
const handleSearchChange = (query: string) => {
  setSearchQuery(query);
  setCurrentPage(1); // 検索時にページをリセット
};

const handlePageChange = (page: number) => {
  setCurrentPage(page);
};

const handleDelete = (formId: string) => {
  onDeleteForm(formId);
  setShowDeleteConfirm(null);
};
```

## ⚠️ リファクタリング時の注意点

1. **レスポンシブレイアウト**: 現在のグリッドレイアウトを維持
2. **検索機能**: 現在の検索ロジックを維持
3. **ページネーション**: 現在のページネーション機能を維持
4. **操作ボタン**: 各種操作ボタンの機能を維持
5. **コード生成**: 埋め込みコード生成機能を維持

## 📁 関連ファイル

- `src/components/FormList.tsx` - メイン実装
- `src/shared/utils/dataManager.ts` - フォーム生成機能
- `src/shared/types/index.ts` - 型定義

## 🔗 関連機能

- **フォーム管理**: フォームのCRUD操作
- **フォーム生成**: 埋め込みコードの生成
- **検索・フィルタ**: フォームの検索機能
- **ページネーション**: 大量データの効率的な表示

## 📝 テストケース

### 正常系
1. フォーム一覧の表示
2. 検索機能
3. ページネーション
4. フォーム操作（編集、削除、複製、プレビュー）
5. コードコピー機能
6. レスポンシブ表示

### 異常系
1. 空のフォーム一覧
2. 検索結果なし
3. ページネーションエラー
4. 操作の失敗

## 🚀 改善提案

1. **仮想化**: 大量フォーム時の仮想スクロール
2. **並び替え**: フォームの並び替え機能
3. **フィルタ**: より詳細なフィルタリング
4. **一括操作**: 複数フォームの一括操作
5. **エクスポート**: フォームデータのエクスポート
6. **テンプレート**: フォームテンプレート機能
