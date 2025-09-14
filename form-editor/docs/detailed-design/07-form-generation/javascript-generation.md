# JavaScript生成機能

フォームのJavaScript生成機能です。

## 📋 機能概要

フォームの動作を制御するJavaScriptを生成し、フォームの送信処理やバリデーション機能を実装します。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/shared/utils/dataManager.ts`

### JavaScript生成関数
```typescript
// JavaScript生成関数
export const generateFormJavaScript = (form: Form, formElementId: string): string => {
  const namespace = `ir-form-${form.id}`;
  
  const javascript = `
(function(){
  const form = document.getElementById('${formElementId}');
  if (!form) return;

  // フォーム送信処理
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // バリデーション
    if (!validateForm(form)) {
      return;
    }
    
    // 送信ボタンの無効化
    const submitButton = form.querySelector('.ir-form-submit');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = '送信中...';
    }
    
    try {
      // フォームデータの取得
      const formData = new FormData(form);
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      // ドメイン設定のバリデーション
      const allowedDomains = ${JSON.stringify(form.settings.allowedDomains || [])};
      if (!allowedDomains || allowedDomains.length === 0 || allowedDomains.some(domain => !domain.trim())) {
        alert('エラー: 許可ドメインが設定されていません。フォーム管理者にお問い合わせください。');
        return;
      }
      
      // API送信
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: '${form.id}',
          responses: data,
          senderInfo: {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || ''
          },
          allowedDomains: allowedDomains
        })
      });
      
      if (response.ok) {
        ${form.settings.completionUrl ? 
          `window.location.href = '${form.settings.completionUrl}';` : 
          `alert('送信完了しました。');`
        }
      } else {
        alert('送信に失敗しました。');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('送信に失敗しました。');
    } finally {
      // 送信ボタンの有効化
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = '送信';
      }
    }
  });
  
  // バリデーション関数
  function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  // フィールドバリデーション関数
  function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const fieldId = field.id;
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
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(value)) {
          showFieldError(fieldId, '正しいメールアドレスを入力してください');
          return false;
        }
      }
      
      // 文字数制限チェック
      const minLength = field.getAttribute('minlength');
      const maxLength = field.getAttribute('maxlength');
      
      if (minLength && value.length < parseInt(minLength)) {
        showFieldError(fieldId, \`最低\${minLength}文字以上入力してください\`);
        return false;
      }
      
      if (maxLength && value.length > parseInt(maxLength)) {
        showFieldError(fieldId, \`最大\${maxLength}文字まで入力してください\`);
        return false;
      }
    }
    
    return true;
  }
  
  // エラーメッセージ表示関数
  function showFieldError(fieldId, message) {
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
  }
  
  // エラーメッセージクリア関数
  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // エラークラスを削除
    field.classList.remove('ir-form-error');
    
    // エラーメッセージ要素を削除
    const errorElement = field.parentNode?.querySelector('.ir-form-error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  // リアルタイムバリデーション
  const fields = form.querySelectorAll('input, textarea, select');
  fields.forEach(field => {
    // 入力時のバリデーション
    field.addEventListener('input', () => {
      validateField(field);
    });
    
    // フォーカスアウト時のバリデーション
    field.addEventListener('blur', () => {
      validateField(field);
    });
  });
})();`;

  return javascript;
};
```

## 🎯 主要機能

### 1. フォーム送信処理
```typescript
// フォーム送信処理の生成
const generateFormSubmitHandler = (form: Form): string => {
  return `
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // バリデーション
  if (!validateForm(form)) {
    return;
  }
  
  // 送信ボタンの無効化
  const submitButton = form.querySelector('.ir-form-submit');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
  }
  
  try {
    // フォームデータの取得
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    // API送信
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formId: '${form.id}',
        responses: data,
        senderInfo: {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || ''
        }
      })
    });
    
    if (response.ok) {
      ${form.settings.completionUrl ? 
        `window.location.href = '${form.settings.completionUrl}';` : 
        `alert('送信完了しました。');`
      }
    } else {
      alert('送信に失敗しました。');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('送信に失敗しました。');
  } finally {
    // 送信ボタンの有効化
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = '送信';
    }
  }
});`;
};
```

### 2. バリデーション処理
```typescript
// バリデーション処理の生成
const generateValidationHandler = (): string => {
  return `
// バリデーション関数
function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll('input, textarea, select');
  
  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  return isValid;
}

// フィールドバリデーション関数
function validateField(field) {
  const value = field.value.trim();
  const isRequired = field.hasAttribute('required');
  const fieldId = field.id;
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
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(value)) {
        showFieldError(fieldId, '正しいメールアドレスを入力してください');
        return false;
      }
    }
    
    // 文字数制限チェック
    const minLength = field.getAttribute('minlength');
    const maxLength = field.getAttribute('maxlength');
    
    if (minLength && value.length < parseInt(minLength)) {
      showFieldError(fieldId, \`最低\${minLength}文字以上入力してください\`);
      return false;
    }
    
    if (maxLength && value.length > parseInt(maxLength)) {
      showFieldError(fieldId, \`最大\${maxLength}文字まで入力してください\`);
      return false;
    }
  }
  
  return true;
}`;
};
```

### 3. エラーハンドリング
```typescript
// エラーハンドリングの生成
const generateErrorHandler = (): string => {
  return `
// エラーメッセージ表示関数
function showFieldError(fieldId, message) {
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
}

// エラーメッセージクリア関数
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // エラークラスを削除
  field.classList.remove('ir-form-error');
  
  // エラーメッセージ要素を削除
  const errorElement = field.parentNode?.querySelector('.ir-form-error-message');
  if (errorElement) {
    errorElement.remove();
  }
}`;
};
```

### 4. リアルタイムバリデーション
```typescript
// リアルタイムバリデーションの生成
const generateRealTimeValidation = (): string => {
  return `
// リアルタイムバリデーション
const fields = form.querySelectorAll('input, textarea, select');
fields.forEach(field => {
  // 入力時のバリデーション
  field.addEventListener('input', () => {
    validateField(field);
  });
  
  // フォーカスアウト時のバリデーション
  field.addEventListener('blur', () => {
    validateField(field);
  });
});`;
};
```

### 5. ドメイン検証
```typescript
// ドメイン検証の生成
const generateDomainValidation = (form: Form): string => {
  return `
// ドメイン設定のバリデーション
const allowedDomains = ${JSON.stringify(form.settings.allowedDomains || [])};
if (!allowedDomains || allowedDomains.length === 0 || allowedDomains.some(domain => !domain.trim())) {
  alert('エラー: 許可ドメインが設定されていません。フォーム管理者にお問い合わせください。');
  return;
}`;
};
```

## 🔄 JavaScript生成の使用例

### 1. 基本的なJavaScript生成
```typescript
// 基本的なJavaScript生成
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

