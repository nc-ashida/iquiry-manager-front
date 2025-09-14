# データストレージ管理

ローカルストレージを使用したデータの永続化機能です。

## 📋 機能概要

アプリケーションのデータをローカルストレージに保存・読み込みし、データの永続化を実現します。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/shared/utils/dataManager.ts`

### データストレージ構造
```typescript
interface DataStorage {
  forms: Form[];
  inquiries: Inquiry[];
  signatures: Signature[];
  settings: SystemSettings;
}

interface SystemSettings {
  defaultSignature: string;
  autoReplyEnabled: boolean;
  maxFormsPerUser: number;
}
```

## 🎯 主要機能

### 1. データ保存機能
```typescript
// データ保存機能
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

### 2. データ読み込み機能
```typescript
// データ読み込み機能
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

### 3. データ管理機能
```typescript
// データ管理機能
export const dataManager = {
  // フォームデータ
  forms: {
    load: () => loadData.forms(),
    save: (forms: Form[]) => saveData.forms(forms),
    add: (form: Form) => {
      const forms = loadData.forms();
      forms.push(form);
      saveData.forms(forms);
      return forms;
    },
    update: (form: Form) => {
      const forms = loadData.forms();
      const index = forms.findIndex(f => f.id === form.id);
      if (index >= 0) {
        forms[index] = form;
        saveData.forms(forms);
      }
      return forms;
    },
    delete: (formId: string) => {
      const forms = loadData.forms();
      const filteredForms = forms.filter(f => f.id !== formId);
      saveData.forms(filteredForms);
      return filteredForms;
    }
  },
  
  // 問合せデータ
  inquiries: {
    load: () => loadData.inquiries(),
    save: (inquiries: Inquiry[]) => saveData.inquiries(inquiries),
    add: (inquiry: Inquiry) => {
      const inquiries = loadData.inquiries();
      inquiries.push(inquiry);
      saveData.inquiries(inquiries);
      return inquiries;
    }
  },
  
  // 署名データ
  signatures: {
    load: () => loadData.signatures(),
    save: (signatures: Signature[]) => saveData.signatures(signatures),
    add: (signature: Signature) => {
      const signatures = loadData.signatures();
      signatures.push(signature);
      saveData.signatures(signatures);
      return signatures;
    },
    update: (signature: Signature) => {
      const signatures = loadData.signatures();
      const index = signatures.findIndex(s => s.id === signature.id);
      if (index >= 0) {
        signatures[index] = signature;
        saveData.signatures(signatures);
      }
      return signatures;
    },
    delete: (signatureId: string) => {
      const signatures = loadData.signatures();
      const filteredSignatures = signatures.filter(s => s.id !== signatureId);
      saveData.signatures(filteredSignatures);
      return filteredSignatures;
    }
  },
  
  // 設定データ
  settings: {
    load: () => loadData.settings(),
    save: (settings: SystemSettings) => saveData.settings(settings),
    update: (settings: Partial<SystemSettings>) => {
      const currentSettings = loadData.settings();
      const updatedSettings = { ...currentSettings, ...settings };
      saveData.settings(updatedSettings);
      return updatedSettings;
    }
  }
};
```

### 4. データ初期化機能
```typescript
// データ初期化機能
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

## 🔄 データストレージの使用例

### 1. フォームデータの操作
```typescript
// フォームデータの読み込み
const forms = dataManager.forms.load();

// フォームデータの保存
dataManager.forms.save(forms);

// フォームの追加
const newForm = {
  id: generateId(),
  name: '新しいフォーム',
  description: 'フォームの説明',
  fields: [],
  settings: defaultFormSettings,
  styling: defaultFormStyling,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
dataManager.forms.add(newForm);

// フォームの更新
const updatedForm = { ...form, name: '更新されたフォーム' };
dataManager.forms.update(updatedForm);

// フォームの削除
dataManager.forms.delete(formId);
```

### 2. 問合せデータの操作
```typescript
// 問合せデータの読み込み
const inquiries = dataManager.inquiries.load();

// 問合せデータの保存
dataManager.inquiries.save(inquiries);

// 問合せの追加
const newInquiry = {
  id: generateId(),
  formId: 'form-1',
  responses: { name: '田中太郎', email: 'tanaka@example.com' },
  senderInfo: { name: '田中太郎', email: 'tanaka@example.com' },
  receivedAt: new Date().toISOString(),
  isRead: false,
  priority: 'medium',
  category: 'inquiry'
};
dataManager.inquiries.add(newInquiry);
```

### 3. 署名データの操作
```typescript
// 署名データの読み込み
const signatures = dataManager.signatures.load();

// 署名データの保存
dataManager.signatures.save(signatures);

// 署名の追加
const newSignature = {
  id: generateId(),
  name: '新しい署名',
  content: '署名の内容',
  isDefault: false,
  createdAt: new Date().toISOString()
};
dataManager.signatures.add(newSignature);

// 署名の更新
const updatedSignature = { ...signature, name: '更新された署名' };
dataManager.signatures.update(updatedSignature);

// 署名の削除
dataManager.signatures.delete(signatureId);
```

