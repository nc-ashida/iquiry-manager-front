# 現在のアーキテクチャ分析

## 概要

form-editorアプリケーションの現在のアーキテクチャを詳細に分析し、リファクタリングの対象となる問題点と改善機会を特定します。

## 📊 アーキテクチャ概要

### 技術スタック
- **フレームワーク**: Next.js 15.5.3 + React 19.1.0
- **スタイリング**: Tailwind CSS 4.0 + shadcn/ui
- **型システム**: TypeScript
- **状態管理**: useState, useEffect (分散型)
- **データ管理**: localStorage (直接アクセス)
- **ドラッグ&ドロップ**: @dnd-kit/core
- **アニメーション**: Framer Motion

### ディレクトリ構造
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # メインページ
│   ├── mail/              # メール管理
│   └── signatures/        # 署名管理
├── components/            # Reactコンポーネント
│   ├── ui/               # shadcn/uiコンポーネント
│   ├── animations/       # アニメーションコンポーネント
│   └── *.tsx            # 機能別コンポーネント
├── shared/               # 共有リソース
│   ├── types/           # 型定義
│   └── utils/           # ユーティリティ
├── data/                # 初期データ
└── hooks/               # カスタムフック
```

## 🔍 主要コンポーネント分析

### 1. FormEditor.tsx (1,416行)
**問題点:**
- 巨大なコンポーネント（単一責任原則違反）
- 複数の責務が混在（フォーム編集、フィールド管理、プレビュー、設定）
- 状態管理が複雑（複数のuseState）
- テストが困難

**責務:**
- フォームの作成・編集
- フィールドの追加・削除・編集
- ドラッグ&ドロップによる並び替え
- フォームプレビュー
- 設定管理
- バリデーション

### 2. FormList.tsx
**問題点:**
- フォーム一覧表示とフォーム生成ロジックが混在
- 検索・フィルタリング機能の重複実装

**責務:**
- フォーム一覧表示
- フォーム検索・フィルタリング
- フォーム作成・編集・削除
- 埋め込みコード生成

### 3. dataManager.ts
**問題点:**
- データアクセスとビジネスロジックが混在
- フォーム生成ロジックが巨大
- 型安全性の不足

**責務:**
- ローカルストレージの操作
- フォームデータのCRUD操作
- フォーム生成（HTML/CSS/JavaScript）
- バリデーションロジック

## 🚨 主要な問題点

### 1. アーキテクチャの問題

#### 巨大コンポーネント
```typescript
// FormEditor.tsx - 1,416行の巨大コンポーネント
export default function FormEditor({ form, onSave, onCancel }: FormEditorProps) {
  // 複数の責務が混在
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // ... 多数の状態管理
}
```

#### 状態管理の分散
```typescript
// 複数のコンポーネントで同様の状態管理が重複
const [forms, setForms] = useState<Form[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

#### データ層の混在
```typescript
// UIコンポーネント内で直接データアクセス
const handleSave = () => {
  const forms = loadData.forms();
  forms.push(newForm);
  saveData.forms(forms);
};
```

### 2. コードの重複

#### フォーム生成ロジックの重複
```typescript
// FormList.tsx と FormPreview.tsx で同様のロジックが重複
const generateEmbedCode = (form: Form) => {
  // 重複した実装
};
```

#### バリデーションロジックの重複
```typescript
// 複数の場所で同様のバリデーションが実装
const validateField = (field: FormField) => {
  // 重複した実装
};
```

#### エラーハンドリングの重複
```typescript
// 各コンポーネントで同様のエラーハンドリング
try {
  // 処理
} catch (error) {
  setError(error.message);
}
```

### 3. 型安全性の問題

#### any型の多用
```typescript
// 型安全性が不足
const handleChange = (value: any) => {
  // any型の使用
};
```

#### ランタイムエラーのリスク
```typescript
// 型チェックが不十分
const form = JSON.parse(localStorage.getItem('forms') || '[]');
// 型が保証されていない
```

### 4. パフォーマンスの問題

#### 不要な再レンダリング
```typescript
// メモ化が不十分
const FormList = ({ forms, onEdit, onDelete }) => {
  // 毎回再レンダリングされる
  return forms.map(form => <FormCard key={form.id} form={form} />);
};
```

#### バンドルサイズの問題
```typescript
// 動的インポートが未使用
import { FormEditor } from './FormEditor'; // 常に読み込まれる
```

## 📈 改善機会

### 1. コンポーネント分離
- **FormEditor** → FieldEditor, FormPreview, SettingsEditor
- **FormList** → FormList, FormSearch, FormActions
- **共通UI** → Button, Input, Modal等の抽出

### 2. 状態管理の統一
- **Zustand** による状態管理の一元化
- **Immer** による不変性管理
- **正規化** による状態の最適化

### 3. データレイヤーの分離
- **API層** の抽象化
- **ビジネスロジック** の分離
- **データ変換** の統一

### 4. バリデーションの統一
- **Zod** による型安全なバリデーション
- **React Hook Form** によるフォーム管理
- **共通バリデーション** の実装

### 5. エラーハンドリングの統一
- **エラー境界** の実装
- **共通エラーハンドリング** の実装
- **ユーザーフレンドリー** なエラー表示

## 🎯 リファクタリング優先度

### 高優先度
1. **FormEditorの分割** - 保守性の大幅向上
2. **状態管理の統一** - 予測可能性の向上
3. **型安全性の強化** - ランタイムエラーの削減

### 中優先度
4. **データレイヤーの分離** - テスタビリティの向上
5. **バリデーションの統一** - 一貫性の向上
6. **エラーハンドリングの統一** - UXの向上

### 低優先度
7. **パフォーマンス最適化** - ユーザー体験の向上
8. **テストカバレッジ** - 品質保証の向上
9. **ドキュメント整備** - 保守性の向上

## 📊 メトリクス

### 現在の状況
- **コンポーネント数**: 15個
- **最大コンポーネントサイズ**: 1,416行
- **型安全性**: 60% (any型の使用率)
- **テストカバレッジ**: 0%
- **バンドルサイズ**: 未測定

### 目標
- **コンポーネント数**: 30-40個 (適切な粒度)
- **最大コンポーネントサイズ**: 200行以下
- **型安全性**: 95%以上
- **テストカバレッジ**: 80%以上
- **バンドルサイズ**: 20%削減

## 🔄 移行戦略

### 段階的アプローチ
1. **基盤整備** - 型定義、ユーティリティ、テスト環境
2. **コンポーネント分離** - 巨大コンポーネントの分割
3. **状態管理統一** - Zustand + Immer導入
4. **データレイヤー分離** - API層の抽象化
5. **最適化** - パフォーマンス、バンドルサイズ

### リスク軽減
- **機能の完全性** - detailed-design/の仕様書による保護
- **段階的実装** - 既存機能を壊さない実装
- **テスト実装** - 各段階でのテストと検証
- **ロールバック準備** - 各段階でのロールバック計画

## 📚 参考資料

### 設計原則
- [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)
- [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

### 技術ドキュメント
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

### 既存ドキュメント
- [Design Guide](../../form-editor/docs/design-guide/) - デザイン改善ガイド
- [Detailed Design](../../form-editor/docs/detailed-design/) - 機能詳細仕様

---

**注意**: この分析は現在の実装に基づいており、リファクタリング中は機能の完全性を保つため、detailed-design/の仕様書を参照してください。
