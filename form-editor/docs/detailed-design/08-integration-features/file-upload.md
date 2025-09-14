# ファイルアップロード機能

ファイルアップロード機能です。

## 📋 機能概要

フォームにファイルアップロード機能を追加し、ユーザーがファイルをアップロードできるようにします。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/shared/utils/dataManager.ts`
- **ファイルアップロード**: `src/shared/utils/fileUpload.ts` (新規作成予定)

### ファイルアップロード関数
```typescript
// ファイルアップロード関数
export const uploadFile = async (file: File, formId: string): Promise<FileUploadResponse> => {
  try {
    // ファイルの検証
    if (!validateFile(file)) {
      throw new Error('無効なファイルです');
    }
    
    // フォームデータの作成
    const formData = new FormData();
    formData.append('file', file);
    formData.append('formId', formId);
    
    // ファイルアップロード
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`ファイルアップロードエラー: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('ファイルアップロードエラー:', error);
    throw error;
  }
};
```

## 🎯 主要機能

### 1. ファイルの検証
```typescript
// ファイルの検証
export const validateFile = (file: File): boolean => {
  // ファイルサイズの検証
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return false;
  }
  
  // ファイルタイプの検証
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return false;
  }
  
  return true;
};
```

### 2. ファイルアップロード処理
```typescript
// ファイルアップロード処理
export const processFileUpload = async (
  file: File,
  formId: string,
  onProgress?: (progress: number) => void
): Promise<FileUploadResponse> => {
  try {
    // ファイルの検証
    if (!validateFile(file)) {
      throw new Error('無効なファイルです');
    }
    
    // フォームデータの作成
    const formData = new FormData();
    formData.append('file', file);
    formData.append('formId', formId);
    
    // ファイルアップロード
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`ファイルアップロードエラー: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('ファイルアップロードエラー:', error);
    throw error;
  }
};
```

### 3. 複数ファイルアップロード
```typescript
// 複数ファイルアップロード
export const uploadMultipleFiles = async (
  files: File[],
  formId: string,
  onProgress?: (progress: number) => void
): Promise<FileUploadResponse[]> => {
  const responses: FileUploadResponse[] = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const response = await processFileUpload(files[i], formId, onProgress);
      responses.push(response);
      
      // 進捗の更新
      if (onProgress) {
        const progress = ((i + 1) / files.length) * 100;
        onProgress(progress);
      }
    } catch (error) {
      console.error(`ファイル${i + 1}のアップロードエラー:`, error);
      // エラーを無視して続行
    }
  }
  
  return responses;
};
```

### 4. ファイルアップロードの進捗管理
```typescript
// ファイルアップロードの進捗管理
export class FileUploadProgress {
  private progress: number = 0;
  private onProgressCallback?: (progress: number) => void;
  
  constructor(onProgress?: (progress: number) => void) {
    this.onProgressCallback = onProgress;
  }
  
  updateProgress(progress: number): void {
    this.progress = progress;
    if (this.onProgressCallback) {
      this.onProgressCallback(progress);
    }
  }
  
  getProgress(): number {
    return this.progress;
  }
  
  reset(): void {
    this.progress = 0;
  }
}
```

### 5. ファイルアップロードのエラーハンドリング
```typescript
// ファイルアップロードのエラーハンドリング
export const handleFileUploadError = (error: Error): FileUploadError => {
  const fileUploadError: FileUploadError = {
    message: error.message,
    code: 'FILE_UPLOAD_ERROR',
    timestamp: new Date().toISOString()
  };
  
  // エラータイプの判定
  if (error.message.includes('ファイルサイズ')) {
    fileUploadError.code = 'FILE_SIZE_ERROR';
  } else if (error.message.includes('ファイルタイプ')) {
    fileUploadError.code = 'FILE_TYPE_ERROR';
  } else if (error.message.includes('ネットワーク')) {
    fileUploadError.code = 'NETWORK_ERROR';
  } else if (error.message.includes('サーバー')) {
    fileUploadError.code = 'SERVER_ERROR';
  }
  
  return fileUploadError;
};
```

## 🔄 ファイルアップロードの使用例

### 1. 基本的なファイルアップロード
```typescript
// 基本的なファイルアップロード
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const formId = 'form-1';

fileInput.addEventListener('change', async (e) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    
    try {
      const response = await uploadFile(file, formId);
      console.log('ファイルアップロード成功:', response);
    } catch (error) {
      console.error('ファイルアップロードエラー:', error);
    }
  }
});
```

### 2. 進捗付きファイルアップロード
```typescript
// 進捗付きファイルアップロード
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const progressBar = document.getElementById('progress-bar') as HTMLProgressElement;
const formId = 'form-1';

fileInput.addEventListener('change', async (e) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    
    try {
      const response = await processFileUpload(file, formId, (progress) => {
        progressBar.value = progress;
      });
      console.log('ファイルアップロード成功:', response);
    } catch (error) {
      console.error('ファイルアップロードエラー:', error);
    }
  }
});
```

### 3. 複数ファイルアップロード
```typescript
// 複数ファイルアップロード
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const progressBar = document.getElementById('progress-bar') as HTMLProgressElement;
const formId = 'form-1';

