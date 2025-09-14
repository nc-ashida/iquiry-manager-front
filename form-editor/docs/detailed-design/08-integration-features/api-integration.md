# API統合機能

API統合機能です。

## 📋 機能概要

外部APIとの統合機能を提供し、フォームデータの送信や外部システムとの連携を可能にします。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/shared/utils/dataManager.ts`
- **API統合**: `src/shared/utils/apiIntegration.ts` (新規作成予定)

### API統合関数
```typescript
// API統合関数
export const integrateWithAPI = async (form: Form, formData: FormData): Promise<APIResponse> => {
  try {
    // フォームデータの準備
    const data = prepareFormData(form, formData);
    
    // API送信
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API送信エラー: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API統合エラー:', error);
    throw error;
  }
};
```

## 🎯 主要機能

### 1. フォームデータの準備
```typescript
// フォームデータの準備
export const prepareFormData = (form: Form, formData: FormData): FormSubmissionData => {
  const data: FormSubmissionData = {
    formId: form.id,
    responses: {},
    senderInfo: {
      name: '',
      email: '',
      phone: ''
    },
    allowedDomains: form.settings.allowedDomains || [],
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    referrer: document.referrer
  };
  
  // フォームデータの変換
  for (let [key, value] of formData.entries()) {
    data.responses[key] = value;
    
    // 送信者情報の抽出
    if (key.includes('name') || key.includes('名前')) {
      data.senderInfo.name = value;
    }
    if (key.includes('email') || key.includes('mail')) {
      data.senderInfo.email = value;
    }
    if (key.includes('phone') || key.includes('電話')) {
      data.senderInfo.phone = value;
    }
  }
  
  return data;
};
```

### 2. API送信処理
```typescript
// API送信処理
export const submitToAPI = async (data: FormSubmissionData): Promise<APIResponse> => {
  try {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API送信エラー: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API送信エラー:', error);
    throw error;
  }
};
```

### 3. エラーハンドリング
```typescript
// エラーハンドリング
export const handleAPIError = (error: Error): APIError => {
  const apiError: APIError = {
    message: error.message,
    code: 'API_ERROR',
    timestamp: new Date().toISOString()
  };
  
  // エラータイプの判定
  if (error.message.includes('404')) {
    apiError.code = 'NOT_FOUND';
  } else if (error.message.includes('500')) {
    apiError.code = 'SERVER_ERROR';
  } else if (error.message.includes('403')) {
    apiError.code = 'FORBIDDEN';
  } else if (error.message.includes('401')) {
    apiError.code = 'UNAUTHORIZED';
  }
  
  return apiError;
};
```

### 4. レスポンス処理
```typescript
// レスポンス処理
export const processAPIResponse = (response: Response): Promise<APIResponse> => {
  return response.json().then(data => {
    const apiResponse: APIResponse = {
      success: response.ok,
      data: data,
      status: response.status,
      timestamp: new Date().toISOString()
    };
    
    return apiResponse;
  });
};
```

### 5. リトライ処理
```typescript
// リトライ処理
export const retryAPICall = async (
  apiCall: () => Promise<APIResponse>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<APIResponse> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
};
```

## 🔄 API統合の使用例

### 1. 基本的なAPI統合
```typescript
// 基本的なAPI統合
const form: Form = {
  id: 'form-1',
  name: 'お問い合わせフォーム',
  description: 'お問い合わせフォームです',
  fields: [
    {
      id: 'field-1',
      type: 'text',
      label: 'お名前',
      placeholder: 'お名前を入力してください',
      required: true,
      order: 0
    },
    {
      id: 'field-2',
      type: 'email',
      label: 'メールアドレス',
      placeholder: 'メールアドレスを入力してください',
      required: true,
      order: 1
    }
  ],
  settings: {
    autoReply: true,
    allowedDomains: ['example.com'],
    completionUrl: 'https://example.com/thank-you'
  },
  styling: defaultFormStyling,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const formData = new FormData();
formData.append('field-1', '田中太郎');
formData.append('field-2', 'tanaka@example.com');

try {
  const response = await integrateWithAPI(form, formData);
  console.log('API統合成功:', response);
} catch (error) {
  console.error('API統合エラー:', error);
}
```

### 2. リトライ処理付きAPI統合
```typescript
// リトライ処理付きAPI統合
const apiCall = () => integrateWithAPI(form, formData);

try {
  const response = await retryAPICall(apiCall, 3, 1000);
  console.log('API統合成功:', response);
} catch (error) {
  console.error('API統合エラー:', error);
}
```

### 3. エラーハンドリング付きAPI統合
```typescript
// エラーハンドリング付きAPI統合
try {
  const response = await integrateWithAPI(form, formData);
  console.log('API統合成功:', response);
} catch (error) {
  const apiError = handleAPIError(error as Error);
  console.error('API統合エラー:', apiError);
  
  // エラーに応じた処理
  switch (apiError.code) {
    case 'NOT_FOUND':
      alert('フォームが見つかりません。');
      break;
    case 'SERVER_ERROR':
      alert('サーバーエラーが発生しました。しばらくしてから再度お試しください。');
      break;
    case 'FORBIDDEN':
      alert('アクセスが拒否されました。');
      break;
    case 'UNAUTHORIZED':
      alert('認証が必要です。');
      break;
    default:
      alert('エラーが発生しました。');
  }
}
```

## 🔄 API統合の拡張

### 1. カスタムAPI統合
```typescript
// カスタムAPI統合
export const integrateWithCustomAPI = async (
  form: Form,
  formData: FormData,
  apiConfig: APIConfig
): Promise<APIResponse> => {
  try {
    // フォームデータの準備
    const data = prepareFormData(form, formData);
    
    // カスタムAPI送信
    const response = await fetch(apiConfig.endpoint, {
      method: apiConfig.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...apiConfig.headers
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API送信エラー: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('カスタムAPI統合エラー:', error);
    throw error;
  }
};
```

### 2. 複数API統合
```typescript
// 複数API統合
export const integrateWithMultipleAPIs = async (
  form: Form,
  formData: FormData,
  apiConfigs: APIConfig[]
): Promise<APIResponse[]> => {
  const promises = apiConfigs.map(config => 
    integrateWithCustomAPI(form, formData, config)
  );
  
  try {
    const responses = await Promise.all(promises);
    return responses;
  } catch (error) {
    console.error('複数API統合エラー:', error);
    throw error;
  }
};
```

### 3. 条件付きAPI統合
```typescript
// 条件付きAPI統合
export const integrateWithConditionalAPI = async (
  form: Form,
  formData: FormData,
  conditions: APICondition[]
): Promise<APIResponse[]> => {
  const responses: APIResponse[] = [];
  
  for (const condition of conditions) {
    if (evaluateCondition(condition, formData)) {
      try {
        const response = await integrateWithCustomAPI(form, formData, condition.apiConfig);
        responses.push(response);
      } catch (error) {
        console.error('条件付きAPI統合エラー:', error);
        // エラーを無視して続行
      }
    }
  }
  
  return responses;
};
```

### 4. 非同期API統合
```typescript
// 非同期API統合
export const integrateWithAsyncAPI = async (
  form: Form,
  formData: FormData,
  apiConfig: APIConfig
): Promise<void> => {
  try {
    // 非同期でAPI送信
    integrateWithCustomAPI(form, formData, apiConfig)
      .then(response => {
        console.log('非同期API統合成功:', response);
      })
      .catch(error => {
        console.error('非同期API統合エラー:', error);
      });
  } catch (error) {
    console.error('非同期API統合エラー:', error);
  }
};
```

## 🔄 API統合の設定

### 1. API設定の定義
```typescript
// API設定の定義
export interface APIConfig {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// API条件の定義
export interface APICondition {
  field: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'not-contains';
  value: string;
  apiConfig: APIConfig;
}
```

### 2. API設定の管理
```typescript
// API設定の管理
export class APIConfigManager {
  private configs: Map<string, APIConfig> = new Map();
  
  addConfig(name: string, config: APIConfig): void {
    this.configs.set(name, config);
  }
  
  getConfig(name: string): APIConfig | undefined {
    return this.configs.get(name);
  }
  
  removeConfig(name: string): void {
    this.configs.delete(name);
  }
  
  getAllConfigs(): Map<string, APIConfig> {
    return new Map(this.configs);
  }
}
```

### 3. API設定の検証
```typescript
// API設定の検証
export const validateAPIConfig = (config: APIConfig): boolean => {
  if (!config.endpoint) {
    return false;
  }
  
  if (config.method && !['GET', 'POST', 'PUT', 'DELETE'].includes(config.method)) {
    return false;
  }
  
  if (config.timeout && config.timeout < 0) {
    return false;
  }
  
  if (config.retries && config.retries < 0) {
    return false;
  }
  
  if (config.retryDelay && config.retryDelay < 0) {
    return false;
  }
  
  return true;
};
```

## 🔄 API統合の監視

### 1. API統合の統計
```typescript
// API統合の統計
export interface APIStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageResponseTime: number;
  lastCallTime: string;
}

// API統合の統計管理
export class APIStatsManager {
  private stats: APIStats = {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    averageResponseTime: 0,
    lastCallTime: ''
  };
  
  recordCall(success: boolean, responseTime: number): void {
    this.stats.totalCalls++;
    
    if (success) {
      this.stats.successfulCalls++;
    } else {
      this.stats.failedCalls++;
    }
    
    this.stats.averageResponseTime = 
      (this.stats.averageResponseTime * (this.stats.totalCalls - 1) + responseTime) / 
      this.stats.totalCalls;
    
    this.stats.lastCallTime = new Date().toISOString();
  }
  
  getStats(): APIStats {
    return { ...this.stats };
  }
  
  resetStats(): void {
    this.stats = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      averageResponseTime: 0,
      lastCallTime: ''
    };
  }
}
```

### 2. API統合のログ
```typescript
// API統合のログ
export interface APILog {
  timestamp: string;
  endpoint: string;
  method: string;
  status: number;
  responseTime: number;
  success: boolean;
  error?: string;
}

// API統合のログ管理
export class APILogManager {
  private logs: APILog[] = [];
  private maxLogs: number = 1000;
  
  addLog(log: APILog): void {
    this.logs.push(log);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }
  
  getLogs(): APILog[] {
    return [...this.logs];
  }
  
  getLogsByEndpoint(endpoint: string): APILog[] {
    return this.logs.filter(log => log.endpoint === endpoint);
  }
  
  getLogsByStatus(status: number): APILog[] {
    return this.logs.filter(log => log.status === status);
  }
  
  clearLogs(): void {
    this.logs = [];
  }
}
```

## ⚠️ リファクタリング時の注意点

1. **API統合関数**: 現在のAPI統合関数を維持
2. **フォームデータの準備**: 現在のフォームデータの準備を維持
3. **エラーハンドリング**: 現在のエラーハンドリングを維持
4. **レスポンス処理**: 現在のレスポンス処理を維持
5. **リトライ処理**: 現在のリトライ処理を維持

## 📁 関連ファイル

- `src/shared/utils/dataManager.ts` - メイン実装
- `src/shared/utils/apiIntegration.ts` - API統合実装 (新規作成予定)
- `src/shared/types/index.ts` - 型定義

## 🔗 関連機能

- **フォーム管理**: フォームデータの取得
- **フォーム送信**: フォームデータの送信
- **エラーハンドリング**: エラーの処理
- **レスポンス処理**: レスポンスの処理

## 📝 テストケース

### 正常系
1. 基本的なAPI統合
2. リトライ処理付きAPI統合
3. エラーハンドリング付きAPI統合
4. カスタムAPI統合
5. 複数API統合

### 異常系
1. 無効なAPI設定
2. API送信の失敗
3. ネットワークエラー
4. タイムアウトエラー
5. 認証エラー

## 🚀 改善提案

1. **API統合の最適化**: パフォーマンスの向上
2. **API統合の拡張**: より多くの機能
3. **API統合の監視**: より詳細な監視
4. **API統合のログ**: より詳細なログ
5. **API統合の設定**: より柔軟な設定
6. **API統合の統計**: より詳細な統計
