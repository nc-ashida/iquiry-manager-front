# データ管理

アプリケーション全体のデータ管理・永続化・バリデーションを行う機能です。

## 📋 機能一覧

### 1. データストレージ
- **ファイル**: `src/shared/utils/dataManager.ts`
- **機能**: ローカルストレージによるデータ永続化
- **詳細**: [data-storage.md](./data-storage.md)

### 2. データ型定義
- **ファイル**: `src/shared/types/index.ts`
- **機能**: TypeScript型定義の管理
- **詳細**: [data-types.md](./data-types.md)

### 3. データバリデーション
- **ファイル**: 各コンポーネント内のバリデーション処理
- **機能**: データの検証・エラーハンドリング
- **詳細**: [data-validation.md](./data-validation.md)

## 🔧 主要な実装詳細

### データ管理構造
```typescript
// データ管理の基本構造
export const dataManager = {
  // フォームデータ
  forms: {
    load: () => loadData.forms(),
    save: (forms: Form[]) => saveData.forms(forms),
    add: (form: Form) => addForm(form),
    update: (form: Form) => updateForm(form),
    delete: (formId: string) => deleteForm(formId)
  },
  
  // 問合せデータ
  inquiries: {
    load: () => loadData.inquiries(),
    save: (inquiries: Inquiry[]) => saveData.inquiries(inquiries),
    add: (inquiry: Inquiry) => addInquiry(inquiry)
  },
  
  // 署名データ
  signatures: {
    load: () => loadData.signatures(),
    save: (signatures: Signature[]) => saveData.signatures(signatures),
    add: (signature: Signature) => addSignature(signature),
    update: (signature: Signature) => updateSignature(signature),
    delete: (signatureId: string) => deleteSignature(signatureId)
  },
  
  // 設定データ
  settings: {
    load: () => loadData.settings(),
    save: (settings: SystemSettings) => saveData.settings(settings),
    update: (settings: Partial<SystemSettings>) => updateSettings(settings)
  }
};
```

### データ永続化
```typescript
// ローカルストレージへの保存
const saveData = {
  forms: (forms: Form[]) => {
    try {
      localStorage.setItem('forms', JSON.stringify(forms));
    } catch (error) {
      console.error('フォームデータの保存に失敗しました:', error);
    }
  },
  
  inquiries: (inquiries: Inquiry[]) => {
    try {
      localStorage.setItem('inquiries', JSON.stringify(inquiries));
    } catch (error) {
      console.error('問合せデータの保存に失敗しました:', error);
    }
  },
  
  signatures: (signatures: Signature[]) => {
    try {
      localStorage.setItem('signatures', JSON.stringify(signatures));
    } catch (error) {
      console.error('署名データの保存に失敗しました:', error);
    }
  },
  
  settings: (settings: SystemSettings) => {
    try {
      localStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('設定データの保存に失敗しました:', error);
    }
  }
};
```

## 🎯 主要機能

### 1. データ読み込み
```typescript
const loadData = {
  forms: (): Form[] => {
    try {
      const data = localStorage.getItem('forms');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('フォームデータの読み込みに失敗しました:', error);
      return [];
    }
  },
  
  inquiries: (): Inquiry[] => {
    try {
      const data = localStorage.getItem('inquiries');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('問合せデータの読み込みに失敗しました:', error);
      return [];
    }
  },
  
  signatures: (): Signature[] => {
    try {
      const data = localStorage.getItem('signatures');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('署名データの読み込みに失敗しました:', error);
      return [];
    }
  },
  
  settings: (): SystemSettings => {
    try {
      const data = localStorage.getItem('settings');
      return data ? JSON.parse(data) : {
        defaultSignature: "1",
        autoReplyEnabled: true,
        maxFormsPerUser: 10
      };
    } catch (error) {
      console.error('設定データの読み込みに失敗しました:', error);
      return {
        defaultSignature: "1",
        autoReplyEnabled: true,
        maxFormsPerUser: 10
      };
    }
  }
};
```

