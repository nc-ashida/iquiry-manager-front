# データ型定義

アプリケーション全体で使用されるTypeScript型定義です。

## 📋 型定義一覧

### 1. フォーム関連の型定義
- **ファイル**: `src/shared/types/index.ts`

### 2. フィールド関連の型定義
- **ファイル**: `src/shared/types/index.ts`

### 3. 問合せ関連の型定義
- **ファイル**: `src/shared/types/index.ts`

### 4. 署名関連の型定義
- **ファイル**: `src/shared/types/index.ts`

## 🔧 主要型定義詳細

### 1. フォーム関連の型定義
```typescript
// フィールドタイプ
export type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file';

// バリデーションタイプ
export type ValidationType = 'email' | 'phone' | 'url' | 'number' | 'date' | 'custom';

// フィールドバリデーション
export interface FieldValidation {
  type?: ValidationType;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  required?: boolean;
}

// フォームフィールド
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: FieldValidation;
  options?: string[];
  order: number;
  allowOther?: boolean;
  multiple?: boolean;
}

// フォーム設定
export interface FormSettings {
  autoReply: boolean;
  fileUpload?: {
    enabled: boolean;
    maxFiles: number;
    maxFileSize: number;
  };
  allowedDomains: string[];
  completionUrl?: string;
  signatureId?: string;
}

// フォームスタイリング
export interface FormStyling {
  css: string;
  theme: 'light' | 'dark' | 'custom';
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

// フォーム
export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  styling: FormStyling;
  createdAt: string;
  updatedAt: string;
}
```

### 2. 問合せ関連の型定義
```typescript
// 問合せステータス
export type InquiryStatus = 'new' | 'in-progress' | 'resolved' | 'closed';

// 問合せ優先度
export type InquiryPriority = 'low' | 'medium' | 'high' | 'urgent';

// 問合せカテゴリ
export type InquiryCategory = 'general' | 'technical' | 'billing' | 'support';

// 送信者情報
export interface SenderInfo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

// 問合せ
export interface Inquiry {
  id: string;
  formId: string;
  responses: Record<string, any>;
  senderInfo: SenderInfo;
  receivedAt: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  category: InquiryCategory;
  isRead: boolean;
  assignedTo?: string;
  notes?: string;
  attachments?: string[];
}
```

### 3. 署名関連の型定義
```typescript
// 署名
export interface Signature {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string;
}

// 署名作成リクエスト
export interface CreateSignatureRequest {
  name: string;
  content: string;
  isDefault?: boolean;
}

// 署名更新リクエスト
export interface UpdateSignatureRequest extends Partial<CreateSignatureRequest> {
  id: string;
}
```

### 4. システム設定関連の型定義
```typescript
// システム設定
export interface SystemSettings {
  defaultSignature: string;
  autoReplyEnabled: boolean;
  maxFormsPerUser: number;
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
}

// ユーザー設定
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  desktopNotifications: boolean;
}
```

### 5. API関連の型定義
```typescript
// APIレスポンス
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ページネーション
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ページネーション付きレスポンス
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

// 検索クエリ
export interface SearchQuery {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}
```

### 6. UI関連の型定義
```typescript
// ボタンバリアント
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

// ボタンサイズ
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// アラートタイプ
export type AlertType = 'default' | 'destructive' | 'warning' | 'info' | 'success';

// トースト通知
export interface ToastNotification {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// モーダル
export interface Modal {
  id: string;
  title: string;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
  onClose?: () => void;
}
```

### 7. イベント関連の型定義
```typescript
// フォームイベント
export interface FormEvent {
  type: 'create' | 'update' | 'delete' | 'duplicate';
  formId: string;
  timestamp: string;
  userId?: string;
}

// 問合せイベント
export interface InquiryEvent {
  type: 'create' | 'update' | 'delete' | 'reply' | 'assign';
  inquiryId: string;
  timestamp: string;
  userId?: string;
}

// 署名イベント
export interface SignatureEvent {
  type: 'create' | 'update' | 'delete' | 'set-default';
  signatureId: string;
  timestamp: string;
  userId?: string;
}
```

### 8. エラー関連の型定義
```typescript
// エラータイプ
export type ErrorType = 'validation' | 'network' | 'permission' | 'not-found' | 'server' | 'unknown';

// エラー
export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

// バリデーションエラー
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
```

## 🔄 型定義の使用例

### 1. フォーム関連の型使用
```typescript
// フォームの作成
const createForm = (formData: Partial<Form>): Form => {
  return {
    id: generateId(),
    name: formData.name || '',
    description: formData.description || '',
    fields: formData.fields || [],
    settings: formData.settings || defaultFormSettings,
    styling: formData.styling || defaultFormStyling,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// フィールドの作成
const createField = (fieldData: Partial<FormField>): FormField => {
  return {
    id: generateId(),
    type: fieldData.type || 'text',
    label: fieldData.label || '',
    placeholder: fieldData.placeholder || '',
    required: fieldData.required || false,
    validation: fieldData.validation,
    options: fieldData.options,
    order: fieldData.order || 0,
    allowOther: fieldData.allowOther || false,
    multiple: fieldData.multiple || false
  };
};
```

