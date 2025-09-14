# 受信メール管理機能

受信した問合せメールの一覧表示・検索・フィルタリング・管理を行う機能です。

## 📋 機能概要

HP問合せシステムとエミダスシステムからの受信メールを管理し、効率的な問合せ対応を支援します。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/app/mail/inbox/page.tsx` (356行)
- **詳細ページ**: `src/app/mail/inbox/[id]/page.tsx`

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
```

## 🎯 主要機能

### 1. 受信メール一覧表示
```typescript
// メールリストコンポーネント
const MailList = ({ messages, systemType }: { messages: typeof hpInboxMessages, systemType: string }) => (
  <div className="space-y-3 md:space-y-4">
    {messages.length === 0 ? (
      <Card>
        <CardContent className="text-center py-6 md:py-8">
          <Mail className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
          <h3 className="text-sm font-semibold text-gray-900 mb-2">メールがありません</h3>
          <p className="text-xs text-gray-600">
            {systemType === 'hp' ? 'HP問合せシステム' : 'エミダスシステム'}からのメールはありません。
          </p>
        </CardContent>
      </Card>
    ) : (
      messages.map((message) => (
        <Card key={message.id} className={`group hover:shadow-md transition-all duration-200 cursor-pointer ${!message.isRead ? 'border-l-4 border-l-blue-500' : ''} rounded-l-none`}>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0" onClick={() => router.push(`/mail/inbox/${message.id}`)}>
                {/* メール内容 */}
              </div>
            </div>
          </CardContent>
        </Card>
      ))
    )}
  </div>
);
```

### 2. メールカード表示
```typescript
<Card key={message.id} className={`group hover:shadow-md transition-all duration-200 cursor-pointer ${!message.isRead ? 'border-l-4 border-l-blue-500' : ''} rounded-l-none`}>
  <CardContent className="p-3 md:p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0" onClick={() => router.push(`/mail/inbox/${message.id}`)}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 space-y-1 sm:space-y-0">
          <div className="flex items-center space-x-2 min-w-0">
            <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-900 truncate">
              {message.from}
            </span>
            <span className="text-xs text-gray-500 truncate hidden sm:inline">
              ({message.fromEmail})
            </span>
          </div>
          <div className="flex items-center space-x-1 flex-wrap">
            <Badge variant={getPriorityColor(message.priority)} className="text-xs">
              {getPriorityLabel(message.priority)}
            </Badge>
            <Badge variant={getCategoryColor(message.category)} className="text-xs">
              {getCategoryLabel(message.category)}
            </Badge>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
          {message.subject}
        </h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {message.preview}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{message.receivedAt}</span>
          </div>
          {!message.isRead && (
            <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 w-fit">
              未読
            </Badge>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="font-medium"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/mail/inbox/${message.id}`);
            }}
          >
            返信
          </DropdownMenuItem>
          <DropdownMenuItem>アーカイブ</DropdownMenuItem>
          <DropdownMenuItem>転送</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">削除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </CardContent>
</Card>
```

### 3. 検索機能
```typescript
{/* 検索・フィルターセクション */}
<div className="flex flex-col sm:flex-row gap-3 md:gap-4">
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    <Input
      placeholder="メールを検索..."
      className="pl-10 h-9 md:h-10"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
  <div className="flex items-center space-x-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-colors h-9 md:h-10">
          <Filter className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">フィルター</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setFilter('unread')}>未読のみ</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('high')}>優先度: 高</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('today')}>今日</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('week')}>今週</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>
```

### 4. タブ機能
```typescript
{/* タブ機能 */}
<Tabs defaultValue="hp" className="w-full">
  <TabsList className="w-full grid grid-cols-2">
    <TabsTrigger
      value="hp"
      className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-200 transition-colors text-xs sm:text-sm"
    >
      <span className="hidden sm:inline">HP問合せシステム</span>
      <span className="sm:hidden">HP問合せ</span>
      <span className="ml-1">({hpInboxMessages.length})</span>
    </TabsTrigger>
    <TabsTrigger
      value="emidas"
      className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-200 transition-colors text-xs sm:text-sm"
    >
      <span className="hidden sm:inline">エミダスシステム</span>
      <span className="sm:hidden">エミダス</span>
      <span className="ml-1">({emidasInboxMessages.length})</span>
    </TabsTrigger>
  </TabsList>
  <TabsContent value="hp" className="mt-4 md:mt-6">
    <MailList messages={hpInboxMessages} systemType="hp" />
  </TabsContent>
  <TabsContent value="emidas" className="mt-4 md:mt-6">
    <MailList messages={emidasInboxMessages} systemType="emidas" />
  </TabsContent>
