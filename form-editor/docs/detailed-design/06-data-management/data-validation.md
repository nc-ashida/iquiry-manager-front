# データバリデーション

アプリケーション全体で使用されるデータ検証機能です。

## 📋 機能概要

フォームデータ、問合せデータ、署名データ等の検証を行い、データの整合性を保ちます。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: 各コンポーネント内のバリデーション処理

### バリデーション型定義
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

interface ValidationRule {
  field: string;
  rules: ValidationRuleItem[];
}

interface ValidationRuleItem {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'custom';
  value?: any;
  message: string;
}
```

## 🎯 主要機能

### 1. フォームデータのバリデーション
```typescript
// フォームデータのバリデーション
export const validateForm = (form: Form): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // フォーム名の検証
  if (!form.name.trim()) {
    errors.push({
      field: 'name',
      message: 'フォーム名は必須です',
      value: form.name
    });
  } else if (form.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'フォーム名は100文字以内で入力してください',
      value: form.name
    });
  }
  
  // フィールドの検証
  if (form.fields.length === 0) {
    errors.push({
      field: 'fields',
      message: '最低1つのフィールドが必要です',
      value: form.fields
    });
  }
  
  // 各フィールドの検証
  form.fields.forEach((field, index) => {
    const fieldErrors = validateFormField(field, index);
    errors.push(...fieldErrors);
  });
  
  // 設定の検証
  const settingsErrors = validateFormSettings(form.settings);
  errors.push(...settingsErrors);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

### 2. フィールドデータのバリデーション
```typescript
// フィールドデータのバリデーション
export const validateFormField = (field: FormField, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const fieldPrefix = `fields[${index}]`;
  
  // ラベルの検証
  if (!field.label.trim()) {
    errors.push({
      field: `${fieldPrefix}.label`,
      message: 'フィールドラベルは必須です',
      value: field.label
    });
  } else if (field.label.length > 50) {
    errors.push({
      field: `${fieldPrefix}.label`,
      message: 'フィールドラベルは50文字以内で入力してください',
      value: field.label
    });
  }
  
  // プレースホルダーの検証
  if (field.placeholder && field.placeholder.length > 100) {
    errors.push({
      field: `${fieldPrefix}.placeholder`,
      message: 'プレースホルダーは100文字以内で入力してください',
      value: field.placeholder
    });
  }
  
  // 選択肢の検証
  if (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') {
    if (!field.options || field.options.length === 0) {
      errors.push({
        field: `${fieldPrefix}.options`,
        message: '選択肢は最低1つ必要です',
        value: field.options
      });
    } else {
      field.options.forEach((option, optionIndex) => {
        if (!option.trim()) {
          errors.push({
            field: `${fieldPrefix}.options[${optionIndex}]`,
            message: '選択肢は空にできません',
            value: option
          });
        } else if (option.length > 50) {
          errors.push({
            field: `${fieldPrefix}.options[${optionIndex}]`,
            message: '選択肢は50文字以内で入力してください',
            value: option
          });
        }
      });
    }
  }
  
  // バリデーション設定の検証
  if (field.validation) {
    const validationErrors = validateFieldValidation(field.validation, fieldPrefix);
    errors.push(...validationErrors);
  }
  
  return errors;
};
```

### 3. フィールドバリデーション設定の検証
```typescript
// フィールドバリデーション設定の検証
export const validateFieldValidation = (validation: FieldValidation, fieldPrefix: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // 最小文字数の検証
  if (validation.minLength !== undefined) {
    if (validation.minLength < 0) {
      errors.push({
        field: `${fieldPrefix}.validation.minLength`,
        message: '最小文字数は0以上である必要があります',
        value: validation.minLength
      });
    } else if (validation.minLength > 1000) {
      errors.push({
        field: `${fieldPrefix}.validation.minLength`,
        message: '最小文字数は1000以下である必要があります',
        value: validation.minLength
      });
    }
  }
  
  // 最大文字数の検証
  if (validation.maxLength !== undefined) {
    if (validation.maxLength < 1) {
      errors.push({
        field: `${fieldPrefix}.validation.maxLength`,
        message: '最大文字数は1以上である必要があります',
        value: validation.maxLength
      });
    } else if (validation.maxLength > 1000) {
      errors.push({
        field: `${fieldPrefix}.validation.maxLength`,
        message: '最大文字数は1000以下である必要があります',
        value: validation.maxLength
      });
    }
  }
  
  // 最小文字数と最大文字数の関係検証
  if (validation.minLength !== undefined && validation.maxLength !== undefined) {
    if (validation.minLength > validation.maxLength) {
      errors.push({
        field: `${fieldPrefix}.validation`,
        message: '最小文字数は最大文字数以下である必要があります',
        value: { minLength: validation.minLength, maxLength: validation.maxLength }
      });
    }
  }
  
  // 正規表現パターンの検証
  if (validation.pattern) {
    try {
      new RegExp(validation.pattern);
    } catch (error) {
      errors.push({
        field: `${fieldPrefix}.validation.pattern`,
        message: '正規表現パターンが無効です',
        value: validation.pattern
      });
    }
  }
  
  return errors;
};
```