fileInput.addEventListener('change', async (e) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const fileArray = Array.from(files);
    
    try {
      const responses = await uploadMultipleFiles(fileArray, formId, (progress) => {
        progressBar.value = progress;
      });
      console.log('複数ファイルアップロード成功:', responses);
    } catch (error) {
      console.error('複数ファイルアップロードエラー:', error);
    }
  }
});
```

### 4. エラーハンドリング付きファイルアップロード
```typescript
// エラーハンドリング付きファイルアップロード
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const formId = 'form-1';

fileInput.addEventListener('change', async (e) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    
    try {
      const response = await uploadFile(file, formId);
      console.log('ファイルアップロード成功:', response);
    } catch (error) {
      const fileUploadError = handleFileUploadError(error as Error);
      console.error('ファイルアップロードエラー:', fileUploadError);
      
      // エラーに応じた処理
      switch (fileUploadError.code) {
        case 'FILE_SIZE_ERROR':
          alert('ファイルサイズが大きすぎます。');
          break;
        case 'FILE_TYPE_ERROR':
          alert('サポートされていないファイルタイプです。');
          break;
        case 'NETWORK_ERROR':
          alert('ネットワークエラーが発生しました。');
          break;
        case 'SERVER_ERROR':
          alert('サーバーエラーが発生しました。');
          break;
        default:
          alert('ファイルアップロードエラーが発生しました。');
      }
    }
  }
});
```

## 🔄 ファイルアップロードの拡張

### 1. ドラッグ&ドロップファイルアップロード
```typescript
// ドラッグ&ドロップファイルアップロード
export const setupDragAndDropUpload = (
  dropZone: HTMLElement,
  formId: string,
  onUpload?: (response: FileUploadResponse) => void,
  onError?: (error: FileUploadError) => void
): void => {
  // ドラッグオーバーイベント
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  
  // ドラッグリーブイベント
  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
  });
  
  // ドロップイベント
  dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      try {
        const response = await uploadFile(file, formId);
        if (onUpload) {
          onUpload(response);
        }
      } catch (error) {
        const fileUploadError = handleFileUploadError(error as Error);
        if (onError) {
          onError(fileUploadError);
        }
      }
    }
  });
};
```

### 2. 画像プレビュー機能
```typescript
// 画像プレビュー機能
export const setupImagePreview = (
  fileInput: HTMLInputElement,
  previewContainer: HTMLElement
): void => {
  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.src = e.target?.result as string;
          img.style.maxWidth = '200px';
          img.style.maxHeight = '200px';
          
          previewContainer.innerHTML = '';
          previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    }
  });
};
```

### 3. ファイルアップロードの制限
```typescript
// ファイルアップロードの制限
export interface FileUploadLimits {
  maxFileSize: number; // bytes
  maxFiles: number;
  allowedTypes: string[];
  allowedExtensions: string[];
}

