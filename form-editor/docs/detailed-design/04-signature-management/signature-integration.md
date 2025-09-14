# 署名統合機能

署名のフォーム設定・メール返信での統合機能です。

## 📋 機能概要

署名をフォーム設定やメール返信で使用するための統合機能を提供します。

## 🔧 実装詳細

### ファイル位置
- **フォーム設定**: `src/components/SettingsEditor.tsx`
- **メール返信**: `src/app/mail/inbox/[id]/page.tsx`

### 署名統合データ構造
```typescript
interface FormSettings {
  signatureId?: string;
  // その他の設定項目
}

interface ReplyData {
  signatureId?: string;
  content: string;
  // その他の返信データ
}
```

## 🎯 主要機能

### 1. フォーム設定での署名選択
```typescript
{/* 署名選択 */}
<div>
  <label className="block text-base font-medium text-gray-700 mb-2">
    送信控えメールの署名
  </label>
  <Select
    value={settings.signatureId || undefined}
    onValueChange={(value) => handleSignatureChange(value || "")}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="署名を選択してください" />
    </SelectTrigger>
    <SelectContent>
      {signatures.map((signature) => (
        <SelectItem key={signature.id} value={signature.id}>
          {signature.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  <p className="mt-1 text-base text-gray-500">
    送信控えメールに使用する署名を選択してください。
  </p>
</div>
```

### 2. 署名プレビュー表示
```typescript
{/* 選択された署名のプレビュー */}
{settings.signatureId && (
  <div className="bg-gray-50 border border-gray-200 rounded-none p-4">
    <h4 className="font-medium text-gray-900 mb-2">署名プレビュー</h4>
    <div className="text-base text-gray-700 whitespace-pre-line">
      {signatures.find(s => s.id === settings.signatureId)?.content}
    </div>
  </div>
)}
```

### 3. 署名変更処理
```typescript
const handleSignatureChange = (signatureId: string) => {
  onSettingsChange({ ...settings, signatureId });
};
```

### 4. メール返信での署名統合
```typescript
// 署名付き返信内容の生成
const generateReplyContent = (content: string, signature?: Signature) => {
  if (signature) {
    return `${content}\n\n${signature.content}`;
  }
  return content;
};

// 返信処理での署名使用
const handleReply = async () => {
  if (!replyContent.trim()) {
    alert('返信内容を入力してください。');
    return;
  }

  try {
    // 署名の取得
    const selectedSignature = signatures.find(sig => sig.id === settings.signatureId);
    
    // 署名付き返信内容の生成
    const replyWithSignature = generateReplyContent(replyContent, selectedSignature);
    
    // 返信データの準備
    const replyData = {
      to: message.fromEmail,
      subject: `Re: ${message.subject}`,
      content: replyWithSignature,
      originalMessageId: message.id,
      signatureId: settings.signatureId
    };

    // 返信送信
    const response = await fetch('/api/replies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(replyData)
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

## 🔄 署名統合の状態管理

### フォーム設定での署名状態
```typescript
const [signatures, setSignatures] = useState<Signature[]>([]);
const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);

// 署名の読み込み
useEffect(() => {
  const loadSignatures = async () => {
    try {
      const response = await fetch('/api/signatures');
      if (response.ok) {
        const signatures = await response.json();
        setSignatures(signatures);
        
        // デフォルト署名の設定
        const defaultSignature = signatures.find((sig: Signature) => sig.isDefault);
        if (defaultSignature) {
          setSelectedSignature(defaultSignature);
        }
      }
    } catch (error) {
      console.error('署名の読み込みに失敗しました:', error);
    }
  };
  
  loadSignatures();
}, []);
```

### メール返信での署名状態
```typescript
const [replyContent, setReplyContent] = useState('');
const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);

