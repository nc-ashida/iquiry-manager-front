# HTML生成機能

フォームのHTML生成機能です。

## 📋 機能概要

フォームデータからHTMLを生成し、埋め込み可能なフォームを作成します。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/shared/utils/dataManager.ts`

### HTML生成関数
```typescript
// HTML生成関数
export const generateFormHTML = (form: Form): string => {
  const namespace = `ir-form-${form.id}`;
  const formId = `${namespace}-container`;
  const formElementId = `${namespace}-form`;

  const html = `
<!-- 問合せフォーム: ${form.name} -->
<div id="${formId}" class="ir-form-container">
  <form id="${formElementId}" class="ir-form">
    ${form.fields.map(field => generateFieldHTML(field, namespace)).join('\n    ')}
    ${generateSubmitButton()}
  </form>
</div>`;

  return html;
};
```

## 🎯 主要機能

### 1. フィールドHTML生成
```typescript
// フィールドHTML生成
export const generateFieldHTML = (field: FormField, namespace: string): string => {
  const fieldId = `${namespace}-field-${field.id}`;
  const required = field.required ? 'required' : '';

  switch (field.type) {
    case 'text':
      return generateTextFieldHTML(field, fieldId, required);
    case 'textarea':
      return generateTextareaFieldHTML(field, fieldId, required);
    case 'select':
      return generateSelectFieldHTML(field, fieldId, required);
    case 'radio':
      return generateRadioFieldHTML(field, fieldId, required);
    case 'checkbox':
      return generateCheckboxFieldHTML(field, fieldId, required);
    case 'file':
      return generateFileFieldHTML(field, fieldId, required);
    default:
      return '';
  }
};
```

### 2. テキストフィールドHTML生成
```typescript
// テキストフィールドHTML生成
const generateTextFieldHTML = (field: FormField, fieldId: string, required: string): string => {
  return `<div class="ir-form-field">
    <label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label>
    <input type="text" id="${fieldId}" name="${field.id}" class="ir-form-input" placeholder="${field.placeholder || ''}" ${required}>
  </div>`;
};
```

### 3. 長文テキストフィールドHTML生成
```typescript
// 長文テキストフィールドHTML生成
const generateTextareaFieldHTML = (field: FormField, fieldId: string, required: string): string => {
  return `<div class="ir-form-field">
    <label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label>
    <textarea id="${fieldId}" name="${field.id}" class="ir-form-textarea" placeholder="${field.placeholder || ''}" ${required}></textarea>
  </div>`;
};
```

### 4. 選択肢フィールドHTML生成
```typescript
// 選択肢フィールドHTML生成
const generateSelectFieldHTML = (field: FormField, fieldId: string, required: string): string => {
  const options = field.options?.map(option => 
    `<option value="${option}">${option}</option>`
  ).join('') || '';

  return `<div class="ir-form-field">
    <label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label>
    <select id="${fieldId}" name="${field.id}" class="ir-form-select" ${required}>
      <option value="">選択してください</option>
      ${options}
    </select>
  </div>`;
};
```

### 5. ラジオボタンフィールドHTML生成
```typescript
// ラジオボタンフィールドHTML生成
const generateRadioFieldHTML = (field: FormField, fieldId: string, required: string): string => {
  const options = field.options?.map(option => 
    `<label class="ir-form-radio-label">
      <input type="radio" name="${field.id}" value="${option}" class="ir-form-radio" ${required}>
      <span class="ir-form-radio-text">${option}</span>
    </label>`
  ).join('') || '';

  return `<div class="ir-form-field">
    <fieldset class="ir-form-fieldset">
      <legend class="ir-form-legend">${field.label}${field.required ? ' *' : ''}</legend>
      ${options}
    </fieldset>
  </div>`;
};
```

### 6. チェックボックスフィールドHTML生成
```typescript
// チェックボックスフィールドHTML生成
const generateCheckboxFieldHTML = (field: FormField, fieldId: string, required: string): string => {
  const options = field.options?.map(option => 
    `<label class="ir-form-checkbox-label">
      <input type="checkbox" name="${field.id}" value="${option}" class="ir-form-checkbox">
      <span class="ir-form-checkbox-text">${option}</span>
    </label>`
  ).join('') || '';

  return `<div class="ir-form-field">
    <fieldset class="ir-form-fieldset">
      <legend class="ir-form-legend">${field.label}${field.required ? ' *' : ''}</legend>
      ${options}
    </fieldset>
  </div>`;
};
```

### 7. ファイルフィールドHTML生成
```typescript
// ファイルフィールドHTML生成
const generateFileFieldHTML = (field: FormField, fieldId: string, required: string): string => {
  const multiple = field.multiple ? 'multiple' : '';
  
  return `<div class="ir-form-field">
    <label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label>
    <input type="file" id="${fieldId}" name="${field.id}" class="ir-form-file" ${multiple} ${required}>
  </div>`;
};
```

### 8. 送信ボタンHTML生成
```typescript
// 送信ボタンHTML生成
const generateSubmitButton = (): string => {
  return `<button type="submit" class="ir-form-submit">送信</button>`;
};
```

## 🔄 HTML生成の使用例

### 1. 基本的なHTML生成
```typescript
// 基本的なHTML生成
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
    },
    {
      id: 'field-3',
      type: 'textarea',
      label: 'お問い合わせ内容',
      placeholder: 'お問い合わせ内容を入力してください',
      required: true,
      order: 2
    }
  ],
  settings: defaultFormSettings,
  styling: defaultFormStyling,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const html = generateFormHTML(form);
