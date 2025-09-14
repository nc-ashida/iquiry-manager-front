# フレームワーク設計ドキュメント

## 概要

form-editorアプリケーションのフレームワーク設計ドキュメントです。コンポーネント、状態管理、API、テストの各フレームワークの設計方針と実装方法を説明します。

## 📁 ドキュメント構成

### 1. [コンポーネントフレームワーク](./component-framework.md)
- コンポーネント設計原則
- UIコンポーネント設計
- ビジネスロジックコンポーネント設計
- 共通コンポーネント設計
- テスト戦略

### 2. [状態管理フレームワーク](./state-management.md)
- 状態管理設計原則
- Redux Toolkit ストア設計
- 状態スライス設計
- カスタムフック設計
- 非同期処理設計

### 3. [APIフレームワーク](./api-framework.md)
- API設計原則
- APIクライアント設計
- エンドポイント設計
- APIフック設計
- エラーハンドリング

### 4. [テストフレームワーク](./testing-framework.md)
- テスト設計原則
- 単体テスト設計
- 統合テスト設計
- E2Eテスト設計
- テストユーティリティ

## 🎯 設計目標

### 現在の状況
- **コンポーネント数**: 15個
- **最大コンポーネントサイズ**: 1,416行
- **再利用性**: 30%
- **型安全性**: 60%
- **テストカバレッジ**: 20%

### 目標
- **コンポーネント数**: 40-50個
- **最大コンポーネントサイズ**: 200行以下
- **再利用性**: 80%以上
- **型安全性**: 95%以上
- **テストカバレッジ**: 80%以上

## 🏗️ アーキテクチャ概要

### コンポーネント階層
```
src/components/
├── ui/                          # 基本UIコンポーネント
├── forms/                       # フォーム関連コンポーネント
├── layout/                      # レイアウトコンポーネント
├── business/                    # ビジネスロジックコンポーネント
└── common/                      # 共通コンポーネント
```

### 状態管理階層
```
src/state/
├── store/                       # グローバル状態管理
├── hooks/                       # カスタムフック
├── services/                    # APIサービス
└── utils/                       # 状態管理ユーティリティ
```

### API階層
```
src/api/
├── client/                      # APIクライアント
├── endpoints/                   # APIエンドポイント
├── hooks/                       # APIフック
├── mutations/                   # ミューテーション
└── utils/                       # APIユーティリティ
```

### テスト階層
```
src/
├── __tests__/                   # テストファイル
├── __mocks__/                   # モックファイル
├── test-utils/                  # テストユーティリティ
└── e2e/                         # E2Eテスト
```

## 🔧 実装方針

### 1. 段階的実装
既存の機能を壊さないよう、段階的にフレームワークを実装します。

### 2. 型安全性の確保
TypeScriptによる完全な型安全性を確保します。

### 3. テスト駆動開発
各フレームワークの実装時にテストを並行して実装します。

### 4. ドキュメント化
実装過程でドキュメントを更新し、保守性を確保します。

## 📊 実装計画

### Phase 1: 基盤構築
- [ ] プロジェクト構造の整理
- [ ] 基本設定ファイルの作成
- [ ] 型定義の整備

### Phase 2: コンポーネントフレームワーク
- [ ] 基本UIコンポーネントの実装
- [ ] 共通コンポーネントの実装
- [ ] ビジネスロジックコンポーネントの実装

### Phase 3: 状態管理フレームワーク
- [ ] Redux Toolkit ストアの実装
- [ ] 状態スライスの実装
- [ ] カスタムフックの実装

### Phase 4: APIフレームワーク
- [ ] APIクライアントの実装
- [ ] エンドポイントの実装
- [ ] APIフックの実装

### Phase 5: テストフレームワーク
- [ ] 単体テストの実装
- [ ] 統合テストの実装
- [ ] E2Eテストの実装

### Phase 6: 統合・最適化
- [ ] フレームワーク間の統合
- [ ] パフォーマンス最適化
- [ ] ドキュメントの完成

## 🚀 使用方法

### 1. コンポーネントの使用
```typescript
import { Button } from '@/components/ui/Button';
import { FormEditor } from '@/components/forms/FormEditor';

// 基本UIコンポーネント
<Button variant="primary" size="md" loading={isLoading}>
  保存
</Button>

// ビジネスロジックコンポーネント
<FormEditor form={form} onSave={handleSave} onCancel={handleCancel} />
```

### 2. 状態管理の使用
```typescript
import { useForms } from '@/state/hooks/useForms';
import { useUI } from '@/state/hooks/useUI';

// フォーム状態の使用
const { forms, loading, createForm } = useForms();

// UI状態の使用
const { sidebarOpen, toggleSidebar } = useUI();
```

### 3. APIの使用
```typescript
import { useForms } from '@/api/hooks/useForms';
import { useCreateForm } from '@/api/hooks/useForms';

// フォームデータの取得
const { data: forms, isLoading } = useForms();

// フォームの作成
const createFormMutation = useCreateForm();
```

### 4. テストの実行
```bash
# 単体テスト
npm run test:unit

# 統合テスト
npm run test:integration

# E2Eテスト
npm run test:e2e

# 全テスト
npm run test:all
```

## 📚 参考資料

### 設計原則
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/latest)
- [Testing Library](https://testing-library.com/)

### 技術ドキュメント
- [React Components](https://reactjs.org/docs/components-and-props.html)
- [TypeScript React](https://www.typescriptlang.org/docs/handbook/react.html)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [Playwright Testing](https://playwright.dev/docs/intro)

## 🤝 貢献

フレームワークの改善や新機能の追加については、以下の手順で貢献してください：

1. イシューの作成
2. ブランチの作成
3. 実装とテスト
4. プルリクエストの作成
5. コードレビュー
6. マージ

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

**注意**: フレームワークの実装時は、既存の機能を壊さないよう段階的に進め、各段階でテストを実装してください。