</Tabs>
```

## 🎨 レスポンシブ対応

### 1. メールカードのレスポンシブレイアウト
```typescript
<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 space-y-1 sm:space-y-0">
  <div className="flex items-center space-x-2 min-w-0">
    <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
    <span className="text-sm font-medium text-gray-900 truncate">
      {message.from}
    </span>
    <span className="text-xs text-gray-500 truncate hidden sm:inline">
      ({message.fromEmail})
    </span>
  </div>
  <div className="flex items-center space-x-1 flex-wrap">
    <Badge variant={getPriorityColor(message.priority)} className="text-xs">
      {getPriorityLabel(message.priority)}
    </Badge>
    <Badge variant={getCategoryColor(message.category)} className="text-xs">
      {getCategoryLabel(message.category)}
    </Badge>
  </div>
</div>
```

### 2. 検索・フィルターのレスポンシブ対応
```typescript
<div className="flex flex-col sm:flex-row gap-3 md:gap-4">
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    <Input
      placeholder="メールを検索..."
      className="pl-10 h-9 md:h-10"
    />
  </div>
  <div className="flex items-center space-x-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-colors h-9 md:h-10">
          <Filter className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">フィルター</span>
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  </div>
</div>
```

### 3. タブのレスポンシブ対応
```typescript
<TabsTrigger
  value="hp"
  className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-200 transition-colors text-xs sm:text-sm"
>
  <span className="hidden sm:inline">HP問合せシステム</span>
  <span className="sm:hidden">HP問合せ</span>
  <span className="ml-1">({hpInboxMessages.length})</span>
</TabsTrigger>
```

## 🔄 状態管理

### ローカル状態
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [filter, setFilter] = useState<string | null>(null);
const [activeTab, setActiveTab] = useState('hp');
```

### フィルタリング処理
```typescript
// フィルタリング処理
const filteredMessages = useMemo(() => {
  let filtered = activeTab === 'hp' ? hpInboxMessages : emidasInboxMessages;
  
  // 検索クエリでフィルタリング
  if (searchQuery.trim()) {
    filtered = filtered.filter(message =>
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // フィルターでフィルタリング
  if (filter) {
    switch (filter) {
      case 'unread':
        filtered = filtered.filter(message => !message.isRead);
        break;
      case 'high':
        filtered = filtered.filter(message => message.priority === 'high');
        break;
      case 'today':
        const today = new Date().toDateString();
        filtered = filtered.filter(message => 
          new Date(message.receivedAt).toDateString() === today
        );
        break;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(message => 
          new Date(message.receivedAt) >= weekAgo
        );
        break;
    }
  }
  
  return filtered;
}, [activeTab, searchQuery, filter]);
```

## 🎨 優先度・カテゴリの表示

### 優先度の色分け
```typescript
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'secondary';
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'high': return '高';
    case 'medium': return '中';
    case 'low': return '低';
    default: return '低';
  }
};
```

### カテゴリの色分け
```typescript
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'inquiry': return 'default';
    case 'request': return 'secondary';
    case 'consultation': return 'outline';
    case 'error': return 'destructive';
    case 'customization': return 'default';
    case 'migration': return 'outline';
    case 'incident': return 'destructive';
    default: return 'secondary';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'inquiry': return 'お問い合わせ';
    case 'request': return '修正依頼';
    case 'consultation': return 'ご相談';
    case 'error': return 'エラー報告';
    case 'customization': return 'カスタマイズ';
    case 'migration': return 'データ移行';
    case 'incident': return '障害報告';
    default: return 'その他';
  }
};
```

## ⚠️ リファクタリング時の注意点

1. **メールデータ構造**: 現在のメールデータ構造を維持
2. **タブ機能**: HP問合せ・エミダスシステムの分類を維持
3. **検索・フィルタ**: 現在の検索・フィルタ機能を維持
4. **レスポンシブ対応**: 現在のレスポンシブ対応を維持
5. **優先度・カテゴリ**: 現在の優先度・カテゴリ表示を維持

## 📁 関連ファイル

- `src/app/mail/inbox/page.tsx` - 受信メール一覧
- `src/app/mail/inbox/[id]/page.tsx` - メール詳細
- `src/components/Header.tsx` - ヘッダーナビゲーション

## 🔗 関連機能

- **メール詳細**: メール詳細表示・返信機能
- **送信メール管理**: 送信メールの管理
- **署名管理**: 返信時の署名使用
- **検索・フィルタ**: メールの検索・フィルタリング

## 📝 テストケース

### 正常系
1. 受信メール一覧の表示
2. タブ切り替え
3. 検索機能
4. フィルタリング機能
5. メールカードの表示
6. レスポンシブ表示

### 異常系
1. メールデータの読み込み失敗
2. 検索結果なし
3. フィルタ結果なし
4. ネットワークエラー

## 🚀 改善提案

1. **リアルタイム更新**: WebSocket等でのリアルタイム更新
2. **一括操作**: 複数メールの一括操作
3. **メール分類**: 自動分類機能
4. **統計機能**: メール処理統計の表示
5. **エクスポート機能**: メールデータのエクスポート
6. **アーカイブ機能**: メールのアーカイブ機能