### 4. フォーム設定のバリデーション
```typescript
// フォーム設定のバリデーション
export const validateFormSettings = (settings: FormSettings): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // 許可ドメインの検証
  if (!settings.allowedDomains || settings.allowedDomains.length === 0) {
    errors.push({
      field: 'settings.allowedDomains',
      message: '許可ドメインは最低1つ必要です',
      value: settings.allowedDomains
    });
  } else {
    settings.allowedDomains.forEach((domain, index) => {
      if (!domain.trim()) {
        errors.push({
          field: `settings.allowedDomains[${index}]`,
          message: 'ドメインは空にできません',
          value: domain
        });
      } else if (!isValidDomain(domain)) {
        errors.push({
          field: `settings.allowedDomains[${index}]`,
          message: '有効なドメイン形式で入力してください',
          value: domain
        });
      }
    });
  }
  
  // 完了ページURLの検証
  if (settings.completionUrl) {
    if (!isValidUrl(settings.completionUrl)) {
      errors.push({
        field: 'settings.completionUrl',
        message: '有効なURL形式で入力してください',
        value: settings.completionUrl
      });
    }
  }
  
  // ファイルアップロード設定の検証
  if (settings.fileUpload?.enabled) {
    const fileUploadErrors = validateFileUploadSettings(settings.fileUpload);
    errors.push(...fileUploadErrors);
  }
  
  return errors;
};
```

### 5. ファイルアップロード設定のバリデーション
```typescript
// ファイルアップロード設定のバリデーション
export const validateFileUploadSettings = (fileUpload: FormSettings['fileUpload']): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!fileUpload) return errors;
  
  // 最大ファイル数の検証
  if (fileUpload.maxFiles < 1) {
    errors.push({
      field: 'settings.fileUpload.maxFiles',
      message: '最大ファイル数は1以上である必要があります',
      value: fileUpload.maxFiles
    });
  } else if (fileUpload.maxFiles > 10) {
    errors.push({
      field: 'settings.fileUpload.maxFiles',
      message: '最大ファイル数は10以下である必要があります',
      value: fileUpload.maxFiles
    });
  }
  
  // 最大ファイルサイズの検証
  if (fileUpload.maxFileSize < 1) {
    errors.push({
      field: 'settings.fileUpload.maxFileSize',
      message: '最大ファイルサイズは1MB以上である必要があります',
      value: fileUpload.maxFileSize
    });
  } else if (fileUpload.maxFileSize > 100) {
    errors.push({
      field: 'settings.fileUpload.maxFileSize',
      message: '最大ファイルサイズは100MB以下である必要があります',
      value: fileUpload.maxFileSize
    });
  }
  
  return errors;
};
```

