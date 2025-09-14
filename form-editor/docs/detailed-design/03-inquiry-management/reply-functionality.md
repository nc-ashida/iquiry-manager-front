# 返信機能

メール返信の詳細機能です。

## 📋 機能概要

受信メールに対する返信機能を提供し、効率的な問合せ対応を支援します。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/app/mail/inbox/[id]/page.tsx` (返信部分)

### 返信データ構造
```typescript
interface ReplyData {
  to: string;
  toEmail: string;
  subject: string;
  content: string;
  originalMessageId: string;
  signatureId?: string;
  attachments?: File[];
}
```

## 🎯 主要機能

### 1. 返信フォーム表示
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

### 2. 返信処理
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

### 3. 返信フォームの状態管理
```typescript
const [isReplying, setIsReplying] = useState(false);
const [replyContent, setReplyContent] = useState('');
const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
```

### 4. フォーカス管理
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

## 🎨 返信フォームのUI要素

### 返信ボタン
```typescript
<Button
  variant="outline"
  size="sm"
  onClick={() => setIsReplying(!isReplying)}
  className={`transition-colors ${isReplying ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-50"}`}
>
  <Reply className="h-4 w-4 mr-2" />
  {isReplying ? "返信をキャンセル" : "返信"}
</Button>
```

### 返信情報表示
```typescript
<div className="text-xs text-gray-600 space-y-1">
  <div>宛先: {message.fromEmail}</div>
  <div>件名: Re: {message.subject}</div>
</div>
```

### 返信内容入力
```typescript
<Textarea
  ref={replyTextareaRef}
  placeholder="返信内容を入力してください..."
  value={replyContent}
  onChange={(e) => setReplyContent(e.target.value)}
  className="min-h-[120px]"
/>
```

### 送信ボタン
```typescript
<Button
  size="sm"
  onClick={handleReply}
  disabled={!replyContent.trim()}
  className="hover:bg-blue-600 transition-colors"
>
  <Send className="h-4 w-4 mr-2" />
  送信
