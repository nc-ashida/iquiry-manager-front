# フィールドバリデーション

フォームフィールドの入力値検証機能です。

## 📋 バリデーション機能一覧

### 1. 必須項目チェック
- **機能**: 必須項目の未入力チェック
- **適用**: 全フィールドタイプ

### 2. 文字数制限
- **機能**: 最小・最大文字数のチェック
- **適用**: text, textarea

### 3. メール形式チェック
- **機能**: メールアドレスの形式検証
- **適用**: text (メールアドレス)

### 4. パターンマッチング
- **機能**: 正規表現による形式チェック
- **適用**: text

### 5. 選択項目チェック
- **機能**: 選択項目の必須チェック
- **適用**: select, radio, checkbox

## 🔧 実装詳細

### バリデーション型定義
```typescript
interface FieldValidation {
  type?: ValidationType;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  required?: boolean;
}

type ValidationType = 'email' | 'phone' | 'url' | 'number' | 'date' | 'custom';
```

### バリデーション関数
```typescript
// フィールドバリデーション関数
function validateField(field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): boolean {
  const value = field.value.trim();
  const fieldId = field.id;
  const isRequired = field.hasAttribute('required');
  const fieldType = field.type;
  const fieldName = field.name;
  
  // エラーメッセージをクリア
  clearFieldError(fieldId);
  
  // 必須項目チェック
  if (isRequired && !value) {
    showFieldError(fieldId, 'この項目は必須です');
    return false;
  }
  
  // 値がある場合のみ追加バリデーション
  if (value) {
    // メール形式チェック
    if (fieldType === 'email' || fieldName.includes('email') || fieldName.includes('mail')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showFieldError(fieldId, '正しいメールアドレスを入力してください');
        return false;
      }
    }
    
    // 文字数制限チェック
    const minLength = field.getAttribute('minlength');
    const maxLength = field.getAttribute('maxlength');
    
    if (minLength && value.length < parseInt(minLength)) {
      showFieldError(fieldId, `最低${minLength}文字以上入力してください`);
      return false;
    }
    
    if (maxLength && value.length > parseInt(maxLength)) {
      showFieldError(fieldId, `最大${maxLength}文字まで入力してください`);
      return false;
    }
  }
  
  return true;
}
```

## 🎯 各バリデーション機能の詳細

### 1. 必須項目チェック
```typescript
// 必須項目チェック
const validateRequired = (value: string, isRequired: boolean): boolean => {
  if (isRequired && !value.trim()) {
    return false;
  }
  return true;
};

// エラーメッセージ表示
const showRequiredError = (fieldId: string) => {
  showFieldError(fieldId, 'この項目は必須です');
};
```

**特徴:**
- 全フィールドタイプに対応
- 空文字・空白文字のチェック
- 必須項目の視覚的表示

### 2. 文字数制限チェック
```typescript
// 文字数制限チェック
const validateLength = (value: string, minLength?: number, maxLength?: number): boolean => {
  const length = value.length;
  
  if (minLength && length < minLength) {
    return false;
  }
  
  if (maxLength && length > maxLength) {
    return false;
  }
  
  return true;
};

// エラーメッセージ表示
const showLengthError = (fieldId: string, minLength?: number, maxLength?: number) => {
  if (minLength && maxLength) {
    showFieldError(fieldId, `${minLength}文字以上${maxLength}文字以下で入力してください`);
  } else if (minLength) {
    showFieldError(fieldId, `最低${minLength}文字以上入力してください`);
  } else if (maxLength) {
    showFieldError(fieldId, `最大${maxLength}文字まで入力してください`);
  }
};
```

**特徴:**
- 最小・最大文字数の設定
- リアルタイム文字数表示
- 制限超過時の警告

### 3. メール形式チェック
```typescript
// メール形式チェック
const validateEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

// エラーメッセージ表示
const showEmailError = (fieldId: string) => {
  showFieldError(fieldId, '正しいメールアドレスを入力してください');
};
```

**特徴:**
- RFC準拠のメール形式チェック
- ドメイン形式の検証
- 特殊文字の対応

### 4. パターンマッチング
```typescript
// パターンマッチング
const validatePattern = (value: string, pattern: string): boolean => {
  const regex = new RegExp(pattern);
  return regex.test(value);
};

// エラーメッセージ表示
const showPatternError = (fieldId: string, customMessage?: string) => {
  const message = customMessage || '入力形式が正しくありません';
  showFieldError(fieldId, message);
};
```

**特徴:**
- 正規表現による柔軟な検証
- カスタムパターンの設定
- カスタムエラーメッセージ

