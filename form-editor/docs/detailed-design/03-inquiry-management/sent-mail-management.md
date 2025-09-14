# 送信メール管理機能

送信したメールの履歴管理・表示・統計を行う機能です。

## 📋 機能概要

HP問合せシステムとエミダスシステムへの送信メールを管理し、送信履歴の確認と統計情報の表示を行います。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/app/mail/sent/page.tsx` (273行)

### 送信メールデータ構造
```typescript
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

### 1. 送信メール一覧表示
```typescript
// 送信メールリストコンポーネント
const SentMailList = ({ messages, systemType }: { messages: typeof hpSentMessages, systemType: string }) => (
  <div className="space-y-3 md:space-y-4">
    {messages.length === 0 ? (
      <Card>
        <CardContent className="text-center py-6 md:py-8">
          <Send className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
          <h3 className="text-sm font-semibold text-gray-900 mb-2">送信メールがありません</h3>
          <p className="text-xs text-gray-600">
            {systemType === 'hp' ? 'HP問合せシステム' : 'エミダスシステム'}からの返信はありません。
          </p>
        </CardContent>
      </Card>
    ) : (
      messages.map((message) => (
        <Card key={message.id} className="group hover:shadow-md transition-all duration-200 cursor-pointer rounded-l-none">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
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

### 2. 送信メールカード表示
```typescript
<Card key={message.id} className="group hover:shadow-md transition-all duration-200 cursor-pointer rounded-l-none">
  <CardContent className="p-3 md:p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 space-y-1 sm:space-y-0">
          <div className="flex items-center space-x-2 min-w-0">
            <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-900 truncate">
              {message.to}
            </span>
            <span className="text-xs text-gray-500 truncate hidden sm:inline">
              ({message.toEmail})
            </span>
          </div>
          <div className="flex items-center space-x-1 flex-wrap">
            <Badge variant={getPriorityColor(message.priority)} className="text-xs">
              {getPriorityLabel(message.priority)}
            </Badge>
            <Badge variant={getStatusColor(message.status)} className="text-xs">
              {getStatusLabel(message.status)}
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
            <Clock className="mr-1 h-3 w-3" />
            <span>{message.sentAt}</span>
          </div>
          {message.status === 'delivered' && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              <span>配信済み</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

### 3. 送信統計表示
```typescript
{/* ヘッダーセクション */}
<div className="flex flex-col space-y-4">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
    <div className="flex items-center space-x-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
        <Send className="h-5 w-5 text-white" />
      </div>
      <div>
        <h1 className="text-lg md:text-xl font-bold text-gray-900">送信メール</h1>
        <p className="text-xs md:text-sm text-gray-600">
          HP問合せ: {hpSentMessages.length}件 / エミダス: {emidasSentMessages.length}件
        </p>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <Badge variant="outline" className="text-xs w-fit">
        HP問合せ: {hpSentMessages.filter(msg => msg.status === 'delivered').length}件配信済み
      </Badge>
      <Badge variant="secondary" className="text-xs w-fit">
        エミダス: {emidasSentMessages.filter(msg => msg.status === 'delivered').length}件配信済み
      </Badge>
    </div>
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
      <span className="ml-1">({hpSentMessages.length})</span>
    </TabsTrigger>
    <TabsTrigger
      value="emidas"
      className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-200 transition-colors text-xs sm:text-sm"
    >
      <span className="hidden sm:inline">エミダスシステム</span>
      <span className="sm:hidden">エミダス</span>
      <span className="ml-1">({emidasSentMessages.length})</span>
    </TabsTrigger>
  </TabsList>
  <TabsContent value="hp" className="mt-4 md:mt-6">
    <SentMailList messages={hpSentMessages} systemType="hp" />
  </TabsContent>
  <TabsContent value="emidas" className="mt-4 md:mt-6">
    <SentMailList messages={emidasSentMessages} systemType="emidas" />
  </TabsContent>
</Tabs>
```

## 🎨 送信ステータスの表示

### ステータスの色分け
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'default';
    case 'pending': return 'secondary';
    case 'failed': return 'destructive';
    default: return 'secondary';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'delivered': return '配信済み';
    case 'pending': return '配信中';
    case 'failed': return '配信失敗';
    default: return '不明';
  }
};
```

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

### 配信済みアイコン
```typescript
{message.status === 'delivered' && (
  <div className="flex items-center space-x-1 text-green-600">
    <CheckCircle className="h-3 w-3" />
    <span>配信済み</span>
  </div>
)}
```

## 🎨 レスポンシブ対応

### 1. 送信メールカードのレスポンシブレイアウト
```typescript
<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 space-y-1 sm:space-y-0">
  <div className="flex items-center space-x-2 min-w-0">
    <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
    <span className="text-sm font-medium text-gray-900 truncate">
      {message.to}
    </span>
    <span className="text-xs text-gray-500 truncate hidden sm:inline">
      ({message.toEmail})
    </span>
  </div>
  <div className="flex items-center space-x-1 flex-wrap">
    <Badge variant={getPriorityColor(message.priority)} className="text-xs">
      {getPriorityLabel(message.priority)}
    </Badge>
    <Badge variant={getStatusColor(message.status)} className="text-xs">
      {getStatusLabel(message.status)}
    </Badge>
  </div>
