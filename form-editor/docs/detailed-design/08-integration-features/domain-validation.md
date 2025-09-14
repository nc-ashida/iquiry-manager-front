# ドメイン検証機能

ドメイン検証機能です。

## 📋 機能概要

フォームの埋め込み先ドメインを検証し、許可されたドメインからのみフォームを利用できるようにします。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/shared/utils/dataManager.ts`
- **ドメイン検証**: `src/shared/utils/domainValidation.ts` (新規作成予定)

### ドメイン検証関数
```typescript
// ドメイン検証関数
export const validateDomain = (allowedDomains: string[], currentDomain: string): boolean => {
  try {
    // 現在のドメインの取得
    const domain = getCurrentDomain();
    
    // 許可されたドメインのチェック
    return allowedDomains.some(allowedDomain => {
      return isDomainAllowed(domain, allowedDomain);
    });
  } catch (error) {
    console.error('ドメイン検証エラー:', error);
    return false;
  }
};
```

## 🎯 主要機能

### 1. 現在のドメインの取得
```typescript
// 現在のドメインの取得
export const getCurrentDomain = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  return window.location.hostname;
};
```

### 2. ドメインの許可チェック
```typescript
// ドメインの許可チェック
export const isDomainAllowed = (currentDomain: string, allowedDomain: string): boolean => {
  // 完全一致チェック
  if (currentDomain === allowedDomain) {
    return true;
  }
  
  // サブドメインチェック
  if (allowedDomain.startsWith('*.')) {
    const baseDomain = allowedDomain.substring(2);
    return currentDomain.endsWith('.' + baseDomain) || currentDomain === baseDomain;
  }
  
  // ワイルドカードチェック
  if (allowedDomain.includes('*')) {
    const pattern = allowedDomain.replace(/\*/g, '.*');
    const regex = new RegExp('^' + pattern + '$');
    return regex.test(currentDomain);
  }
  
  return false;
};
```

### 3. ドメイン検証の実行
```typescript
// ドメイン検証の実行
export const executeDomainValidation = (allowedDomains: string[]): DomainValidationResult => {
  try {
    const currentDomain = getCurrentDomain();
    const isValid = validateDomain(allowedDomains, currentDomain);
    
    const result: DomainValidationResult = {
      isValid,
      currentDomain,
      allowedDomains,
      timestamp: new Date().toISOString()
    };
    
    return result;
  } catch (error) {
    console.error('ドメイン検証実行エラー:', error);
    return {
      isValid: false,
      currentDomain: '',
      allowedDomains,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};
```

### 4. ドメイン検証のエラーハンドリング
```typescript
// ドメイン検証のエラーハンドリング
export const handleDomainValidationError = (error: Error): DomainValidationError => {
  const domainValidationError: DomainValidationError = {
    message: error.message,
    code: 'DOMAIN_VALIDATION_ERROR',
    timestamp: new Date().toISOString()
  };
  
  // エラータイプの判定
  if (error.message.includes('ドメイン')) {
    domainValidationError.code = 'INVALID_DOMAIN';
  } else if (error.message.includes('許可')) {
    domainValidationError.code = 'DOMAIN_NOT_ALLOWED';
  } else if (error.message.includes('設定')) {
    domainValidationError.code = 'INVALID_CONFIGURATION';
  }
  
  return domainValidationError;
};
```

### 5. ドメイン検証の設定
```typescript
// ドメイン検証の設定
export interface DomainValidationConfig {
  enabled: boolean;
  allowedDomains: string[];
  strictMode: boolean;
  errorMessage: string;
  redirectUrl?: string;
}

// ドメイン検証の設定管理
export class DomainValidationConfigManager {
  private config: DomainValidationConfig;
  
  constructor(config: DomainValidationConfig) {
    this.config = config;
  }
  
  updateConfig(newConfig: Partial<DomainValidationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  getConfig(): DomainValidationConfig {
    return { ...this.config };
  }
  
  isEnabled(): boolean {
    return this.config.enabled;
  }
  
  getAllowedDomains(): string[] {
    return [...this.config.allowedDomains];
  }
  
  isStrictMode(): boolean {
    return this.config.strictMode;
  }
  
  getErrorMessage(): string {
    return this.config.errorMessage;
  }
  
  getRedirectUrl(): string | undefined {
    return this.config.redirectUrl;
  }
}
```

## 🔄 ドメイン検証の使用例

### 1. 基本的なドメイン検証
```typescript
// 基本的なドメイン検証
const allowedDomains = ['example.com', 'test.com'];
const currentDomain = 'example.com';

const isValid = validateDomain(allowedDomains, currentDomain);
console.log('ドメイン検証結果:', isValid);
```

### 2. サブドメインのドメイン検証
```typescript
// サブドメインのドメイン検証
const allowedDomains = ['*.example.com', 'example.com'];
const currentDomain = 'sub.example.com';

const isValid = validateDomain(allowedDomains, currentDomain);
console.log('サブドメイン検証結果:', isValid);
```

### 3. ワイルドカードのドメイン検証
```typescript
// ワイルドカードのドメイン検証
const allowedDomains = ['*.example.com', 'test.*.com'];
const currentDomain = 'test.sub.example.com';

const isValid = validateDomain(allowedDomains, currentDomain);
console.log('ワイルドカード検証結果:', isValid);
```

### 4. ドメイン検証の実行
```typescript
// ドメイン検証の実行
const allowedDomains = ['example.com', '*.example.com'];
const result = executeDomainValidation(allowedDomains);

if (result.isValid) {
  console.log('ドメイン検証成功:', result);
} else {
  console.error('ドメイン検証失敗:', result);
}
```

### 5. エラーハンドリング付きドメイン検証
```typescript
// エラーハンドリング付きドメイン検証
const allowedDomains = ['example.com'];

try {
  const result = executeDomainValidation(allowedDomains);
  if (result.isValid) {
    console.log('ドメイン検証成功:', result);
  } else {
    console.error('ドメイン検証失敗:', result);
  }
} catch (error) {
  const domainValidationError = handleDomainValidationError(error as Error);
  console.error('ドメイン検証エラー:', domainValidationError);
}
```

## 🔄 ドメイン検証の拡張

### 1. 動的ドメイン検証
```typescript
// 動的ドメイン検証
export const validateDynamicDomain = async (
  allowedDomains: string[],
  domainSource: string
): Promise<DomainValidationResult> => {
  try {
    // 外部ソースからドメイン情報を取得
    const response = await fetch(domainSource);
    const domainData = await response.json();
    
    const currentDomain = getCurrentDomain();
    const isValid = validateDomain(allowedDomains, currentDomain);
    
    return {
      isValid,
      currentDomain,
      allowedDomains,
      domainData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('動的ドメイン検証エラー:', error);
    return {
      isValid: false,
      currentDomain: '',
      allowedDomains,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};
```

### 2. ドメイン検証のキャッシュ
```typescript
// ドメイン検証のキャッシュ
export class DomainValidationCache {
  private cache: Map<string, DomainValidationResult> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private defaultExpiry: number = 5 * 60 * 1000; // 5分
  
  set(key: string, result: DomainValidationResult, expiry?: number): void {
    this.cache.set(key, result);
    this.cacheExpiry.set(key, Date.now() + (expiry || this.defaultExpiry));
  }
  
  get(key: string): DomainValidationResult | null {
    const expiry = this.cacheExpiry.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    
    return this.cache.get(key) || null;
  }
  
  clear(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
  
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}
```

### 3. ドメイン検証の監視
```typescript
// ドメイン検証の監視
export class DomainValidationMonitor {
  private validationHistory: DomainValidationResult[] = [];
  private maxHistory: number = 1000;
  
  recordValidation(result: DomainValidationResult): void {
    this.validationHistory.push(result);
    
    if (this.validationHistory.length > this.maxHistory) {
      this.validationHistory.shift();
    }
  }
  
  getValidationHistory(): DomainValidationResult[] {
    return [...this.validationHistory];
  }
  
  getValidationStats(): DomainValidationStats {
    const total = this.validationHistory.length;
    const successful = this.validationHistory.filter(r => r.isValid).length;
    const failed = total - successful;
    
    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0
    };
  }
  
  clearHistory(): void {
    this.validationHistory = [];
  }
}
```

### 4. ドメイン検証のログ
```typescript
// ドメイン検証のログ
export interface DomainValidationLog {
  timestamp: string;
  currentDomain: string;
  allowedDomains: string[];
  isValid: boolean;
  error?: string;
  validationTime: number;
}

// ドメイン検証のログ管理
export class DomainValidationLogManager {
  private logs: DomainValidationLog[] = [];
  private maxLogs: number = 1000;
  
  addLog(log: DomainValidationLog): void {
    this.logs.push(log);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }
  
  getLogs(): DomainValidationLog[] {
    return [...this.logs];
  }
  
  getLogsByDomain(domain: string): DomainValidationLog[] {
    return this.logs.filter(log => log.currentDomain === domain);
  }
  
  getLogsByValidation(isValid: boolean): DomainValidationLog[] {
    return this.logs.filter(log => log.isValid === isValid);
  }
  
  clearLogs(): void {
    this.logs = [];
  }
}
```

## 🔄 ドメイン検証の設定

### 1. ドメイン検証設定の定義
```typescript
// ドメイン検証設定の定義
export interface DomainValidationSettings {
  enabled: boolean;
  allowedDomains: string[];
  strictMode: boolean;
  errorMessage: string;
  redirectUrl?: string;
  cacheEnabled: boolean;
  cacheExpiry: number;
  logEnabled: boolean;
  monitorEnabled: boolean;
}
```

### 2. ドメイン検証設定の管理
```typescript
// ドメイン検証設定の管理
export class DomainValidationSettingsManager {
  private settings: DomainValidationSettings;
  
  constructor(settings: DomainValidationSettings) {
    this.settings = settings;
  }
  
  updateSettings(newSettings: Partial<DomainValidationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }
  
  getSettings(): DomainValidationSettings {
    return { ...this.settings };
  }
  
  isEnabled(): boolean {
    return this.settings.enabled;
  }
  
  getAllowedDomains(): string[] {
    return [...this.settings.allowedDomains];
  }
  
  isStrictMode(): boolean {
    return this.settings.strictMode;
  }
  
  getErrorMessage(): string {
    return this.settings.errorMessage;
  }
  
  getRedirectUrl(): string | undefined {
    return this.settings.redirectUrl;
  }
  
  isCacheEnabled(): boolean {
    return this.settings.cacheEnabled;
  }
  
  getCacheExpiry(): number {
    return this.settings.cacheExpiry;
  }
  
  isLogEnabled(): boolean {
    return this.settings.logEnabled;
  }
  
  isMonitorEnabled(): boolean {
    return this.settings.monitorEnabled;
  }
}
```

### 3. ドメイン検証設定の検証
```typescript
// ドメイン検証設定の検証
export const validateDomainValidationSettings = (settings: DomainValidationSettings): boolean => {
  if (settings.allowedDomains.length === 0) {
    return false;
  }
  
  if (settings.cacheExpiry < 0) {
    return false;
  }
  
  if (!settings.errorMessage) {
    return false;
  }
  
  return true;
};
```

## 🔄 ドメイン検証の統計

### 1. ドメイン検証の統計
```typescript
// ドメイン検証の統計
export interface DomainValidationStats {
  totalValidations: number;
  successfulValidations: number;
  failedValidations: number;
  successRate: number;
  averageValidationTime: number;
  lastValidationTime: string;
}

// ドメイン検証の統計管理
export class DomainValidationStatsManager {
  private stats: DomainValidationStats = {
    totalValidations: 0,
    successfulValidations: 0,
    failedValidations: 0,
    successRate: 0,
    averageValidationTime: 0,
    lastValidationTime: ''
  };
  
  recordValidation(success: boolean, validationTime: number): void {
    this.stats.totalValidations++;
    
    if (success) {
      this.stats.successfulValidations++;
    } else {
      this.stats.failedValidations++;
    }
    
    this.stats.successRate = (this.stats.successfulValidations / this.stats.totalValidations) * 100;
    this.stats.averageValidationTime = 
      (this.stats.averageValidationTime * (this.stats.totalValidations - 1) + validationTime) / 
      this.stats.totalValidations;
    
    this.stats.lastValidationTime = new Date().toISOString();
  }
  
  getStats(): DomainValidationStats {
    return { ...this.stats };
  }
  
  resetStats(): void {
    this.stats = {
      totalValidations: 0,
      successfulValidations: 0,
      failedValidations: 0,
      successRate: 0,
      averageValidationTime: 0,
      lastValidationTime: ''
    };
  }
}
```

### 2. ドメイン検証の最適化
```typescript
// ドメイン検証の最適化
export const optimizeDomainValidation = (
  allowedDomains: string[]
): string[] => {
  // 重複の削除
  const uniqueDomains = [...new Set(allowedDomains)];
  
  // ソート
  const sortedDomains = uniqueDomains.sort();
  
  // 無効なドメインの削除
  const validDomains = sortedDomains.filter(domain => {
    try {
      // 基本的なドメイン形式のチェック
      return /^[a-zA-Z0-9.-]+$/.test(domain);
    } catch {
      return false;
    }
  });
  
  return validDomains;
};
```

## ⚠️ リファクタリング時の注意点

1. **ドメイン検証関数**: 現在のドメイン検証関数を維持
2. **ドメインの許可チェック**: 現在のドメインの許可チェックを維持
3. **ドメイン検証の実行**: 現在のドメイン検証の実行を維持
4. **エラーハンドリング**: 現在のエラーハンドリングを維持
5. **ドメイン検証の設定**: 現在のドメイン検証の設定を維持

## 📁 関連ファイル

- `src/shared/utils/dataManager.ts` - メイン実装
- `src/shared/utils/domainValidation.ts` - ドメイン検証実装 (新規作成予定)
- `src/shared/types/index.ts` - 型定義

## 🔗 関連機能

- **フォーム管理**: フォームデータの取得
- **ドメイン管理**: ドメインの管理
- **エラーハンドリング**: エラーの処理
- **設定管理**: 設定の管理

## 📝 テストケース

### 正常系
1. 基本的なドメイン検証
2. サブドメインのドメイン検証
3. ワイルドカードのドメイン検証
4. 動的ドメイン検証
5. ドメイン検証のキャッシュ

### 異常系
1. 無効なドメイン
2. 許可されていないドメイン
3. ドメイン検証の設定エラー
4. ネットワークエラー
5. サーバーエラー

## 🚀 改善提案

1. **ドメイン検証の最適化**: パフォーマンスの向上
2. **ドメイン検証の拡張**: より多くの機能
3. **ドメイン検証の監視**: より詳細な監視
4. **ドメイン検証のログ**: より詳細なログ
5. **ドメイン検証の設定**: より柔軟な設定
6. **ドメイン検証の統計**: より詳細な統計