### 5. 選択項目チェック
```typescript
// 選択項目チェック
const validateSelection = (field: HTMLSelectElement | HTMLInputElement): boolean => {
  if (field.type === 'select-one') {
    const selectField = field as HTMLSelectElement;
    return selectField.value !== '';
  } else if (field.type === 'radio') {
    const radioFields = document.querySelectorAll(`input[name="${field.name}"]`) as NodeListOf<HTMLInputElement>;
    return Array.from(radioFields).some(radio => radio.checked);
  } else if (field.type === 'checkbox') {
    const checkboxFields = document.querySelectorAll(`input[name="${field.name}"]`) as NodeListOf<HTMLInputElement>;
    return Array.from(checkboxFields).some(checkbox => checkbox.checked);
  }
  return true;
};
```

**特徴:**
- 選択項目の必須チェック
- ラジオボタン・チェックボックスの対応
- 複数選択の検証

## 🎨 エラー表示UI

### エラーメッセージ表示
```typescript
// エラーメッセージ表示
const showFieldError = (fieldId: string, message: string) => {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // 既存のエラーメッセージを削除
  clearFieldError(fieldId);
  
  // フィールドにエラークラスを追加
  field.classList.add('ir-form-error');
  
  // エラーメッセージ要素を作成
  const errorElement = document.createElement('div');
  errorElement.className = 'ir-form-error-message';
  errorElement.textContent = message;
  
  // フィールドの後にエラーメッセージを挿入
  field.parentNode?.insertBefore(errorElement, field.nextSibling);
};

// エラーメッセージクリア
const clearFieldError = (fieldId: string) => {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // エラークラスを削除
  field.classList.remove('ir-form-error');
  
  // エラーメッセージ要素を削除
  const errorElement = field.parentNode?.querySelector('.ir-form-error-message');
  if (errorElement) {
    errorElement.remove();
  }
};
```

### エラースタイル
```css
/* バリデーションエラーのスタイル */
.ir-form-error {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
}

.ir-form-error:focus {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
}

.ir-form-error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ir-form-error-message::before {
  content: "⚠";
  font-size: 14px;
}
```

## 🔄 フォーム全体のバリデーション

### フォームバリデーション
```typescript
// フォーム全体のバリデーション
function validateForm(): boolean {
  const form = document.getElementById('inquiry-form-form') as HTMLFormElement;
  if (!form) return false;
  
  const fields = form.querySelectorAll('input, textarea, select');
  let isValid = true;
  
  fields.forEach(field => {
    if (!validateField(field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)) {
      isValid = false;
    }
  });
  
  return isValid;
}

// フォーム送信時のバリデーション
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // フォーム全体のバリデーション
  if (!validateForm()) {
    // 最初のエラーフィールドにフォーカス
    const firstError = form.querySelector('.ir-form-error');
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // バリデーション成功時の処理
  // ...
});
```

### リアルタイムバリデーション
```typescript
// リアルタイムバリデーション
const setupRealTimeValidation = () => {
  const form = document.getElementById('inquiry-form-form') as HTMLFormElement;
  if (!form) return;
  
  const fields = form.querySelectorAll('input, textarea, select');
  
  fields.forEach(field => {
    // 入力時のバリデーション
    field.addEventListener('input', () => {
      validateField(field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement);
    });
    
    // フォーカスアウト時のバリデーション
    field.addEventListener('blur', () => {
      validateField(field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement);
    });
  });
};
```

## ⚠️ リファクタリング時の注意点

1. **バリデーション関数**: 現在のバリデーションロジックを維持
2. **エラー表示**: 現在のエラー表示UIを維持
3. **型定義**: FieldValidation型の整合性を維持
4. **リアルタイム検証**: 現在のリアルタイム検証機能を維持
5. **エラーハンドリング**: 現在のエラーハンドリングを維持

## 📁 関連ファイル

- `src/components/FormEditor.tsx` - バリデーション設定UI
- `src/shared/types/index.ts` - 型定義
- `src/shared/utils/dataManager.ts` - バリデーション生成機能

## 🔗 関連機能

- **フィールド管理**: フィールドのバリデーション設定
- **フォーム生成**: バリデーション機能の生成
- **エラーハンドリング**: エラーの表示・処理
- **ユーザー体験**: バリデーションによるUX向上

## 📝 テストケース

### 正常系
1. 必須項目のチェック
2. 文字数制限のチェック
3. メール形式のチェック
4. パターンマッチングのチェック
5. 選択項目のチェック

### 異常系
1. 無効な入力値
2. バリデーションエラー
3. エラーメッセージの表示
4. フォーム送信の阻止

## 🚀 改善提案

1. **カスタムバリデーション**: ユーザー定義バリデーション
2. **バリデーションテンプレート**: よく使われるバリデーションのテンプレート
3. **非同期バリデーション**: サーバーサイドバリデーション
4. **バリデーション履歴**: バリデーションエラーの履歴
5. **バリデーション統計**: バリデーションエラーの統計
6. **バリデーション最適化**: パフォーマンスの最適化
