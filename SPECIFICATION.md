# 問合せフォーム管理システム 仕様書

## システム概要

本システムは、ユーザーが問合せフォームを作成・管理し、そのフォームからの問合せを処理するためのWebアプリケーションです。3つの主要なアプリケーションで構成されています。

## アプリケーション構成

### 1. form-editor（フォームエディタ）
問合せフォームの作成・編集・管理を行うアプリケーション

#### 主要機能
- **フォーム管理**
  - フォーム一覧表示・検索・フィルタリング
  - フォームの作成・編集・削除・複製
  - フォーム名称・説明の設定
  - 項目の並び替え（ドラッグ&ドロップ）
  - フォームのプレビュー機能

- **入力項目の設定**
  - 項目種別：text, textarea, select, radio, checkbox, file
  - 項目名・ラベル・プレースホルダーの設定
  - バリデーション設定：
    - 必須入力
    - 電話番号形式
    - メールアドレス形式
    - 数値形式
    - 文字数制限（最大・最小・範囲）
  - 選択肢の設定（radio, select, checkbox用）
  - 「その他」オプションの追加
  - 複数選択の許可（select用）

- **スタイル設定**
  - CSS編集画面（名前空間ベース）
  - リアルタイムプレビュー
  - プリセットテーマの選択
  - カスタムスタイルの適用

- **送信設定**
  - 完了ページURLの設定
  - 送信控えメールの設定
  - 署名の選択（事前登録済み署名から選択）
  - ファイルアップロード設定
  - 複数回送信の許可設定
  - 進捗表示の設定
  - 送信完了メッセージのカスタマイズ
  - 通知先メールアドレスの設定
  - 許可ドメインの設定

- **署名管理**
  - メール署名の作成・編集・削除
  - デフォルト署名の設定
  - 署名の一覧表示・管理

- **メール管理**
  - 受信メールの一覧・詳細表示
  - 送信メールの一覧・詳細表示
  - メールの返信・転送・削除
  - ステータス管理（未読・既読）
  - 優先度・カテゴリの設定
  - 検索・フィルタリング機能

- **JavaScript生成**
  - フォーム用JavaScriptコードの生成
  - 任意のサイトに埋め込み可能な形式
  - バリデーション機能付き
  - ファイルアップロード対応

### 2. mailbox（メールボックス）
作成されたフォームからの問合せを管理するアプリケーション

#### 主要機能
- **問合せ一覧**
  - フォーム別・日付別・ステータス別の表示
  - 検索・フィルタリング機能
  - ページネーション

- **問合せ詳細**
  - 送信者情報の表示
  - フォーム項目の回答内容表示
  - 送信日時の表示

- **返信機能**
  - メール返信機能
  - 返信履歴の管理
  - テンプレート機能

- **ステータス管理**
  - 未読・既読・対応中・完了等のステータス管理
  - 担当者割り当て

### 3. sample-viewer（サンプルビューア）
作成されたフォームの動作確認を行うアプリケーション

#### 主要機能
- **フォーム表示**
  - 生成されたJavaScriptコードの貼り付け
  - フォームの表示・動作確認
  - バリデーション動作の確認

- **送信テスト**
  - テストデータでの送信確認
  - 送信結果の表示
  - エラーハンドリングの確認

## 技術仕様

### フロントエンド
- **フレームワーク**: Next.js 15.5.3 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **UIコンポーネント**: Radix UI + shadcn/ui
- **状態管理**: Zustand
- **フォーム管理**: React Hook Form + Zod
- **アニメーション**: Framer Motion
- **ドラッグ&ドロップ**: @dnd-kit
- **アイコン**: Lucide React

### データ管理
- **データベース**: JSONファイルベース
- **ファイル構成**:
  - `data/forms.json` - フォーム定義データ
  - `data/inquiries.json` - 問合せデータ
  - `data/signatures.json` - 署名データ
  - `data/settings.json` - システム設定

### ディレクトリ構成
```
inquiry-relation/
├── form-editor/          # フォームエディタアプリ
├── mailbox/              # メールボックスアプリ
├── sample-viewer/        # サンプルビューアアプリ
├── shared/               # 共通コンポーネント・型定義
├── data/                 # JSONデータファイル
└── SPECIFICATION.md      # 本仕様書
```

## データ構造

### フォーム定義 (forms.json)
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "fields": [
    {
      "id": "string",
      "type": "text|textarea|select|radio|checkbox|file",
      "label": "string",
      "placeholder": "string",
      "required": "boolean",
      "validation": {
        "type": "email|phone|number|text",
        "minLength": "number",
        "maxLength": "number",
        "pattern": "string",
        "required": "boolean"
      },
      "options": ["string"], // select, radio, checkbox用
      "order": "number",
      "allowOther": "boolean", // 「その他」オプション
      "multiple": "boolean" // 複数選択（select用）
    }
  ],
  "styling": {
    "css": "string",
    "theme": "string"
  },
  "settings": {
    "completionUrl": "string",
    "signatureId": "string",
    "autoReply": "boolean",
    "fileUpload": {
      "enabled": "boolean",
      "maxFiles": "number",
      "maxFileSize": "number",
      "allowedTypes": ["string"]
    },
    "allowMultipleSubmissions": "boolean",
    "showProgress": "boolean",
    "successMessage": "string",
    "notificationEmail": "string",
    "showFieldNumbers": "boolean",
    "requireAllFields": "boolean",
    "allowedDomains": ["string"]
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

### 問合せデータ (inquiries.json)
```json
{
  "id": "string",
  "formId": "string",
  "responses": {
    "fieldId": "string|string[]"
  },
  "senderInfo": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "status": "unread|read|in-progress|completed",
  "assignedTo": "string",
  "replies": [
    {
      "id": "string",
      "content": "string",
      "sentAt": "string",
      "sentBy": "string"
    }
  ],
  "submittedAt": "string"
}
```

### 署名データ (signatures.json)
```json
{
  "id": "string",
  "name": "string",
  "content": "string",
  "isDefault": "boolean",
  "createdAt": "string"
}
```

## 実装方針

### モック実装
- データベースの代わりにJSONファイルを使用
- ローカルストレージを活用したデータ永続化
- リアルタイム更新は実装せず、ページリロードでデータ反映

### UI/UX
- モダンで直感的なインターフェース
- レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- アクセシビリティ対応
- ハンバーガーメニューによるモバイルナビゲーション
- アニメーション効果（FadeIn、StaggerContainer）
- ドラッグ&ドロップによる直感的な操作

### セキュリティ
- クライアントサイドバリデーション
- XSS対策
- CSRF対策（将来の実装時）

## 開発フェーズ

### Phase 1: 基本構造とフォームエディタ ✅
- プロジェクト初期化
- 共通コンポーネント作成
- フォームエディタの基本機能
- レスポンシブデザイン実装
- ハンバーガーメニュー実装

### Phase 2: メールボックス機能 ✅
- 問合せ一覧・詳細表示
- 基本的な返信機能
- 受信・送信メール管理
- 署名管理機能

### Phase 3: サンプルビューアと統合
- JavaScript生成機能
- サンプルビューア実装
- 全体統合テスト

## 今後の拡張予定

- リアルタイム通信（WebSocket）
- データベース連携
- 認証・認可機能
- API連携
- 多言語対応
- テンプレート機能の拡張
