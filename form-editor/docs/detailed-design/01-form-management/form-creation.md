# フォーム作成機能

## 📋 機能概要

新しい問合せフォームを作成する機能です。デフォルト設定でフォームを初期化し、編集モードに移行します。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/app/page.tsx`
- **関数**: `handleCreateForm()`

### 実装コード
```typescript
const handleCreateForm = () => {
  const newForm: Form = {
    id: generateId(),
    name: '新しいフォーム',
    description: '',
    fields: [],
    styling: {
      css: `/* デフォルトCSS */`,
      theme: 'default'
    },
    settings: {
      completionUrl: '',
      signatureId: '',
      autoReply: true,
      fileUpload: {
        enabled: false,
        maxFiles: 1,
        maxFileSize: 10
      },
      allowedDomains: ['localhost:3000']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  setSelectedForm(newForm);
  setIsEditing(true);
};
```

## 🎯 機能仕様

### 1. フォーム初期化
- **ID生成**: `generateId()`でユニークIDを生成
- **デフォルト名**: "新しいフォーム"
- **空のフィールド配列**: 初期状態ではフィールドなし
- **デフォルトCSS**: 基本的なフォームスタイル
- **デフォルト設定**: 自動返信有効、ファイルアップロード無効

### 2. 状態管理
- **selectedForm**: 編集対象のフォームを設定
- **isEditing**: 編集モードに切り替え
- **showPreview**: プレビューモードを無効化

### 3. デフォルトCSS
```css
/* 名前空間ベースのCSS（衝突を防ぐため） */
.ir-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.ir-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* その他詳細なスタイル定義... */
```

### 4. デフォルト設定
- **completionUrl**: 空文字（アラート表示）
- **signatureId**: 空文字
- **autoReply**: true（自動返信有効）
- **fileUpload**: 無効
- **allowedDomains**: ['localhost:3000']（開発環境用）

## 🔄 処理フロー

1. **ボタンクリック**: "新しいフォームを作成"ボタンをクリック
2. **フォーム生成**: デフォルト設定で新しいフォームオブジェクトを作成
3. **状態更新**: `setSelectedForm(newForm)`でフォームを設定
4. **編集モード**: `setIsEditing(true)`で編集モードに移行
5. **UI切り替え**: FormEditorコンポーネントが表示される

## 🎨 UI要素

### 作成ボタン
```typescript
<Button
  onClick={handleCreateForm}
  size="lg"
  className="bg-black hover:bg-gray-800 text-white shadow-sm w-full sm:w-auto"
>
  <Plus className="h-4 w-4 mr-2" />
  <span className="hidden sm:inline">新しいフォームを作成</span>
  <span className="sm:hidden">フォーム作成</span>
</Button>
```

### レスポンシブ対応
- **デスクトップ**: "新しいフォームを作成"
- **モバイル**: "フォーム作成"

## ⚠️ リファクタリング時の注意点

1. **ID生成機能**: `generateId()`の機能を維持
2. **デフォルト設定**: 現在のデフォルト値を維持
3. **状態管理**: フォーム作成後の状態遷移を維持
4. **CSS**: デフォルトCSSの内容を維持
5. **型安全性**: Form型の整合性を維持

## 🔗 関連機能

- **フォーム編集**: 作成後はFormEditorで編集
- **フォーム保存**: FormEditorの保存機能で永続化
- **フォーム一覧**: FormListで作成されたフォームを表示
- **データ管理**: dataManagerでローカルストレージに保存

## 📝 テストケース

### 正常系
1. ボタンクリックでフォームが作成される
2. デフォルト設定が正しく設定される
3. 編集モードに正しく移行する
4. フォームIDがユニークに生成される

### 異常系
1. ID生成の失敗処理
2. 状態更新の失敗処理
3. メモリ不足時の処理

## 🚀 改善提案

1. **テンプレート機能**: よく使われる設定のテンプレート
2. **フォーム複製**: 既存フォームからの複製機能
3. **一括作成**: 複数フォームの一括作成
4. **設定の継承**: 前回の設定を継承する機能