### 4. 設定データの操作
```typescript
// 設定データの読み込み
const settings = dataManager.settings.load();

// 設定データの保存
dataManager.settings.save(settings);

// 設定の更新
dataManager.settings.update({
  defaultSignature: 'signature-1',
  autoReplyEnabled: true
});
```

## 🔄 データストレージの状態管理

### データ状態の管理
```typescript
// データ状態の管理
const [forms, setForms] = useState<Form[]>([]);
const [inquiries, setInquiries] = useState<Inquiry[]>([]);
const [signatures, setSignatures] = useState<Signature[]>([]);
const [settings, setSettings] = useState<SystemSettings>(defaultSettings);

// データの読み込み
useEffect(() => {
  const loadAllData = async () => {
    await initializeData();
    setForms(dataManager.forms.load());
    setInquiries(dataManager.inquiries.load());
    setSignatures(dataManager.signatures.load());
    setSettings(dataManager.settings.load());
  };
  
  loadAllData();
}, []);
```

### データの同期
```typescript
// データの同期
const syncData = () => {
  setForms(dataManager.forms.load());
  setInquiries(dataManager.inquiries.load());
  setSignatures(dataManager.signatures.load());
  setSettings(dataManager.settings.load());
};

// データ変更時の同期
const handleFormChange = (updatedForm: Form) => {
  dataManager.forms.update(updatedForm);
  syncData();
};
```

## 🎨 データストレージのエラーハンドリング

### エラーハンドリング
```typescript
// エラーハンドリング
const safeSave = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`データの保存に失敗しました (${key}):`, error);
    return false;
  }
};

const safeLoad = (key: string, defaultValue: any) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`データの読み込みに失敗しました (${key}):`, error);
    return defaultValue;
  }
};
```

### ストレージ容量チェック
```typescript
// ストレージ容量チェック
const checkStorageCapacity = () => {
  try {
    const testData = 'x'.repeat(1024 * 1024); // 1MB
    localStorage.setItem('test', testData);
    localStorage.removeItem('test');
    return true;
  } catch (error) {
    console.error('ストレージ容量が不足しています:', error);
    return false;
  }
};

// データ保存前の容量チェック
const saveWithCapacityCheck = (key: string, data: any) => {
  if (checkStorageCapacity()) {
    return safeSave(key, data);
  } else {
    console.error('ストレージ容量が不足しているため、データを保存できません');
    return false;
  }
};
```

## 🔄 データストレージの最適化

### データ圧縮
```typescript
// データ圧縮
const compressData = (data: any) => {
  try {
    const jsonString = JSON.stringify(data);
    // 簡単な圧縮（実際の実装ではより高度な圧縮を使用）
    return btoa(jsonString);
  } catch (error) {
    console.error('データの圧縮に失敗しました:', error);
    return data;
  }
};

const decompressData = (compressedData: string) => {
  try {
    const jsonString = atob(compressedData);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('データの展開に失敗しました:', error);
    return compressedData;
  }
};
```

### データバックアップ
```typescript
// データバックアップ
const backupData = () => {
  try {
    const backup = {
      forms: loadData.forms(),
      inquiries: loadData.inquiries(),
      signatures: loadData.signatures(),
      settings: loadData.settings(),
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('backup', JSON.stringify(backup));
    return true;
  } catch (error) {
    console.error('データのバックアップに失敗しました:', error);
    return false;
  }
};

const restoreData = () => {
  try {
    const backup = localStorage.getItem('backup');
    if (backup) {
      const data = JSON.parse(backup);
      saveData.forms(data.forms);
      saveData.inquiries(data.inquiries);
      saveData.signatures(data.signatures);
      saveData.settings(data.settings);
      return true;
    }
    return false;
  } catch (error) {
    console.error('データの復元に失敗しました:', error);
    return false;
  }
};
```

## ⚠️ リファクタリング時の注意点

1. **データ構造**: 現在のデータ構造を維持
2. **ローカルストレージ**: 現在のローカルストレージ機能を維持
3. **エラーハンドリング**: 現在のエラーハンドリングを維持
4. **データ初期化**: 現在のデータ初期化機能を維持
5. **データ管理**: 現在のデータ管理機能を維持

## 📁 関連ファイル

- `src/shared/utils/dataManager.ts` - メイン実装
- `src/data/forms.ts` - フォームデータ
- `src/data/inquiries.ts` - 問合せデータ
- `src/data/signatures.ts` - 署名データ
- `src/data/settings.ts` - 設定データ

## 🔗 関連機能

- **フォーム管理**: フォームデータの永続化
- **問合せ管理**: 問合せデータの永続化
- **署名管理**: 署名データの永続化
- **設定管理**: 設定データの永続化

## 📝 テストケース

### 正常系
1. データの保存
2. データの読み込み
3. データの更新
4. データの削除
5. データの初期化

### 異常系
1. ストレージ容量不足
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