</Button>
```

## 🔄 返信処理の詳細

### 返信データの準備
```typescript
const prepareReplyData = (): ReplyData => {
  return {
    to: message.from,
    toEmail: message.fromEmail,
    subject: `Re: ${message.subject}`,
    content: replyContent,
    originalMessageId: message.id,
    signatureId: selectedSignature?.id
  };
};
```

### 返信送信処理
```typescript
const sendReply = async (replyData: ReplyData) => {
  try {
    const response = await fetch('/api/replies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(replyData)
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('返信送信エラー:', error);
    throw error;
  }
};
```

### 返信完了処理
```typescript
const handleReplySuccess = () => {
  // 返信フォームをリセット
  setReplyContent('');
  setIsReplying(false);
  
  // 成功通知
  alert('返信を送信しました。');
  
  // 送信ページにリダイレクト
  router.push('/mail/sent');
};
```

## 🎨 返信フォームのアニメーション

### 表示アニメーション
```typescript
<div className="mb-6 p-4 bg-gray-50 rounded-lg border animate-in slide-in-from-top-2 duration-200">
  {/* 返信フォーム内容 */}
</div>
```

### フォーカスアニメーション
```typescript
// フォーカス時のアニメーション
useEffect(() => {
  if (isReplying && replyTextareaRef.current) {
    setTimeout(() => {
      replyTextareaRef.current?.focus();
      // フォーカス時のアニメーション効果
      replyTextareaRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  }
}, [isReplying]);
```

## 🔄 返信機能の拡張

### 署名の統合
```typescript
// 署名の選択
const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);

// 署名の読み込み
useEffect(() => {
  const loadSignatures = async () => {
    try {
      const response = await fetch('/api/signatures');
      if (response.ok) {
        const signatures = await response.json();
        const defaultSignature = signatures.find((sig: Signature) => sig.isDefault);
        setSelectedSignature(defaultSignature || signatures[0]);
      }
    } catch (error) {
      console.error('署名の読み込みに失敗しました:', error);
    }
  };
  
  loadSignatures();
}, []);

// 署名付き返信内容の生成
const generateReplyContent = (content: string, signature?: Signature) => {
  if (signature) {
    return `${content}\n\n${signature.content}`;
  }
  return content;
};
```

### 添付ファイルの対応
```typescript
// 添付ファイルの状態管理
const [attachments, setAttachments] = useState<File[]>([]);

// ファイル選択処理
const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (files) {
    setAttachments(Array.from(files));
  }
};

// 添付ファイルの表示
{attachments.length > 0 && (
  <div className="mb-4">
    <h5 className="text-sm font-medium text-gray-900 mb-2">添付ファイル</h5>
    <div className="space-y-2">
      {attachments.map((file, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-white border rounded">
          <span className="text-sm text-gray-700">{file.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newAttachments = attachments.filter((_, i) => i !== index);
              setAttachments(newAttachments);
            }}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  </div>
)}
```

### 返信テンプレート
```typescript
// 返信テンプレートの定義
const replyTemplates = [
  {
    id: 'thank-you',
    name: 'お礼テンプレート',
    content: 'この度はお問い合わせいただき、ありがとうございます。\n\n'
  },
  {
    id: 'inquiry-received',
    name: '問合せ受付テンプレート',
    content: 'お問い合わせいただいた件について、以下の通りご回答いたします。\n\n'
  },
  {
    id: 'follow-up',
    name: 'フォローアップテンプレート',
    content: '先日のお問い合わせについて、追加でご質問がございましたらお気軽にお聞かせください。\n\n'
  }
];

// テンプレート選択
const [selectedTemplate, setSelectedTemplate] = useState<string>('');

// テンプレート適用
const applyTemplate = (templateId: string) => {
  const template = replyTemplates.find(t => t.id === templateId);
  if (template) {
    setReplyContent(template.content);
  }
};
```

## 🔄 返信機能の状態管理

### 返信状態の管理
```typescript
interface ReplyState {
  isReplying: boolean;
  replyContent: string;
  selectedSignature: Signature | null;
  attachments: File[];
  selectedTemplate: string;
  isSending: boolean;
}

const [replyState, setReplyState] = useState<ReplyState>({
  isReplying: false,
  replyContent: '',
  selectedSignature: null,
  attachments: [],
  selectedTemplate: '',
  isSending: false
});
```

### 返信状態の更新
```typescript
const updateReplyState = (updates: Partial<ReplyState>) => {
  setReplyState(prev => ({ ...prev, ...updates }));
};
```

## ⚠️ リファクタリング時の注意点

1. **返信フォーム**: 現在の返信フォームUIを維持
2. **返信処理**: 現在の返信処理ロジックを維持
3. **状態管理**: 現在の状態管理を維持
4. **アニメーション**: 現在のアニメーション効果を維持
5. **エラーハンドリング**: 現在のエラーハンドリングを維持

## 📁 関連ファイル

- `src/app/mail/inbox/[id]/page.tsx` - 返信機能実装
- `src/app/mail/sent/page.tsx` - 送信履歴表示
- `src/components/SignatureEditor.tsx` - 署名管理

## 🔗 関連機能

- **メール詳細**: メール詳細表示
- **送信メール管理**: 返信後の送信履歴
- **署名管理**: 返信時の署名使用
- **テンプレート機能**: 返信テンプレート

## 📝 テストケース

### 正常系
1. 返信フォームの表示
2. 返信内容の入力
3. 返信の送信
4. 署名の統合
5. 添付ファイルの対応

### 異常系
1. 返信内容の未入力
2. 返信送信の失敗
3. ネットワークエラー
4. 署名の読み込み失敗

## 🚀 改善提案

1. **返信テンプレート**: より多くの返信テンプレート
2. **返信履歴**: 返信履歴の表示
3. **返信スケジュール**: 返信のスケジュール機能
4. **返信統計**: 返信統計の表示
5. **返信の最適化**: 返信機能の最適化
6. **返信の自動化**: 返信の自動化機能
