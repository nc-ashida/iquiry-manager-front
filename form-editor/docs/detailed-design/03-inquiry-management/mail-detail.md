# メール詳細・返信機能

受信メールの詳細表示と返信機能です。

## 📋 機能概要

受信メールの詳細内容を表示し、返信機能を提供します。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/app/mail/inbox/[id]/page.tsx`

### メール詳細データ構造
```typescript
interface MailDetail {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  content: string;
  receivedAt: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
}
```

## 🎯 主要機能

### 1. メール詳細表示
```typescript
{/* メール詳細 */}
<Card className="rounded-l-none">
  <CardHeader className="pb-4">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3 flex-1 min-w-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 flex-shrink-0">
          <User className="h-6 w-6 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <CardTitle className="text-base font-semibold text-gray-900">
              {message.from}
            </CardTitle>
            {!message.isRead && (
              <Badge variant="default" className="text-xs bg-black text-white">
                未読
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-1">{message.fromEmail}</p>
          <div className="flex items-center space-x-2">
            <Badge variant={getCategoryColor(message.category)} className="text-xs">
              {getCategoryLabel(message.category)}
            </Badge>
            <Badge variant={getPriorityColor(message.priority)} className="text-xs">
              {getPriorityLabel(message.priority)}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center text-xs text-gray-500 flex-shrink-0">
        <Clock className="mr-1 h-3 w-3" />
        {message.receivedAt}
      </div>
    </div>
  </CardHeader>
  <CardContent className="pt-0">
    <div className="prose prose-sm max-w-none">
      <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
        {message.content}
      </div>
    </div>
  </CardContent>
</Card>
```

### 2. 返信フォーム
```typescript
{/* 返信フォーム */}
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

### 3. 返信処理
```typescript
const handleReply = () => {
  if (replyContent.trim()) {
    // 返信処理（実際の実装ではAPIを呼び出す）
    console.log('返信送信:', {
      to: message.fromEmail,
      subject: `Re: ${message.subject}`,
      content: replyContent,
      originalMessageId: message.id
    });

    // 送信完了の通知（実際の実装ではトースト通知など）
    alert('返信を送信しました。');

    // 送信完了後、送信ページにリダイレクト
    router.push('/mail/sent');
  }
};
```

### 4. 削除処理
```typescript
const handleDelete = () => {
  // 削除処理（実際の実装ではAPIを呼び出す）
  console.log('メール削除:', message.id);

  // 削除完了の通知（実際の実装ではトースト通知など）
  alert('メールを削除しました。');

  // 削除完了後、受信箱にリダイレクト
  router.push('/mail/inbox');
};
```

## 🎨 メール詳細のUI要素

### ヘッダーセクション
```typescript
{/* ヘッダーセクション */}
<div className="flex items-center justify-between">
  <div className="flex items-center space-x-3">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push('/mail/inbox')}
      className="p-2"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
    <div>
      <h1 className="text-xl font-bold text-gray-900">{message.subject}</h1>
      <p className="text-sm text-gray-600">メール詳細</p>
    </div>
  </div>
  <div className="flex items-center space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsReplying(!isReplying)}
      className={`transition-colors ${isReplying ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-50"}`}
    >
      <Reply className="h-4 w-4 mr-2" />
      {isReplying ? "返信をキャンセル" : "返信"}
    </Button>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          削除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border border-gray-200 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>メールを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消すことができません。メールが完全に削除されます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-gray-100 transition-colors">キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</div>
```

### メール情報表示
```typescript
{/* メール情報表示 */}
<div className="flex items-start space-x-3 flex-1 min-w-0">
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 flex-shrink-0">
    <User className="h-6 w-6 text-gray-600" />
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center space-x-2 mb-2">
      <CardTitle className="text-base font-semibold text-gray-900">
        {message.from}
      </CardTitle>
      {!message.isRead && (
        <Badge variant="default" className="text-xs bg-black text-white">
          未読
        </Badge>
      )}
    </div>
    <p className="text-xs text-gray-500 mb-1">{message.fromEmail}</p>
    <div className="flex items-center space-x-2">
      <Badge variant={getCategoryColor(message.category)} className="text-xs">
        {getCategoryLabel(message.category)}
      </Badge>
      <Badge variant={getPriorityColor(message.priority)} className="text-xs">
        {getPriorityLabel(message.priority)}
      </Badge>
    </div>
  </div>
</div>
```

### メール内容表示
```typescript
{/* メール内容表示 */}
<div className="prose prose-sm max-w-none">
  <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
    {message.content}
  </div>
</div>
```

## 🔄 状態管理

### ローカル状態
```typescript
const [isReplying, setIsReplying] = useState(false);
const [replyContent, setReplyContent] = useState('');
const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
```

### フォーカス管理
```typescript
// 返信フォームが表示されたときにテキストエリアにフォーカス
useEffect(() => {
  if (isReplying && replyTextareaRef.current) {
    // 少し遅延させてフォーカスを設定（DOM更新を待つ）
    setTimeout(() => {
      replyTextareaRef.current?.focus();
    }, 100);
  }
}, [isReplying]);
```

## 🎨 レスポンシブ対応

### ヘッダーのレスポンシブ対応
```typescript
<div className="flex items-center justify-between">
  <div className="flex items-center space-x-3">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push('/mail/inbox')}
      className="p-2"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
    <div>
      <h1 className="text-xl font-bold text-gray-900">{message.subject}</h1>
      <p className="text-sm text-gray-600">メール詳細</p>
    </div>
  </div>
  <div className="flex items-center space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsReplying(!isReplying)}
      className={`transition-colors ${isReplying ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-50"}`}
    >
      <Reply className="h-4 w-4 mr-2" />
      {isReplying ? "返信をキャンセル" : "返信"}
    </Button>
    {/* 削除ボタン */}
  </div>
</div>
```

### 返信フォームのレスポンシブ対応
```typescript
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
```

## 🔄 エラーハンドリング

### メールが見つからない場合
```typescript
if (!message) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header currentPage="inbox" />
        <div className="flex-1 flex items-center justify-center p-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                <Mail className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">メールが見つかりません</h3>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                指定されたメールが見つかりませんでした。
              </p>
              <Button
                onClick={() => router.push('/mail/inbox')}
                className="mt-4"
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                受信箱に戻る
              </Button>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### 返信エラーハンドリング
```typescript
const handleReply = async () => {
  if (!replyContent.trim()) {
    alert('返信内容を入力してください。');
    return;
  }

  try {
    // 返信処理（実際の実装ではAPIを呼び出す）
    const response = await fetch('/api/replies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: message.fromEmail,
        subject: `Re: ${message.subject}`,
        content: replyContent,
        originalMessageId: message.id
      })
    });

    if (response.ok) {
      alert('返信を送信しました。');
      router.push('/mail/sent');
    } else {
      throw new Error('返信の送信に失敗しました。');
    }
  } catch (error) {
    console.error('返信エラー:', error);
    alert('返信の送信に失敗しました。');
  }
};
```

## ⚠️ リファクタリング時の注意点

1. **メール詳細表示**: 現在のメール詳細表示を維持
2. **返信機能**: 現在の返信機能を維持
3. **削除機能**: 現在の削除機能を維持
4. **レスポンシブ対応**: 現在のレスポンシブ対応を維持
5. **エラーハンドリング**: 現在のエラーハンドリングを維持

## 📁 関連ファイル

- `src/app/mail/inbox/[id]/page.tsx` - メール詳細・返信機能
- `src/app/mail/inbox/page.tsx` - 受信メール一覧
- `src/app/mail/sent/page.tsx` - 送信メール一覧

## 🔗 関連機能

- **受信メール管理**: 受信メール一覧からの遷移
- **送信メール管理**: 返信後の送信履歴表示
- **署名管理**: 返信時の署名使用
- **ナビゲーション**: メール一覧への戻り

## 📝 テストケース

### 正常系
1. メール詳細の表示
2. 返信機能
3. 削除機能
4. ナビゲーション
5. レスポンシブ表示

### 異常系
1. メールが見つからない場合
2. 返信送信の失敗
3. 削除の失敗
4. ネットワークエラー

## 🚀 改善提案

1. **返信テンプレート**: よく使われる返信テンプレート
2. **返信履歴**: 返信履歴の表示
3. **添付ファイル**: 返信時の添付ファイル機能
4. **返信スケジュール**: 返信のスケジュール機能
5. **返信統計**: 返信統計の表示
6. **返信の最適化**: 返信機能の最適化
