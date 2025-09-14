# 問合せ管理機能

受信した問合せメールの管理・返信・送信履歴管理を行う機能です。

## 📋 機能一覧

### 1. 受信メール管理
- **ファイル**: `src/app/mail/inbox/page.tsx` (356行)
- **機能**: 受信メールの一覧表示・検索・フィルタリング
- **詳細**: [inbox-management.md](./inbox-management.md)

### 2. 送信メール管理
- **ファイル**: `src/app/mail/sent/page.tsx` (273行)
- **機能**: 送信メールの一覧表示・履歴管理
- **詳細**: [sent-mail-management.md](./sent-mail-management.md)

### 3. メール詳細・返信機能
- **ファイル**: `src/app/mail/inbox/[id]/page.tsx`
- **機能**: メール詳細表示・返信機能
- **詳細**: [mail-detail.md](./mail-detail.md)

### 4. 返信機能
- **ファイル**: `src/app/mail/inbox/[id]/page.tsx` (返信部分)
- **機能**: メール返信・送信
- **詳細**: [reply-functionality.md](./reply-functionality.md)

## 🔧 主要な実装詳細

### システム分類
- **HP問合せシステム**: ホームページからの問合せ
- **エミダスシステム**: エミダスシステムからの問合せ

### メールデータ構造
```typescript
interface InboxMessage {
  id: number;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  receivedAt: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface SentMessage {
  id: number;
  to: string;
  toEmail: string;
  subject: string;
  preview: string;
  sentAt: string;
  status: 'delivered' | 'pending' | 'failed';
  priority: 'high' | 'medium' | 'low';
  originalMessageId: string;
}
```

## 🎯 主要機能

### 1. 受信メール管理
- **一覧表示**: カード形式でのメール一覧
- **検索機能**: メール内容の検索
- **フィルタリング**: 未読、優先度、期間での絞り込み
- **タブ機能**: HP問合せ・エミダスシステムの切り替え
- **未読管理**: 未読メールのハイライト表示

### 2. 送信メール管理
- **送信履歴**: 送信済みメールの一覧
- **配信状況**: 配信済み・配信中・配信失敗の表示
- **元メール参照**: 返信元メールの参照
- **統計表示**: 配信済み件数の表示

### 3. メール詳細・返信
- **詳細表示**: メール内容の詳細表示
- **返信機能**: インライン返信フォーム
- **削除機能**: メールの削除
- **ナビゲーション**: 受信箱への戻り

## 🔄 状態管理

### 受信メール状態
```typescript
// サンプルデータ（実際はAPIから取得）
const hpInboxMessages = [...];
const emidasInboxMessages = [...];
```

### メール詳細状態
```typescript
const [isReplying, setIsReplying] = useState(false);
const [replyContent, setReplyContent] = useState('');
```

## 🎨 UI要素

### 受信メールカード
```typescript
<Card className={`group hover:shadow-md transition-all duration-200 cursor-pointer ${!message.isRead ? 'border-l-4 border-l-blue-500' : ''} rounded-l-none`}>
  <CardContent className="p-3 md:p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0" onClick={() => router.push(`/mail/inbox/${message.id}`)}>
        {/* 送信者情報 */}
        <div className="flex items-center space-x-2 min-w-0">
          <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-900 truncate">
            {message.from}
          </span>
        </div>
        {/* 優先度・カテゴリバッジ */}
        <div className="flex items-center space-x-1 flex-wrap">
          <Badge variant={getPriorityColor(message.priority)} className="text-xs">
            {getPriorityLabel(message.priority)}
          </Badge>
          <Badge variant={getCategoryColor(message.category)} className="text-xs">
            {getCategoryLabel(message.category)}
          </Badge>
        </div>
        {/* 件名・プレビュー */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
          {message.subject}
        </h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {message.preview}
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

### 返信フォーム
```typescript
{isReplying && (
  <div className="mb-6 p-4 bg-gray-50 rounded-lg border animate-in slide-in-from-top-2 duration-200">
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
        <Reply className="h-4 w-4 mr-2" />
        返信
      </h4>
      <div className="text-xs text-gray-600 space-y-1">
        <div>宛先: {message.fromEmail}</div>
        <div>件名: Re: {message.subject}</div>
      </div>
    </div>
    <div className="mb-4">
      <Textarea
        ref={replyTextareaRef}
        placeholder="返信内容を入力してください..."
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        className="min-h-[120px]"
      />
    </div>
    <div className="flex items-center justify-end">
      <Button
        size="sm"
        onClick={handleReply}
        disabled={!replyContent.trim()}
        className="hover:bg-blue-600 transition-colors"
      >
        <Send className="h-4 w-4 mr-2" />
        送信
      </Button>
    </div>
  </div>
)}
```

## ⚠️ リファクタリング時の注意点

1. **データ構造**: 現在のメールデータ構造を維持
2. **システム分類**: HP問合せ・エミダスシステムの分類を維持
3. **UI/UX**: 現在のカード形式UIを維持
4. **検索・フィルタ**: 現在の検索・フィルタ機能を維持
5. **返信機能**: インライン返信フォームの機能を維持

## 📁 関連ファイル

- `src/app/mail/inbox/page.tsx` - 受信メール一覧
- `src/app/mail/sent/page.tsx` - 送信メール一覧
- `src/app/mail/inbox/[id]/page.tsx` - メール詳細・返信
- `src/components/Header.tsx` - ヘッダーナビゲーション

## 🔗 関連機能

- **フォーム管理**: フォームからの問合せ受信
- **署名管理**: 返信時の署名使用
- **データ管理**: メールデータの永続化
- **通知機能**: 新着メールの通知

## 📝 テストケース

### 正常系
1. 受信メール一覧の表示
2. メール詳細の表示
3. 返信機能
4. メール削除
5. 検索・フィルタ機能
6. タブ切り替え

### 異常系
1. メールが見つからない場合
2. 返信送信の失敗
3. ネットワークエラー
4. データの不整合

## 🚀 改善提案

1. **リアルタイム更新**: WebSocket等でのリアルタイム更新
2. **一括操作**: 複数メールの一括操作
3. **メールテンプレート**: 返信テンプレート機能
4. **添付ファイル**: メール添付ファイルの対応
5. **メール分類**: 自動分類機能
6. **統計機能**: メール処理統計の表示