### 2. データ初期化
```typescript
export const initializeData = async () => {
  try {
    // 署名データの初期化
    const signatures = loadData.signatures();
    if (signatures.length === 0) {
      const { signatures: defaultSignatures } = await import('@/data/signatures');
      saveData.signatures(defaultSignatures);
    }
    
    // 設定データの初期化
    const settings = loadData.settings();
    if (!settings.defaultSignature) {
      const { settings: defaultSettings } = await import('@/data/settings');
      saveData.settings(defaultSettings);
    }
  } catch (error) {
    console.error('データの初期化に失敗しました:', error);
  }
};
```

### 3. ユーティリティ関数
```typescript
// ID生成
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// 日付フォーマット
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// データ検証
export const validateForm = (form: Form): string[] => {
  const errors: string[] = [];
  
  if (!form.name.trim()) {
    errors.push('フォーム名は必須です');
  }
  
  if (form.fields.length === 0) {
    errors.push('最低1つのフィールドが必要です');
  }
  
  if (!form.settings.allowedDomains || form.settings.allowedDomains.length === 0) {
    errors.push('許可ドメインの設定が必要です');
  }
  
  return errors;
};
```

## 🔄 データフロー

### 1. データ読み込みフロー
```
アプリケーション起動
↓
initializeData()
↓
loadData.forms()
loadData.inquiries()
loadData.signatures()
loadData.settings()
↓
各コンポーネントでデータ使用
```

### 2. データ保存フロー
```
ユーザー操作
↓
データ更新
↓
saveData.forms()
saveData.inquiries()
saveData.signatures()
saveData.settings()
↓
ローカルストレージに保存
```

### 3. エラーハンドリングフロー
```
データ操作
↓
try-catch でエラーキャッチ
↓
console.error でログ出力
↓
デフォルト値または空配列を返却
```

## 🎨 レスポンシブ対応

### データ表示のレスポンシブ対応
```typescript
// フォーム一覧のレスポンシブ表示
const getResponsiveGridClass = (forms: Form[]) => {
  if (forms.length === 0) return 'grid-cols-1';
  if (forms.length === 1) return 'grid-cols-1';
  if (forms.length === 2) return 'grid-cols-1 sm:grid-cols-2';
  return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3';
};

// データ表示のレスポンシブ調整
const getResponsiveTextClass = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return 'text-xs sm:text-sm';
    case 'md':
      return 'text-sm sm:text-base';
    case 'lg':
      return 'text-base sm:text-lg';
    default:
      return 'text-sm';
  }
};
```

## ⚠️ リファクタリング時の注意点

1. **データ構造**: 現在のデータ構造を維持
2. **ローカルストレージ**: 現在のローカルストレージ機能を維持
3. **エラーハンドリング**: 現在のエラーハンドリングを維持
4. **データ検証**: 現在のバリデーション機能を維持
5. **初期化処理**: データ初期化の機能を維持

## 📁 関連ファイル

- `src/shared/utils/dataManager.ts` - メイン実装
- `src/shared/types/index.ts` - 型定義
- `src/data/forms.ts` - フォームデータ
- `src/data/inquiries.ts` - 問合せデータ
- `src/data/signatures.ts` - 署名データ
- `src/data/settings.ts` - 設定データ

## 🔗 関連機能

- **フォーム管理**: フォームデータの管理
- **問合せ管理**: 問合せデータの管理
- **署名管理**: 署名データの管理
- **設定管理**: システム設定の管理

## 📝 テストケース

### 正常系
1. データの読み込み
2. データの保存
3. データの更新
4. データの削除
5. データの初期化

### 異常系
1. ローカルストレージの容量不足
2. データの破損
3. ネットワークエラー
4. データの不整合

## 🚀 改善提案

1. **API統合**: サーバーサイドAPIとの統合
2. **データ同期**: 複数デバイス間のデータ同期
3. **データバックアップ**: データの自動バックアップ
4. **データ移行**: データの移行機能
5. **パフォーマンス最適化**: 大量データの効率的な処理
6. **データ圧縮**: データの圧縮・最適化