### 6. 問合せデータのバリデーション
```typescript
// 問合せデータのバリデーション
export const validateInquiry = (inquiry: Inquiry): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // フォームIDの検証
  if (!inquiry.formId.trim()) {
    errors.push({
      field: 'formId',
      message: 'フォームIDは必須です',
      value: inquiry.formId
    });
  }
  
  // 送信者情報の検証
  const senderErrors = validateSenderInfo(inquiry.senderInfo);
  errors.push(...senderErrors);
  
  // 回答データの検証
  if (!inquiry.responses || Object.keys(inquiry.responses).length === 0) {
    errors.push({
      field: 'responses',
      message: '回答データは必須です',
      value: inquiry.responses
    });
  }
  
  // 受信日時の検証
  if (!inquiry.receivedAt) {
    errors.push({
      field: 'receivedAt',
      message: '受信日時は必須です',
      value: inquiry.receivedAt
    });
  } else if (!isValidDate(inquiry.receivedAt)) {
    errors.push({
      field: 'receivedAt',
      message: '有効な日時形式で入力してください',
      value: inquiry.receivedAt
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

### 7. 送信者情報のバリデーション
```typescript
// 送信者情報のバリデーション
export const validateSenderInfo = (senderInfo: SenderInfo): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // 名前の検証
  if (!senderInfo.name.trim()) {
    errors.push({
      field: 'senderInfo.name',
      message: '名前は必須です',
      value: senderInfo.name
    });
  } else if (senderInfo.name.length > 100) {
    errors.push({
      field: 'senderInfo.name',
      message: '名前は100文字以内で入力してください',
      value: senderInfo.name
    });
  }
  
  // メールアドレスの検証
  if (!senderInfo.email.trim()) {
    errors.push({
      field: 'senderInfo.email',
      message: 'メールアドレスは必須です',
      value: senderInfo.email
    });
  } else if (!isValidEmail(senderInfo.email)) {
    errors.push({
      field: 'senderInfo.email',
      message: '有効なメールアドレス形式で入力してください',
      value: senderInfo.email
    });
  }
  
  // 電話番号の検証
  if (senderInfo.phone && !isValidPhone(senderInfo.phone)) {
    errors.push({
      field: 'senderInfo.phone',
      message: '有効な電話番号形式で入力してください',
      value: senderInfo.phone
    });
  }
  
  // 会社名の検証
  if (senderInfo.company && senderInfo.company.length > 100) {
    errors.push({
      field: 'senderInfo.company',
      message: '会社名は100文字以内で入力してください',
      value: senderInfo.company
    });
  }
  
  return errors;
};
```

### 8. 署名データのバリデーション
```typescript
// 署名データのバリデーション
export const validateSignature = (signature: Signature): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // 署名名の検証
  if (!signature.name.trim()) {
    errors.push({
      field: 'name',
      message: '署名名は必須です',
      value: signature.name
    });
  } else if (signature.name.length > 50) {
    errors.push({
      field: 'name',
      message: '署名名は50文字以内で入力してください',
      value: signature.name
    });
  }
  
  // 署名内容の検証
  if (!signature.content.trim()) {
    errors.push({
      field: 'content',
      message: '署名内容は必須です',
      value: signature.content
    });
  } else if (signature.content.length > 1000) {
    errors.push({
      field: 'content',
      message: '署名内容は1000文字以内で入力してください',
      value: signature.content
    });
  }
  
  // 作成日時の検証
  if (!signature.createdAt) {
    errors.push({
      field: 'createdAt',
      message: '作成日時は必須です',
      value: signature.createdAt
    });
  } else if (!isValidDate(signature.createdAt)) {
    errors.push({
      field: 'createdAt',
      message: '有効な日時形式で入力してください',
      value: signature.createdAt
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## 🔄 バリデーション関数の使用例

### 1. フォームデータのバリデーション
```typescript
// フォームデータのバリデーション
const handleFormSave = (form: Form) => {
  const validation = validateForm(form);
  
  if (!validation.isValid) {
    // エラーメッセージの表示
    validation.errors.forEach(error => {
      console.error(`${error.field}: ${error.message}`);
    });
    return;
  }
  
  // フォームの保存
  saveForm(form);
};
```

### 2. フィールドデータのバリデーション
```typescript
// フィールドデータのバリデーション
const handleFieldUpdate = (field: FormField, index: number) => {
  const errors = validateFormField(field, index);
  
  if (errors.length > 0) {
    // エラーメッセージの表示
    errors.forEach(error => {
      console.error(`${error.field}: ${error.message}`);
    });
    return;
  }
  
  // フィールドの更新
  updateField(field);
};
```

### 3. 問合せデータのバリデーション
```typescript
// 問合せデータのバリデーション
const handleInquirySubmit = (inquiry: Inquiry) => {
  const validation = validateInquiry(inquiry);
  
  if (!validation.isValid) {
    // エラーメッセージの表示
    validation.errors.forEach(error => {
      console.error(`${error.field}: ${error.message}`);
    });
    return;
  }
  
  // 問合せの送信
  submitInquiry(inquiry);
};
```

## 🔄 バリデーション関数のユーティリティ

### 1. ドメイン検証
```typescript
// ドメイン検証
export const isValidDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
  const portRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*:\d+$/;
  
  return domainRegex.test(domain) || portRegex.test(domain);
};
```

### 2. URL検証
```typescript
// URL検証
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### 3. メールアドレス検証
```typescript
// メールアドレス検証
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### 4. 電話番号検証
```typescript
// 電話番号検証
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\-\+\(\)\s]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};
```

### 5. 日時検証
```typescript
// 日時検証
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
```

## ⚠️ リファクタリング時の注意点

1. **バリデーション関数**: 現在のバリデーション関数を維持
2. **エラーメッセージ**: 現在のエラーメッセージを維持
3. **バリデーションルール**: 現在のバリデーションルールを維持
4. **エラーハンドリング**: 現在のエラーハンドリングを維持
5. **ユーティリティ関数**: 現在のユーティリティ関数を維持

## 📁 関連ファイル

- `src/shared/types/index.ts` - 型定義
- `src/components/FormEditor.tsx` - フォームエディター
- `src/components/SignatureEditor.tsx` - 署名エディター
- `src/shared/utils/dataManager.ts` - データ管理

## 🔗 関連機能

- **フォーム管理**: フォームデータの検証
- **問合せ管理**: 問合せデータの検証
- **署名管理**: 署名データの検証
- **データ管理**: データの検証

## 📝 テストケース

### 正常系
1. 有効なデータの検証
2. バリデーション関数の動作
3. エラーメッセージの表示
4. ユーティリティ関数の動作

### 異常系
1. 無効なデータの検証
2. バリデーション関数の失敗
3. エラーメッセージの表示エラー
4. ユーティリティ関数の失敗

## 🚀 改善提案

1. **バリデーションの最適化**: パフォーマンスの向上
2. **バリデーションルールの拡張**: より詳細なバリデーション
3. **エラーメッセージの改善**: より分かりやすいエラーメッセージ
4. **バリデーションの自動化**: 自動バリデーション機能
5. **バリデーションの統計**: バリデーションエラーの統計
6. **バリデーションの最適化**: より効率的なバリデーション