### 2. 問合せ関連の型使用
```typescript
// 問合せの作成
const createInquiry = (inquiryData: Partial<Inquiry>): Inquiry => {
  return {
    id: generateId(),
    formId: inquiryData.formId || '',
    responses: inquiryData.responses || {},
    senderInfo: inquiryData.senderInfo || { name: '', email: '' },
    receivedAt: new Date().toISOString(),
    status: inquiryData.status || 'new',
    priority: inquiryData.priority || 'medium',
    category: inquiryData.category || 'general',
    isRead: inquiryData.isRead || false,
    assignedTo: inquiryData.assignedTo,
    notes: inquiryData.notes,
    attachments: inquiryData.attachments
  };
};
```

### 3. 署名関連の型使用
```typescript
// 署名の作成
const createSignature = (signatureData: CreateSignatureRequest): Signature => {
  return {
    id: generateId(),
    name: signatureData.name,
    content: signatureData.content,
    isDefault: signatureData.isDefault || false,
    createdAt: new Date().toISOString()
  };
};

// 署名の更新
const updateSignature = (signature: Signature, updates: Partial<UpdateSignatureRequest>): Signature => {
  return {
    ...signature,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};
```

## 🔄 型定義のバリデーション

### 型ガード関数
```typescript
// フォームの型ガード
export const isForm = (obj: any): obj is Form => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.fields) &&
    typeof obj.settings === 'object' &&
    typeof obj.styling === 'object' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  );
};

// フィールドの型ガード
export const isFormField = (obj: any): obj is FormField => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.label === 'string' &&
    typeof obj.required === 'boolean' &&
    typeof obj.order === 'number'
  );
};

// 問合せの型ガード
export const isInquiry = (obj: any): obj is Inquiry => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.formId === 'string' &&
    typeof obj.responses === 'object' &&
    typeof obj.senderInfo === 'object' &&
    typeof obj.receivedAt === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.priority === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.isRead === 'boolean'
  );
};
```

### 型変換関数
```typescript
// 型変換関数
export const convertToForm = (obj: any): Form | null => {
  if (isForm(obj)) {
    return obj;
  }
  return null;
};

export const convertToFormField = (obj: any): FormField | null => {
  if (isFormField(obj)) {
    return obj;
  }
  return null;
};

export const convertToInquiry = (obj: any): Inquiry | null => {
  if (isInquiry(obj)) {
    return obj;
  }
  return null;
};
```

## 🔄 型定義の拡張

### 型定義の拡張
```typescript
// 型定義の拡張
export interface ExtendedForm extends Form {
  tags?: string[];
  visibility: 'public' | 'private' | 'unlisted';
  collaborators?: string[];
}

export interface ExtendedInquiry extends Inquiry {
  tags?: string[];
  relatedInquiries?: string[];
  escalationLevel?: number;
}
```

### 型定義のユーティリティ
```typescript
// 型定義のユーティリティ
export type PartialForm = Partial<Form>;
export type PartialFormField = Partial<FormField>;
export type PartialInquiry = Partial<Inquiry>;
export type PartialSignature = Partial<Signature>;

export type FormFieldType = FormField['type'];
export type InquiryStatusType = Inquiry['status'];
export type InquiryPriorityType = Inquiry['priority'];
export type InquiryCategoryType = Inquiry['category'];
```

## ⚠️ リファクタリング時の注意点

1. **型定義**: 現在の型定義を維持
2. **型ガード**: 現在の型ガード関数を維持
3. **型変換**: 現在の型変換関数を維持
4. **型拡張**: 現在の型拡張を維持
5. **型ユーティリティ**: 現在の型ユーティリティを維持

## 📁 関連ファイル

- `src/shared/types/index.ts` - メイン実装
- `src/shared/utils/dataManager.ts` - データ管理
- `src/components/FormEditor.tsx` - フォームエディター
- `src/components/SignatureEditor.tsx` - 署名エディター

## 🔗 関連機能

- **フォーム管理**: フォームデータの型定義
- **問合せ管理**: 問合せデータの型定義
- **署名管理**: 署名データの型定義
- **データ管理**: データの型定義

## 📝 テストケース

### 正常系
1. 型定義の使用
2. 型ガードの動作
3. 型変換の動作
4. 型拡張の動作
5. 型ユーティリティの動作

### 異常系
1. 無効な型の使用
2. 型ガードの失敗
3. 型変換の失敗
4. 型拡張の失敗

## 🚀 改善提案

1. **型定義の最適化**: より効率的な型定義
2. **型ガードの拡張**: より詳細な型ガード
3. **型変換の改善**: より安全な型変換
4. **型拡張の拡張**: より多くの型拡張
5. **型ユーティリティの拡張**: より多くの型ユーティリティ
6. **型定義のドキュメント**: より詳細な型定義ドキュメント
