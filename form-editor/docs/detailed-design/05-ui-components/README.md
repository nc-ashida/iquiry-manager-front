# UIコンポーネント

アプリケーション全体で使用されるUIコンポーネントの詳細仕様です。

## 📋 機能一覧

### 1. レイアウトコンポーネント
- **ファイル**: `src/components/Header.tsx`, `src/components/AppSidebar.tsx`
- **機能**: アプリケーションの基本レイアウト
- **詳細**: [layout-components.md](./layout-components.md)

### 2. フォーム関連コンポーネント
- **ファイル**: `src/components/ui/` 配下の各種コンポーネント
- **機能**: フォーム要素のUIコンポーネント
- **詳細**: [form-components.md](./form-components.md)

### 3. アニメーションコンポーネント
- **ファイル**: `src/components/animations/` 配下
- **機能**: アニメーション効果の提供
- **詳細**: [animation-components.md](./animation-components.md)

### 4. ユーティリティコンポーネント
- **ファイル**: `src/components/LoadingSpinner.tsx`, `src/components/ToastNotification.tsx`
- **機能**: 共通で使用されるユーティリティコンポーネント
- **詳細**: [utility-components.md](./utility-components.md)

## 🎨 レスポンシブ対応

### ブレークポイント
- **sm**: 640px以上（タブレット）
- **md**: 768px以上（小型デスクトップ）
- **lg**: 1024px以上（デスクトップ）
- **xl**: 1280px以上（大型デスクトップ）

### レスポンシブパターン
1. **表示/非表示の切り替え**: `hidden sm:block`, `sm:hidden`
2. **レイアウトの変更**: `flex-col sm:flex-row`
3. **サイズの調整**: `text-sm sm:text-base`, `h-8 sm:h-10`
4. **スペーシングの調整**: `space-y-2 sm:space-y-4`

## 🔧 主要な実装詳細

### コンポーネント構成
```typescript
// 基本的なレスポンシブコンポーネントのパターン
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
  <div className="flex-1 min-w-0">
    <h1 className="text-lg sm:text-xl font-bold">タイトル</h1>
    <p className="text-sm sm:text-base text-gray-600">説明文</p>
  </div>
  <div className="w-full sm:w-auto">
    <Button className="w-full sm:w-auto">ボタン</Button>
  </div>
</div>
```

## ⚠️ リファクタリング時の注意点

1. **レスポンシブクラス**: 現在のTailwind CSSクラスを維持
2. **ブレークポイント**: 現在のブレークポイント設定を維持
3. **モバイルファースト**: モバイルファーストの設計思想を維持
4. **アクセシビリティ**: キーボード操作とスクリーンリーダー対応を維持

## 📁 関連ファイル

- `src/components/Header.tsx` - ヘッダーコンポーネント
- `src/components/AppSidebar.tsx` - サイドバーコンポーネント
- `src/components/ui/` - UIコンポーネント群
- `src/components/animations/` - アニメーションコンポーネント
- `src/components/LoadingSpinner.tsx` - ローディングコンポーネント
- `src/components/ToastNotification.tsx` - トースト通知コンポーネント

## 🔗 関連機能

- **レイアウト管理**: アプリケーション全体のレイアウト
- **ナビゲーション**: ページ間の遷移
- **ユーザーインタラクション**: ボタン、フォーム要素の操作
- **フィードバック**: ローディング、通知の表示