// ファイルアップロードの制限チェック
export const checkFileUploadLimits = (
  files: File[],
  limits: FileUploadLimits
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // ファイル数のチェック
  if (files.length > limits.maxFiles) {
    errors.push(`最大${limits.maxFiles}ファイルまでアップロードできます`);
  }
  
  // 各ファイルのチェック
  files.forEach((file, index) => {
    // ファイルサイズのチェック
    if (file.size > limits.maxFileSize) {
      errors.push(`ファイル${index + 1}のサイズが大きすぎます`);
    }
    
    // ファイルタイプのチェック
    if (!limits.allowedTypes.includes(file.type)) {
      errors.push(`ファイル${index + 1}のタイプがサポートされていません`);
    }
    
    // ファイル拡張子のチェック
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension && !limits.allowedExtensions.includes(extension)) {
      errors.push(`ファイル${index + 1}の拡張子がサポートされていません`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};
```

### 4. ファイルアップロードのキャンセル
```typescript
// ファイルアップロードのキャンセル
export class CancellableFileUpload {
  private abortController: AbortController | null = null;
  
  async uploadFile(
    file: File,
    formId: string,
    onProgress?: (progress: number) => void
  ): Promise<FileUploadResponse> {
    this.abortController = new AbortController();
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('formId', formId);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: this.abortController.signal
      });
      
      if (!response.ok) {
        throw new Error(`ファイルアップロードエラー: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('ファイルアップロードがキャンセルされました');
      }
      throw error;
    }
  }
  
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}
```

## 🔄 ファイルアップロードの設定

### 1. ファイルアップロード設定の定義
```typescript
// ファイルアップロード設定の定義
export interface FileUploadSettings {
  enabled: boolean;
  maxFileSize: number; // bytes
  maxFiles: number;
  allowedTypes: string[];
  allowedExtensions: string[];
  uploadEndpoint: string;
  progressCallback?: (progress: number) => void;
  errorCallback?: (error: FileUploadError) => void;
  successCallback?: (response: FileUploadResponse) => void;
}
```

### 2. ファイルアップロード設定の管理
```typescript
// ファイルアップロード設定の管理
export class FileUploadSettingsManager {
  private settings: FileUploadSettings;
  
  constructor(settings: FileUploadSettings) {
    this.settings = settings;
  }
  
  updateSettings(newSettings: Partial<FileUploadSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }
  
  getSettings(): FileUploadSettings {
    return { ...this.settings };
  }
  
  isEnabled(): boolean {
    return this.settings.enabled;
  }
  
  getMaxFileSize(): number {
    return this.settings.maxFileSize;
  }
  
  getMaxFiles(): number {
    return this.settings.maxFiles;
  }
  
  getAllowedTypes(): string[] {
    return [...this.settings.allowedTypes];
  }
  
  getAllowedExtensions(): string[] {
    return [...this.settings.allowedExtensions];
  }
}
```

### 3. ファイルアップロード設定の検証
```typescript
// ファイルアップロード設定の検証
export const validateFileUploadSettings = (settings: FileUploadSettings): boolean => {
  if (settings.maxFileSize <= 0) {
    return false;
  }
  
  if (settings.maxFiles <= 0) {
    return false;
  }
  
  if (settings.allowedTypes.length === 0) {
    return false;
  }
  
  if (settings.allowedExtensions.length === 0) {
    return false;
  }
  
  if (!settings.uploadEndpoint) {
    return false;
  }
  
  return true;
};
```

## 🔄 ファイルアップロードの監視

### 1. ファイルアップロードの統計
```typescript
// ファイルアップロードの統計
export interface FileUploadStats {
  totalUploads: number;
  successfulUploads: number;
  failedUploads: number;
  totalFileSize: number;
  averageFileSize: number;
  lastUploadTime: string;
}

// ファイルアップロードの統計管理
export class FileUploadStatsManager {
  private stats: FileUploadStats = {
    totalUploads: 0,
    successfulUploads: 0,
    failedUploads: 0,
    totalFileSize: 0,
    averageFileSize: 0,
    lastUploadTime: ''
  };
  
  recordUpload(success: boolean, fileSize: number): void {
    this.stats.totalUploads++;
    
    if (success) {
      this.stats.successfulUploads++;
      this.stats.totalFileSize += fileSize;
      this.stats.averageFileSize = this.stats.totalFileSize / this.stats.successfulUploads;
    } else {
      this.stats.failedUploads++;
    }
    
    this.stats.lastUploadTime = new Date().toISOString();
  }
  
  getStats(): FileUploadStats {
    return { ...this.stats };
  }
  
  resetStats(): void {
    this.stats = {
      totalUploads: 0,
      successfulUploads: 0,
      failedUploads: 0,
      totalFileSize: 0,
      averageFileSize: 0,
      lastUploadTime: ''
    };
  }
}
```

### 2. ファイルアップロードのログ
```typescript
// ファイルアップロードのログ
export interface FileUploadLog {
  timestamp: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  success: boolean;
  error?: string;
  uploadTime: number;
}

// ファイルアップロードのログ管理
export class FileUploadLogManager {
  private logs: FileUploadLog[] = [];
  private maxLogs: number = 1000;
  
  addLog(log: FileUploadLog): void {
    this.logs.push(log);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }
  
  getLogs(): FileUploadLog[] {
    return [...this.logs];
  }
  
  getLogsByFileType(fileType: string): FileUploadLog[] {
    return this.logs.filter(log => log.fileType === fileType);
  }
  
  getLogsBySuccess(success: boolean): FileUploadLog[] {
    return this.logs.filter(log => log.success === success);
  }
  
  clearLogs(): void {
    this.logs = [];
  }
}
```

## ⚠️ リファクタリング時の注意点

1. **ファイルアップロード関数**: 現在のファイルアップロード関数を維持
2. **ファイルの検証**: 現在のファイルの検証を維持
3. **ファイルアップロード処理**: 現在のファイルアップロード処理を維持
4. **エラーハンドリング**: 現在のエラーハンドリングを維持
5. **進捗管理**: 現在の進捗管理を維持

## 📁 関連ファイル

- `src/shared/utils/dataManager.ts` - メイン実装
- `src/shared/utils/fileUpload.ts` - ファイルアップロード実装 (新規作成予定)
- `src/shared/types/index.ts` - 型定義

## 🔗 関連機能

- **フォーム管理**: フォームデータの取得
- **ファイル管理**: ファイルの管理
- **エラーハンドリング**: エラーの処理
- **進捗管理**: 進捗の管理

## 📝 テストケース

### 正常系
1. 基本的なファイルアップロード
2. 進捗付きファイルアップロード
3. 複数ファイルアップロード
4. ドラッグ&ドロップファイルアップロード
5. 画像プレビュー機能

### 異常系
1. 無効なファイル
2. ファイルサイズエラー
3. ファイルタイプエラー
4. ネットワークエラー
5. サーバーエラー

## 🚀 改善提案

1. **ファイルアップロードの最適化**: パフォーマンスの向上
2. **ファイルアップロードの拡張**: より多くの機能
3. **ファイルアップロードの監視**: より詳細な監視
4. **ファイルアップロードのログ**: より詳細なログ
5. **ファイルアップロードの設定**: より柔軟な設定
6. **ファイルアップロードの統計**: より詳細な統計