console.log(html);
```

### 2. 複雑なフォームのHTML生成
```typescript
// 複雑なフォームのHTML生成
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
      order: 0
    },
    {
      id: 'field-2',
      type: 'select',
      label: '都道府県',
      required: true,
      options: ['東京都', '大阪府', '愛知県', '福岡県'],
      order: 1
    },
    {
      id: 'field-3',
      type: 'radio',
      label: '性別',
      required: true,
      options: ['男性', '女性', 'その他'],
      order: 2
    },
    {
      id: 'field-4',
      type: 'checkbox',
      label: '興味のある分野',
      required: false,
      options: ['技術', 'デザイン', 'マーケティング', '営業'],
      order: 3
    },
    {
      id: 'field-5',
      type: 'file',
      label: '添付ファイル',
      required: false,
      multiple: true,
      order: 4
    }
  ],
  settings: defaultFormSettings,
  styling: defaultFormStyling,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const html = generateFormHTML(complexForm);
console.log(html);
```

## 🔄 HTML生成の最適化

### 1. HTMLの最適化
```typescript
// HTMLの最適化
export const optimizeHTML = (html: string): string => {
  // 不要な空白の削除
  let optimized = html.replace(/\s+/g, ' ').trim();
  
  // 不要な改行の削除
  optimized = optimized.replace(/\n\s*\n/g, '\n');
  
  // 不要なタブの削除
  optimized = optimized.replace(/\t/g, '');
  
  return optimized;
};
```

### 2. HTMLの圧縮
```typescript
// HTMLの圧縮
export const compressHTML = (html: string): string => {
  // コメントの削除
  let compressed = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // 不要な空白の削除
  compressed = compressed.replace(/\s+/g, ' ').trim();
  
  // 不要な改行の削除
  compressed = compressed.replace(/\n/g, '');
  
  return compressed;
};
```

### 3. HTMLの検証
```typescript
// HTMLの検証
export const validateHTML = (html: string): boolean => {
  try {
    // 基本的なHTML構造の検証
    const hasForm = html.includes('<form');
    const hasSubmitButton = html.includes('<button type="submit"');
    const hasFields = html.includes('<input') || html.includes('<textarea') || html.includes('<select');
    
    return hasForm && hasSubmitButton && hasFields;
  } catch (error) {
    console.error('HTML検証エラー:', error);
    return false;
  }
};
```

## 🔄 HTML生成の拡張

### 1. カスタムフィールドのHTML生成
```typescript
// カスタムフィールドのHTML生成
export const generateCustomFieldHTML = (field: FormField, namespace: string): string => {
  const fieldId = `${namespace}-field-${field.id}`;
  const required = field.required ? 'required' : '';
  
  // カスタムフィールドのHTML生成
  return `<div class="ir-form-field ir-form-field-custom">
    <label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label>
    <div class="ir-form-custom-field" data-field-type="${field.type}">
      <!-- カスタムフィールドの内容 -->
    </div>
  </div>`;
};
```

### 2. 条件付きフィールドのHTML生成
```typescript
// 条件付きフィールドのHTML生成
export const generateConditionalFieldHTML = (field: FormField, namespace: string, conditions: any[]): string => {
  const fieldId = `${namespace}-field-${field.id}`;
  const required = field.required ? 'required' : '';
  
  // 条件付きフィールドのHTML生成
  const conditionsHTML = conditions.map(condition => 
    `data-condition-field="${condition.field}" data-condition-value="${condition.value}" data-condition-operator="${condition.operator}"`
  ).join(' ');
  
  return `<div class="ir-form-field ir-form-field-conditional" ${conditionsHTML}>
    <label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label>
    ${generateFieldHTML(field, namespace)}
  </div>`;
};
```

### 3. バリデーション付きフィールドのHTML生成
```typescript
// バリデーション付きフィールドのHTML生成
export const generateValidatedFieldHTML = (field: FormField, namespace: string): string => {
  const fieldId = `${namespace}-field-${field.id}`;
  const required = field.required ? 'required' : '';
  
  // バリデーション属性の生成
  const validationAttributes = [];
  if (field.validation?.minLength) {
    validationAttributes.push(`minlength="${field.validation.minLength}"`);
  }
  if (field.validation?.maxLength) {
    validationAttributes.push(`maxlength="${field.validation.maxLength}"`);
  }
  if (field.validation?.pattern) {
    validationAttributes.push(`pattern="${field.validation.pattern}"`);
  }
  
  const validationHTML = validationAttributes.join(' ');
  
  return `<div class="ir-form-field ir-form-field-validated">
    <label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label>
    ${generateFieldHTML(field, namespace).replace('>', ` ${validationHTML}>`)}
  </div>`;
};
```

## ⚠️ リファクタリング時の注意点

1. **HTML生成関数**: 現在のHTML生成関数を維持
2. **フィールドHTML生成**: 現在のフィールドHTML生成を維持
3. **HTML最適化**: 現在のHTML最適化機能を維持
4. **HTML検証**: 現在のHTML検証機能を維持
5. **HTML拡張**: 現在のHTML拡張機能を維持

## 📁 関連ファイル

- `src/shared/utils/dataManager.ts` - メイン実装
- `src/shared/types/index.ts` - 型定義
- `src/components/FormPreview.tsx` - フォームプレビュー

## 🔗 関連機能

- **フォーム管理**: フォームデータの取得
- **フィールド管理**: フィールドデータの取得
- **フォーム生成**: フォームのHTML生成
- **プレビュー機能**: フォームのプレビュー表示

## 📝 テストケース

### 正常系
1. 基本的なHTML生成
2. 複雑なフォームのHTML生成
3. カスタムフィールドのHTML生成
4. 条件付きフィールドのHTML生成
5. バリデーション付きフィールドのHTML生成

### 異常系
1. 無効なフォームデータ
2. HTML生成の失敗
3. HTML検証の失敗
4. HTML最適化の失敗

## 🚀 改善提案

1. **HTML生成の最適化**: パフォーマンスの向上
2. **HTML生成の拡張**: より多くのフィールドタイプ
3. **HTML生成の検証**: より詳細なHTML検証
4. **HTML生成の圧縮**: より効率的なHTML圧縮
5. **HTML生成のテンプレート**: より柔軟なHTMLテンプレート
6. **HTML生成の統計**: HTML生成の統計情報