const javascript = generateFormJavaScript(form, 'inquiry-form-form');
console.log(javascript);
```

### 2. 複雑なフォームのJavaScript生成
```typescript
// 複雑なフォームのJavaScript生成
const complexForm: Form = {
  id: 'form-2',
  name: '複雑なフォーム',
  description: '複雑なフォームです',
  fields: [
    {
      id: 'field-1',
      type: 'text',
      label: 'お名前',
      placeholder: 'お名前を入力してください',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50
      },
      order: 0
    },
    {
      id: 'field-2',
      type: 'email',
      label: 'メールアドレス',
      placeholder: 'メールアドレスを入力してください',
      required: true,
      order: 1
    },
    {
      id: 'field-3',
      type: 'textarea',
      label: 'お問い合わせ内容',
      placeholder: 'お問い合わせ内容を入力してください',
      required: true,
      validation: {
        minLength: 10,
        maxLength: 1000
      },
      order: 2
    }
  ],
  settings: {
    autoReply: true,
    allowedDomains: ['example.com', 'test.com'],
    completionUrl: 'https://example.com/thank-you'
  },
  styling: defaultFormStyling,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const javascript = generateFormJavaScript(complexForm, 'inquiry-form-form');
console.log(javascript);
```

## 🔄 JavaScript生成の最適化

### 1. JavaScriptの最適化
```typescript
// JavaScriptの最適化
export const optimizeJavaScript = (javascript: string): string => {
  // 不要な空白の削除
  let optimized = javascript.replace(/\s+/g, ' ').trim();
  
  // 不要な改行の削除
  optimized = optimized.replace(/\n\s*\n/g, '\n');
  
  // 不要なタブの削除
  optimized = optimized.replace(/\t/g, '');
  
  // 不要なセミコロンの削除
  optimized = optimized.replace(/;\s*}/g, '}');
  
  return optimized;
};
```

### 2. JavaScriptの圧縮
```typescript
// JavaScriptの圧縮
export const compressJavaScript = (javascript: string): string => {
  // コメントの削除
  let compressed = javascript.replace(/\/\*[\s\S]*?\*\//g, '');
  compressed = compressed.replace(/\/\/.*$/gm, '');
  
  // 不要な空白の削除
  compressed = compressed.replace(/\s+/g, ' ').trim();
  
  // 不要な改行の削除
  compressed = compressed.replace(/\n/g, '');
  
  // 不要なセミコロンの削除
  compressed = compressed.replace(/;\s*}/g, '}');
  
  return compressed;
};
```

### 3. JavaScriptの検証
```typescript
// JavaScriptの検証
export const validateJavaScript = (javascript: string): boolean => {
  try {
    // 基本的なJavaScript構造の検証
    const hasFormHandler = javascript.includes('addEventListener');
    const hasValidation = javascript.includes('validateForm');
    const hasErrorHandler = javascript.includes('showFieldError');
    const hasSubmitHandler = javascript.includes('submit');
    
    return hasFormHandler && hasValidation && hasErrorHandler && hasSubmitHandler;
  } catch (error) {
    console.error('JavaScript検証エラー:', error);
    return false;
  }
};
```

## 🔄 JavaScript生成の拡張

### 1. カスタムバリデーションのJavaScript生成
```typescript
// カスタムバリデーションのJavaScript生成
export const generateCustomValidationJavaScript = (form: Form): string => {
  const customValidations = form.fields
    .filter(field => field.validation?.pattern)
    .map(field => `
// カスタムバリデーション: ${field.label}
function validate${field.id}(value) {
  const pattern = /${field.validation?.pattern}/;
  return pattern.test(value);
}`)
    .join('\n');
  
  return customValidations;
};
```

### 2. 条件付きフィールドのJavaScript生成
```typescript
// 条件付きフィールドのJavaScript生成
export const generateConditionalFieldJavaScript = (form: Form): string => {
  return `
// 条件付きフィールドの表示制御
function toggleConditionalFields() {
  const conditionalFields = form.querySelectorAll('[data-condition-field]');
  
  conditionalFields.forEach(field => {
    const conditionField = field.getAttribute('data-condition-field');
    const conditionValue = field.getAttribute('data-condition-value');
    const conditionOperator = field.getAttribute('data-condition-operator');
    
    const targetField = form.querySelector(\`[name="\${conditionField}"]\`);
    if (targetField) {
      const targetValue = targetField.value;
      let shouldShow = false;
      
      switch (conditionOperator) {
        case 'equals':
          shouldShow = targetValue === conditionValue;
          break;
        case 'not-equals':
          shouldShow = targetValue !== conditionValue;
          break;
        case 'contains':
          shouldShow = targetValue.includes(conditionValue);
          break;
      }
      
      field.style.display = shouldShow ? 'block' : 'none';
    }
  });
}

// 条件付きフィールドのイベントリスナー
const conditionalFields = form.querySelectorAll('[data-condition-field]');
conditionalFields.forEach(field => {
  const conditionField = field.getAttribute('data-condition-field');
  const targetField = form.querySelector(\`[name="\${conditionField}"]\`);
  
  if (targetField) {
    targetField.addEventListener('change', toggleConditionalFields);
  }
});`;
};
```

### 3. ファイルアップロードのJavaScript生成
```typescript
// ファイルアップロードのJavaScript生成
export const generateFileUploadJavaScript = (form: Form): string => {
  if (!form.settings.fileUpload?.enabled) return '';
  
  return `
// ファイルアップロードの処理
function handleFileUpload(files) {
  const maxFiles = ${form.settings.fileUpload.maxFiles};
  const maxFileSize = ${form.settings.fileUpload.maxFileSize} * 1024 * 1024; // MB to bytes
  
  if (files.length > maxFiles) {
    alert(\`最大\${maxFiles}ファイルまでアップロードできます\`);
    return false;
  }
  
  for (let file of files) {
    if (file.size > maxFileSize) {
      alert(\`\${file.name}のサイズが大きすぎます。最大\${form.settings.fileUpload.maxFileSize}MBまでアップロードできます。\`);
      return false;
    }
  }
  
  return true;
}

// ファイルアップロードのイベントリスナー
const fileInputs = form.querySelectorAll('input[type="file"]');
fileInputs.forEach(input => {
  input.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (!handleFileUpload(files)) {
        e.target.value = '';
      }
    }
  });
});`;
};
```

## ⚠️ リファクタリング時の注意点

1. **JavaScript生成関数**: 現在のJavaScript生成関数を維持
2. **バリデーション処理**: 現在のバリデーション処理を維持
3. **エラーハンドリング**: 現在のエラーハンドリングを維持
4. **リアルタイムバリデーション**: 現在のリアルタイムバリデーションを維持
5. **ドメイン検証**: 現在のドメイン検証を維持

## 📁 関連ファイル

- `src/shared/utils/dataManager.ts` - メイン実装
- `src/shared/types/index.ts` - 型定義
- `src/components/FormPreview.tsx` - フォームプレビュー

## 🔗 関連機能

- **フォーム管理**: フォームデータの取得
- **バリデーション**: フォームバリデーション
- **フォーム生成**: フォームのJavaScript生成
- **プレビュー機能**: フォームのプレビュー表示

## 📝 テストケース

### 正常系
1. 基本的なJavaScript生成
2. バリデーション処理の生成
3. エラーハンドリングの生成
4. リアルタイムバリデーションの生成
5. ドメイン検証の生成

### 異常系
1. 無効なフォームデータ
2. JavaScript生成の失敗
3. JavaScript検証の失敗
4. JavaScript最適化の失敗

## 🚀 改善提案

1. **JavaScript生成の最適化**: パフォーマンスの向上
2. **JavaScript生成の拡張**: より多くの機能
3. **JavaScript生成の検証**: より詳細なJavaScript検証
4. **JavaScript生成の圧縮**: より効率的なJavaScript圧縮
5. **JavaScript生成のテンプレート**: より柔軟なJavaScriptテンプレート
6. **JavaScript生成の統計**: JavaScript生成の統計情報
