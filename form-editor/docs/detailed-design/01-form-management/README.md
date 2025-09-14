# フォーム管理機能

フォーム管理機能は、問合せフォームの作成・編集・管理を行う中核機能です。

## 📋 機能一覧

### 1. フォーム作成機能
- **ファイル**: `src/app/page.tsx` (handleCreateForm)
- **機能**: 新しいフォームの作成
- **詳細**: [form-creation.md](./form-creation.md)

### 2. フォーム編集機能
- **ファイル**: `src/components/FormEditor.tsx` (1,416行)
- **機能**: フォームの詳細編集
- **詳細**: [form-editing.md](./form-editing.md)

### 3. フォームプレビュー機能
- **ファイル**: `src/components/FormPreview.tsx`
- **機能**: フォームのプレビュー表示
- **詳細**: [form-preview.md](./form-preview.md)

### 4. フォーム一覧機能
- **ファイル**: `src/components/FormList.tsx` (413行)
- **機能**: フォーム一覧の表示・管理
- **詳細**: [form-list.md](./form-list.md)

### 5. フォーム設定機能
- **ファイル**: `src/components/SettingsEditor.tsx`
- **機能**: フォームの詳細設定
- **詳細**: [form-settings.md](./form-settings.md)

## 🔧 主要な実装詳細

### 状態管理
- 各コンポーネントで個別に`useState`を使用
- フォームデータの同期は親コンポーネント経由
- ローカルストレージによる永続化

### データフロー
```
App (page.tsx)
├── FormList (一覧表示)
├── FormEditor (編集)
│   ├── FormBasicInfo (基本情報)
│   ├── FormSettings (設定)
│   ├── FieldList (フィールド一覧)
│   └── FormPreview (プレビュー)
└── SettingsEditor (設定詳細)
```

### 主要な型定義
```typescript
interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  styling: FormStyling;
  settings: FormSettings;
  createdAt: string;
  updatedAt: string;
}
```

## ⚠️ リファクタリング時の注意点

1. **FormEditor.tsx**: 1,416行の巨大コンポーネントを分割する際は、機能を失わないよう注意
2. **状態管理**: 現在の状態管理パターンを維持しつつ、Zustand等で統一
3. **データ永続化**: ローカルストレージの機能を維持
4. **ドラッグ&ドロップ**: フィールドの並び替え機能を維持
5. **プレビュー機能**: リアルタイムプレビューの機能を維持

## 📁 関連ファイル

- `src/app/page.tsx` - メインページ
- `src/components/FormEditor.tsx` - フォームエディター
- `src/components/FormList.tsx` - フォーム一覧
- `src/components/FormPreview.tsx` - フォームプレビュー
- `src/components/SettingsEditor.tsx` - 設定エディター
- `src/shared/types/index.ts` - 型定義
- `src/shared/utils/dataManager.ts` - データ管理
