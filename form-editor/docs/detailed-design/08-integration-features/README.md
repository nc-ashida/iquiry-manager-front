# 統合機能

アプリケーションの外部システムとの統合・連携機能です。

## 📋 機能一覧

### 1. API統合
- **ファイル**: 各コンポーネント内のAPI呼び出し処理
- **機能**: 外部APIとの連携
- **詳細**: [api-integration.md](./api-integration.md)

### 2. ファイルアップロード機能
- **ファイル**: `src/components/FormEditor.tsx` (ファイルアップロード設定部分)
- **機能**: ファイルアップロードの設定・管理
- **詳細**: [file-upload.md](./file-upload.md)

### 3. ドメイン検証機能
- **ファイル**: `src/components/FormEditor.tsx` (許可ドメイン設定部分)
- **機能**: CORS設定用のドメイン検証
- **詳細**: [domain-validation.md](./domain-validation.md)

## 🔧 主要な実装詳細

### API統合パターン
```typescript
// 基本的なAPI呼び出しパターン
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
```

### フォールバック処理
```typescript
// API失敗時のフォールバック処理
const loadSignatures = async () => {
  try {
    const response = await fetch('/api/signatures');
    if (response.ok) {
      const data = await response.json();
      setSignatures(data);
    } else {
      // フォールバック: ローカルデータを使用
      const { signatures: localData } = await import('@/data/signatures');
      setSignatures(localData);
    }
  } catch (error) {
    console.error('署名データの読み込みに失敗しました:', error);
    // フォールバック: ローカルデータを使用
    try {
      const { signatures: localData } = await import('@/data/signatures');
      setSignatures(localData);
    } catch (localError) {
      console.error('ローカルデータの読み込みにも失敗しました:', localError);
    }
  }
};
```

## 🎯 主要機能

### 1. 署名API統合
```typescript
// 署名のCRUD操作
const handleSave = async () => {
  if (!formData.name.trim() || !formData.content.trim()) {
    alert('署名名と内容は必須です。');
    return;
  }

  try {
    if (editingSignature) {
      // 更新
      const updateData: UpdateSignatureRequest = {
        id: editingSignature.id,
        name: formData.name,
        content: formData.content,
        isDefault: formData.isDefault
      };

      const response = await fetch(`/api/signatures/${editingSignature.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedSignature = await response.json();
        setSignatures(prev => prev.map(sig =>
          sig.id === editingSignature.id ? updatedSignature : sig
        ));
      }
    } else {
      // 新規作成
      const createData: CreateSignatureRequest = {
        name: formData.name,
        content: formData.content,
        isDefault: formData.isDefault
      };

      const response = await fetch('/api/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData)
      });

      if (response.ok) {
        const newSignature = await response.json();
        setSignatures(prev => [...prev, newSignature]);
      }
    }

    // デフォルト署名の処理
    if (formData.isDefault) {
      setSignatures(prev => prev.map(sig => ({
        ...sig,
        isDefault: sig.id === (editingSignature?.id || 'new') ? true : false
      })));
    }

    resetForm();
    setIsDialogOpen(false);
    onSignaturesChange?.(signatures);
  } catch (error) {
    console.error('署名の保存に失敗しました:', error);
    alert('署名の保存に失敗しました。');
  }
};
```

### 2. ファイルアップロード設定
```typescript
// ファイルアップロード設定の管理
const handleFileUploadChange = (enabled: boolean) => {
  const currentFileUpload = currentForm.settings.fileUpload || {
    enabled: false,
    maxFiles: 1,
    maxFileSize: 10
  };
  
  handleFormChange({
    settings: {
      ...currentForm.settings,
      fileUpload: {
        ...currentFileUpload,
        enabled: enabled
      }
    }
  });
};

// ファイルサイズ制限の設定
const handleMaxFileSizeChange = (maxFileSize: number) => {
  const value = Math.min(20, Math.max(1, maxFileSize));
  handleFormChange({
    settings: {
      ...currentForm.settings,
      fileUpload: {
        ...currentForm.settings.fileUpload!,
        maxFileSize: value
      }
    }
  });
};

// 最大ファイル数の設定
const handleMaxFilesChange = (maxFiles: number) => {
  const value = Math.min(5, Math.max(1, maxFiles));
  handleFormChange({
    settings: {
      ...currentForm.settings,
      fileUpload: {
        ...currentForm.settings.fileUpload!,
        maxFiles: value
      }
    }
  });
};
```

### 3. ドメイン検証機能
```typescript
// ドメイン設定のバリデーション
const validateDomain = (domain: string): boolean => {
  if (!domain.trim()) return false;
  
  // 基本的なドメイン形式チェック
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
  const portRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*:\d+$/;
  
  return domainRegex.test(domain) || portRegex.test(domain);
};

// ドメイン設定の更新
const handleDomainChange = (index: number, value: string) => {
  const newDomains = [...(currentForm.settings.allowedDomains || [])];
  newDomains[index] = value;
  
  handleFormChange({
    settings: {
      ...currentForm.settings,
      allowedDomains: newDomains
    }
  });
};