// 署名の選択
const handleSignatureSelect = (signatureId: string) => {
  const signature = signatures.find(sig => sig.id === signatureId);
  setSelectedSignature(signature || null);
};
```

## 🎨 署名統合のUI要素

### 署名選択ドロップダウン
```typescript
<Select
  value={settings.signatureId || undefined}
  onValueChange={(value) => handleSignatureChange(value || "")}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="署名を選択してください" />
  </SelectTrigger>
  <SelectContent>
    {signatures.map((signature) => (
      <SelectItem key={signature.id} value={signature.id}>
        <div className="flex items-center justify-between w-full">
          <span>{signature.name}</span>
          {signature.isDefault && (
            <Badge variant="secondary" className="ml-2 text-xs">デフォルト</Badge>
          )}
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

### 署名プレビュー
```typescript
{settings.signatureId && (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
      <FileText className="h-4 w-4 mr-2" />
      署名プレビュー
    </h4>
    <div className="text-sm text-gray-700 whitespace-pre-line bg-white p-3 rounded border">
      {signatures.find(s => s.id === settings.signatureId)?.content}
    </div>
  </div>
)}
```

### 返信フォームでの署名選択
```typescript
{/* 返信フォームでの署名選択 */}
<div className="mb-4">
  <Label className="text-sm font-medium text-gray-900 mb-2">署名</Label>
  <Select
    value={selectedSignature?.id || ''}
    onValueChange={handleSignatureSelect}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="署名を選択してください" />
    </SelectTrigger>
    <SelectContent>
      {signatures.map((signature) => (
        <SelectItem key={signature.id} value={signature.id}>
          <div className="flex items-center justify-between w-full">
            <span>{signature.name}</span>
            {signature.isDefault && (
              <Badge variant="secondary" className="ml-2 text-xs">デフォルト</Badge>
            )}
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

## 🔄 署名統合の処理フロー

### フォーム設定での署名統合フロー
```
フォーム設定画面表示
↓
署名データの読み込み
↓
署名選択ドロップダウンの表示
↓
署名選択
↓
署名プレビューの表示
↓
設定の保存
```

### メール返信での署名統合フロー
```
メール返信画面表示
↓
署名データの読み込み
↓
返信内容の入力
↓
署名の選択
↓
署名付き返信内容の生成
↓
返信の送信
```

## 🎨 署名統合のレスポンシブ対応

### 署名選択のレスポンシブ対応
```typescript
<div className="space-y-2">
  <Label className="text-sm font-medium text-gray-900">署名</Label>
  <Select
    value={selectedSignature?.id || ''}
    onValueChange={handleSignatureSelect}
  >
    <SelectTrigger className="w-full h-9 sm:h-10">
      <SelectValue placeholder="署名を選択してください" />
    </SelectTrigger>
    <SelectContent>
      {signatures.map((signature) => (
        <SelectItem key={signature.id} value={signature.id}>
          <div className="flex items-center justify-between w-full">
            <span className="text-sm">{signature.name}</span>
            {signature.isDefault && (
              <Badge variant="secondary" className="ml-2 text-xs">デフォルト</Badge>
            )}
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

### 署名プレビューのレスポンシブ対応
```typescript
{settings.signatureId && (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mt-4">
    <h4 className="font-medium text-gray-900 mb-2 flex items-center text-sm sm:text-base">
      <FileText className="h-4 w-4 mr-2" />
      署名プレビュー
    </h4>
    <div className="text-xs sm:text-sm text-gray-700 whitespace-pre-line bg-white p-2 sm:p-3 rounded border">
      {signatures.find(s => s.id === settings.signatureId)?.content}
    </div>
  </div>
)}
```

## 🔄 署名統合のエラーハンドリング

### 署名読み込みエラー
```typescript
const loadSignatures = async () => {
  try {
    const response = await fetch('/api/signatures');
    if (response.ok) {
      const signatures = await response.json();
      setSignatures(signatures);
    } else {
      // フォールバック: ローカルデータを使用
      const { signatures: localData } = await import('@/data/signatures');
      setSignatures(localData);
    }
  } catch (error) {
    console.error('署名の読み込みに失敗しました:', error);
    // フォールバック: ローカルデータを使用
    try {
      const { signatures: localData } = await import('@/data/signatures');
      setSignatures(localData);
    } catch (localError) {
      console.error('ローカルデータの読み込みにも失敗しました:', localError);
      setSignatures([]);
    }
  }
};
```

### 署名選択エラー
```typescript
const handleSignatureChange = (signatureId: string) => {
  try {
    const signature = signatures.find(sig => sig.id === signatureId);
    if (signature) {
      onSettingsChange({ ...settings, signatureId });
    } else {
      console.error('選択された署名が見つかりません:', signatureId);
      onSettingsChange({ ...settings, signatureId: '' });
    }
  } catch (error) {
    console.error('署名の変更に失敗しました:', error);
  }
};
```

## ⚠️ リファクタリング時の注意点

1. **署名統合**: フォーム設定・メール返信での署名統合を維持
2. **署名選択**: 現在の署名選択UIを維持
3. **署名プレビュー**: 現在の署名プレビュー機能を維持
4. **フォールバック**: API失敗時のローカルデータフォールバックを維持
5. **レスポンシブ対応**: 現在のレスポンシブ対応を維持

## 📁 関連ファイル

- `src/components/SettingsEditor.tsx` - フォーム設定での署名統合
- `src/app/mail/inbox/[id]/page.tsx` - メール返信での署名統合
- `src/components/SignatureEditor.tsx` - 署名管理
- `src/data/signatures.ts` - デフォルト署名データ

## 🔗 関連機能

- **署名管理**: 署名のCRUD操作
- **フォーム設定**: フォーム設定での署名選択
- **メール返信**: メール返信での署名使用
- **データ管理**: 署名データの永続化

## 📝 テストケース

### 正常系
1. 署名選択の表示
2. 署名の選択
3. 署名プレビューの表示
4. 署名付き返信の送信
5. デフォルト署名の自動選択

### 異常系
1. 署名データの読み込み失敗
2. 署名選択の失敗
3. 署名プレビューの表示エラー
4. 署名付き返信の送信失敗

## 🚀 改善提案

1. **署名テンプレート**: よく使われる署名のテンプレート
2. **署名プレビュー**: リアルタイムプレビュー機能
3. **署名検索**: 署名の検索・フィルタ機能
4. **署名統計**: 署名使用統計の表示
5. **署名インポート/エクスポート**: 署名データの移行機能
6. **署名バージョン管理**: 署名の履歴管理