</div>
```

### 2. 統計表示のレスポンシブ対応
```typescript
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
  <div className="flex items-center space-x-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
      <Send className="h-5 w-5 text-white" />
    </div>
    <div>
      <h1 className="text-lg md:text-xl font-bold text-gray-900">送信メール</h1>
      <p className="text-xs md:text-sm text-gray-600">
        HP問合せ: {hpSentMessages.length}件 / エミダス: {emidasSentMessages.length}件
      </p>
    </div>
  </div>
  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
    <Badge variant="outline" className="text-xs w-fit">
      HP問合せ: {hpSentMessages.filter(msg => msg.status === 'delivered').length}件配信済み
    </Badge>
    <Badge variant="secondary" className="text-xs w-fit">
      エミダス: {emidasSentMessages.filter(msg => msg.status === 'delivered').length}件配信済み
    </Badge>
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
  <span className="ml-1">({hpSentMessages.length})</span>
</TabsTrigger>
```

## 🔄 状態管理

### ローカル状態
```typescript
const [activeTab, setActiveTab] = useState('hp');
const [searchQuery, setSearchQuery] = useState('');
const [filter, setFilter] = useState<string | null>(null);
```

### フィルタリング処理
```typescript
// フィルタリング処理
const filteredMessages = useMemo(() => {
  let filtered = activeTab === 'hp' ? hpSentMessages : emidasSentMessages;
  
  // 検索クエリでフィルタリング
  if (searchQuery.trim()) {
    filtered = filtered.filter(message =>
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // フィルターでフィルタリング
  if (filter) {
    switch (filter) {
      case 'delivered':
        filtered = filtered.filter(message => message.status === 'delivered');
        break;
      case 'pending':
        filtered = filtered.filter(message => message.status === 'pending');
        break;
      case 'failed':
        filtered = filtered.filter(message => message.status === 'failed');
        break;
      case 'high':
        filtered = filtered.filter(message => message.priority === 'high');
        break;
      case 'today':
        const today = new Date().toDateString();
        filtered = filtered.filter(message => 
          new Date(message.sentAt).toDateString() === today
        );
        break;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(message => 
          new Date(message.sentAt) >= weekAgo
        );
        break;
    }
  }
  
  return filtered;
}, [activeTab, searchQuery, filter]);
```

## 📊 統計情報の計算

### 送信統計
```typescript
// 送信統計の計算
const getSentStats = (messages: SentMessage[]) => {
  const total = messages.length;
  const delivered = messages.filter(msg => msg.status === 'delivered').length;
  const pending = messages.filter(msg => msg.status === 'pending').length;
  const failed = messages.filter(msg => msg.status === 'failed').length;
  const deliveryRate = total > 0 ? (delivered / total) * 100 : 0;
  
  return {
    total,
    delivered,
    pending,
    failed,
    deliveryRate: Math.round(deliveryRate * 100) / 100
  };
};

// HP問合せシステムの統計
const hpStats = getSentStats(hpSentMessages);

// エミダスシステムの統計
const emidasStats = getSentStats(emidasSentMessages);
```

### 優先度別統計
```typescript
// 優先度別統計の計算
const getPriorityStats = (messages: SentMessage[]) => {
  const high = messages.filter(msg => msg.priority === 'high').length;
  const medium = messages.filter(msg => msg.priority === 'medium').length;
  const low = messages.filter(msg => msg.priority === 'low').length;
  
  return { high, medium, low };
};
```

## ⚠️ リファクタリング時の注意点

1. **送信メールデータ構造**: 現在の送信メールデータ構造を維持
2. **タブ機能**: HP問合せ・エミダスシステムの分類を維持
3. **統計表示**: 現在の統計表示機能を維持
4. **レスポンシブ対応**: 現在のレスポンシブ対応を維持
5. **ステータス表示**: 現在のステータス表示を維持

## 📁 関連ファイル

- `src/app/mail/sent/page.tsx` - 送信メール一覧
- `src/app/mail/inbox/[id]/page.tsx` - メール返信機能
- `src/components/Header.tsx` - ヘッダーナビゲーション

## 🔗 関連機能

- **受信メール管理**: 受信メールの管理
- **メール返信**: メール返信機能
- **署名管理**: 送信時の署名使用
- **統計機能**: 送信統計の表示

## 📝 テストケース

### 正常系
1. 送信メール一覧の表示
2. タブ切り替え
3. 統計情報の表示
4. 送信ステータスの表示
5. レスポンシブ表示

### 異常系
1. 送信メールデータの読み込み失敗
2. 統計計算のエラー
3. ネットワークエラー

## 🚀 改善提案

1. **リアルタイム更新**: 送信ステータスのリアルタイム更新
2. **詳細統計**: より詳細な送信統計
3. **エクスポート機能**: 送信履歴のエクスポート
4. **再送機能**: 送信失敗時の再送機能
5. **送信テンプレート**: よく使われる返信テンプレート
6. **送信スケジュール**: 送信のスケジュール機能