// ドメインの追加
const handleAddDomain = () => {
  const currentDomains = currentForm.settings.allowedDomains || [];
  
  // 空のドメインがある場合は追加しない
  if (currentDomains.some(domain => !domain.trim())) {
    return;
  }
  
  const newDomains = [...currentDomains, ''];
  handleFormChange({
    settings: {
      ...currentForm.settings,
      allowedDomains: newDomains
    }
  });
};

// ドメインの削除
const handleRemoveDomain = (index: number) => {
  const currentDomains = currentForm.settings.allowedDomains || [];
  
  // 最低1つは残す必要がある
  if (currentDomains.length <= 1) {
    return;
  }
  
  const newDomains = [...currentDomains];
  newDomains.splice(index, 1);
  
  handleFormChange({
    settings: {
      ...currentForm.settings,
      allowedDomains: newDomains
    }
  });
};
```

## 🔄 データフロー

### 1. API統合フロー
```
ユーザー操作
↓
API呼び出し
↓
成功: データ更新
失敗: フォールバック処理
↓
ローカルデータ使用
```

### 2. ファイルアップロードフロー
```
フォーム設定
↓
ファイルアップロード有効化
↓
制限設定（ファイル数・サイズ）
↓
フォーム生成時に自動追加
```

### 3. ドメイン検証フロー
```
ドメイン入力
↓
バリデーション
↓
成功: 設定保存
失敗: エラー表示
↓
CORS設定に反映
```

## 🎨 レスポンシブ対応

### 1. ファイルアップロード設定
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="space-y-3">
    <Label htmlFor="maxFiles" className="text-sm font-semibold text-gray-900">
      最大ファイル数
    </Label>
    <Input
      id="maxFiles"
      type="number"
      min="1"
      max="5"
      value={currentForm.settings.fileUpload?.maxFiles || 1}
      onChange={(e) => handleMaxFilesChange(parseInt(e.target.value) || 1)}
      className="h-10"
    />
    <p className="text-sm text-gray-600">1〜5ファイルまで</p>
  </div>
  <div className="space-y-3">
    <Label htmlFor="maxFileSize" className="text-sm font-semibold text-gray-900">
      1ファイルあたりの最大容量 (MB)
    </Label>
    <Input
      id="maxFileSize"
      type="number"
      min="1"
      max="20"
      value={currentForm.settings.fileUpload?.maxFileSize || 10}
      onChange={(e) => handleMaxFileSizeChange(parseInt(e.target.value) || 1)}
      className="h-10"
    />
    <p className="text-sm text-gray-600">1〜20MBまで</p>
  </div>
</div>
```

### 2. ドメイン設定
```typescript
<div className="space-y-2">
  {currentForm.settings.allowedDomains?.map((domain, index) => (
    <div key={index} className="flex items-center space-x-2">
      <Input
        type="text"
        value={domain}
        onChange={(e) => handleDomainChange(index, e.target.value)}
        placeholder="example.com"
        className={`flex-1 ${!validateDomain(domain) ? 'border-red-300 focus:border-red-500' : ''}`}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleRemoveDomain(index)}
        disabled={currentDomains.length <= 1}
        className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${currentDomains.length <= 1
          ? 'opacity-50 cursor-not-allowed'
          : ''
          }`}
      >
        削除
      </Button>
    </div>
  )) || []}
</div>
```

## ⚠️ リファクタリング時の注意点

1. **API統合**: 現在のAPI統合パターンを維持
2. **フォールバック処理**: 現在のフォールバック機能を維持
3. **ファイルアップロード**: 現在のファイルアップロード機能を維持
4. **ドメイン検証**: 現在のドメイン検証機能を維持
5. **エラーハンドリング**: 現在のエラーハンドリングを維持

## 📁 関連ファイル

- `src/components/FormEditor.tsx` - ファイルアップロード・ドメイン設定
- `src/components/SignatureEditor.tsx` - 署名API統合
- `src/shared/utils/dataManager.ts` - データ管理
- `src/shared/types/index.ts` - 型定義

## 🔗 関連機能

- **フォーム管理**: フォーム設定の統合
- **署名管理**: 署名API統合
- **データ管理**: データの永続化
- **バリデーション**: データ検証

## 📝 テストケース

### 正常系
1. API呼び出しの成功
2. ファイルアップロード設定
3. ドメイン検証の成功
4. フォールバック処理

### 異常系
1. API呼び出しの失敗
2. ネットワークエラー
3. 無効なドメイン設定
4. ファイルサイズ制限の超過

## 🚀 改善提案

1. **API抽象化**: API呼び出しの抽象化
2. **キャッシュ機能**: APIレスポンスのキャッシュ
3. **リトライ機能**: API呼び出しの自動リトライ
4. **オフライン対応**: オフライン時の機能維持
5. **リアルタイム同期**: リアルタイムデータ同期
6. **セキュリティ強化**: APIセキュリティの向上
