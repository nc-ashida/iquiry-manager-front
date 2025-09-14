# 埋め込みコード生成機能

フォームの埋め込みコード生成機能です。

## 📋 機能概要

フォームを外部サイトに埋め込むためのHTMLコードを生成し、フォームの埋め込みを可能にします。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/shared/utils/dataManager.ts`

### 埋め込みコード生成関数
```typescript
// 埋め込みコード生成関数
export const generateEmbedCode = (form: Form): string => {
  const formElementId = `inquiry-form-${form.id}`;
  const html = generateFormHTML(form, formElementId);
  const css = generateFormCSS(form);
  const javascript = generateFormJavaScript(form, formElementId);
  
  const embedCode = `
<!-- Inquiry Relation Form: ${form.name} -->
<div id="${formElementId}">
  <style>
    ${css}
  </style>
  ${html}
  <script>
    ${javascript}
  </script>
</div>
<!-- End Inquiry Relation Form -->`;

  return embedCode;
};
```

## 🎯 主要機能

### 1. 基本的な埋め込みコード生成
```typescript
// 基本的な埋め込みコード生成
const generateBasicEmbedCode = (form: Form): string => {
  const formElementId = `inquiry-form-${form.id}`;
  const html = generateFormHTML(form, formElementId);
  const css = generateFormCSS(form);
  const javascript = generateFormJavaScript(form, formElementId);
  
  return `
<!-- Inquiry Relation Form: ${form.name} -->
<div id="${formElementId}">
  <style>
    ${css}
  </style>
  ${html}
  <script>
    ${javascript}
  </script>
</div>
<!-- End Inquiry Relation Form -->`;
};
```

### 2. 外部CSSファイルの埋め込みコード生成
```typescript
// 外部CSSファイルの埋め込みコード生成
export const generateExternalCSSEmbedCode = (form: Form, cssUrl: string): string => {
  const formElementId = `inquiry-form-${form.id}`;
  const html = generateFormHTML(form, formElementId);
  const javascript = generateFormJavaScript(form, formElementId);
  
  return `
<!-- Inquiry Relation Form: ${form.name} -->
<link rel="stylesheet" href="${cssUrl}">
<div id="${formElementId}">
  ${html}
  <script>
    ${javascript}
  </script>
</div>
<!-- End Inquiry Relation Form -->`;
};
```

### 3. 外部JavaScriptファイルの埋め込みコード生成
```typescript
// 外部JavaScriptファイルの埋め込みコード生成
export const generateExternalJSEmbedCode = (form: Form, jsUrl: string): string => {
  const formElementId = `inquiry-form-${form.id}`;
  const html = generateFormHTML(form, formElementId);
  const css = generateFormCSS(form);
  
  return `
<!-- Inquiry Relation Form: ${form.name} -->
<div id="${formElementId}">
  <style>
    ${css}
  </style>
  ${html}
  <script src="${jsUrl}"></script>
</div>
<!-- End Inquiry Relation Form -->`;
};
```

### 4. 外部ファイルの埋め込みコード生成
```typescript
// 外部ファイルの埋め込みコード生成
export const generateExternalFilesEmbedCode = (form: Form, cssUrl: string, jsUrl: string): string => {
  const formElementId = `inquiry-form-${form.id}`;
  const html = generateFormHTML(form, formElementId);
  
  return `
<!-- Inquiry Relation Form: ${form.name} -->
<link rel="stylesheet" href="${cssUrl}">
<div id="${formElementId}">
  ${html}
  <script src="${jsUrl}"></script>
</div>
<!-- End Inquiry Relation Form -->`;
};
```

### 5. インライン埋め込みコード生成
```typescript
// インライン埋め込みコード生成
export const generateInlineEmbedCode = (form: Form): string => {
  const formElementId = `inquiry-form-${form.id}`;
  const html = generateFormHTML(form, formElementId);
  const css = generateFormCSS(form);
  const javascript = generateFormJavaScript(form, formElementId);
  
  return `
<!-- Inquiry Relation Form: ${form.name} -->
<div id="${formElementId}">
  <style>
    ${css}
  </style>
  ${html}
  <script>
    ${javascript}
  </script>
</div>
<!-- End Inquiry Relation Form -->`;
};
```

## 🔄 埋め込みコード生成の使用例

### 1. 基本的な埋め込みコード生成
```typescript
// 基本的な埋め込みコード生成
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

const embedCode = generateEmbedCode(form);
console.log(embedCode);
```

### 2. 外部CSSファイルの埋め込みコード生成
```typescript
// 外部CSSファイルの埋め込みコード生成
const cssUrl = 'https://example.com/css/form.css';
const embedCode = generateExternalCSSEmbedCode(form, cssUrl);
console.log(embedCode);
```

### 3. 外部JavaScriptファイルの埋め込みコード生成
```typescript
// 外部JavaScriptファイルの埋め込みコード生成
const jsUrl = 'https://example.com/js/form.js';
const embedCode = generateExternalJSEmbedCode(form, jsUrl);
console.log(embedCode);
```

### 4. 外部ファイルの埋め込みコード生成
```typescript
// 外部ファイルの埋め込みコード生成
const cssUrl = 'https://example.com/css/form.css';
const jsUrl = 'https://example.com/js/form.js';
const embedCode = generateExternalFilesEmbedCode(form, cssUrl, jsUrl);
console.log(embedCode);
```

### 5. インライン埋め込みコード生成
```typescript
// インライン埋め込みコード生成
const embedCode = generateInlineEmbedCode(form);
console.log(embedCode);
```

## 🔄 埋め込みコード生成の最適化

### 1. 埋め込みコードの最適化
```typescript
// 埋め込みコードの最適化
export const optimizeEmbedCode = (embedCode: string): string => {
  // 不要な空白の削除
  let optimized = embedCode.replace(/\s+/g, ' ').trim();
  
  // 不要な改行の削除
  optimized = optimized.replace(/\n\s*\n/g, '\n');
  
  // 不要なタブの削除
  optimized = optimized.replace(/\t/g, '');
  
  // 不要なコメントの削除
  optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
  
  return optimized;
};
```

### 2. 埋め込みコードの圧縮
```typescript
// 埋め込みコードの圧縮
export const compressEmbedCode = (embedCode: string): string => {
  // コメントの削除
  let compressed = embedCode.replace(/<!--[\s\S]*?-->/g, '');
  
  // 不要な空白の削除
  compressed = compressed.replace(/\s+/g, ' ').trim();
  
  // 不要な改行の削除
  compressed = compressed.replace(/\n/g, '');
  
  // 不要なタブの削除
  compressed = compressed.replace(/\t/g, '');
  
  return compressed;
};
```

### 3. 埋め込みコードの検証
```typescript
// 埋め込みコードの検証
export const validateEmbedCode = (embedCode: string): boolean => {
  try {
    // 基本的なHTML構造の検証
    const hasFormElement = embedCode.includes('<div id="inquiry-form-');
    const hasStyleTag = embedCode.includes('<style>');
    const hasScriptTag = embedCode.includes('<script>');
    const hasFormTag = embedCode.includes('<form');
    
    return hasFormElement && hasStyleTag && hasScriptTag && hasFormTag;
  } catch (error) {
    console.error('埋め込みコード検証エラー:', error);
    return false;
  }
};
```

## 🔄 埋め込みコード生成の拡張

### 1. カスタムテンプレートの埋め込みコード生成
```typescript
// カスタムテンプレートの埋め込みコード生成
export const generateCustomTemplateEmbedCode = (form: Form, template: string): string => {
  const formElementId = `inquiry-form-${form.id}`;
  const html = generateFormHTML(form, formElementId);
  const css = generateFormCSS(form);
  const javascript = generateFormJavaScript(form, formElementId);
  
  return template
    .replace('{{formName}}', form.name)
    .replace('{{formId}}', formElementId)
    .replace('{{formHTML}}', html)
    .replace('{{formCSS}}', css)
    .replace('{{formJavaScript}}', javascript);
};
```

### 2. 条件付き埋め込みコード生成
```typescript
// 条件付き埋め込みコード生成
export const generateConditionalEmbedCode = (form: Form, conditions: EmbedConditions): string => {
  const formElementId = `inquiry-form-${form.id}`;
  const html = generateFormHTML(form, formElementId);
  const css = generateFormCSS(form);
  const javascript = generateFormJavaScript(form, formElementId);
  
  let embedCode = `
<!-- Inquiry Relation Form: ${form.name} -->
<div id="${formElementId}">
  <style>
    ${css}
  </style>
  ${html}
  <script>
    ${javascript}
  </script>
</div>
<!-- End Inquiry Relation Form -->`;

  // 条件に基づいて埋め込みコードをカスタマイズ
  if (conditions.includeComments) {
    embedCode = embedCode.replace(/<!--[\s\S]*?-->/g, '');
  }
  
  if (conditions.minify) {
    embedCode = compressEmbedCode(embedCode);
  }
  
  if (conditions.externalCSS) {
    embedCode = generateExternalCSSEmbedCode(form, conditions.cssUrl || '');
  }
  
  if (conditions.externalJS) {
    embedCode = generateExternalJSEmbedCode(form, conditions.jsUrl || '');
  }
  
  return embedCode;
};
```

### 3. レスポンシブ埋め込みコード生成
```typescript
// レスポンシブ埋め込みコード生成
export const generateResponsiveEmbedCode = (form: Form): string => {
  const formElementId = `inquiry-form-${form.id}`;
  const html = generateFormHTML(form, formElementId);
  const css = generateFormCSS(form);
  const javascript = generateFormJavaScript(form, formElementId);
  
  const responsiveCSS = `
    @media (max-width: 768px) {
      .ir-form-container {
        padding: 1rem;
      }
      .ir-form-field {
        margin-bottom: 1rem;
      }
      .ir-form-button {
        width: 100%;
      }
    }
  `;
  
  return `
<!-- Inquiry Relation Form: ${form.name} -->
<div id="${formElementId}">
  <style>
    ${css}
    ${responsiveCSS}
  </style>
  ${html}
  <script>
    ${javascript}
  </script>
</div>
<!-- End Inquiry Relation Form -->`;
};
```

## 🔄 埋め込みコード生成の統計

### 1. 埋め込みコードの統計情報
```typescript
// 埋め込みコードの統計情報
export const getEmbedCodeStats = (embedCode: string): EmbedCodeStats => {
  const stats: EmbedCodeStats = {
    totalLength: embedCode.length,
    htmlLength: 0,
    cssLength: 0,
    jsLength: 0,
    commentLength: 0,
    lineCount: embedCode.split('\n').length,
    hasExternalCSS: embedCode.includes('<link rel="stylesheet"'),
    hasExternalJS: embedCode.includes('<script src="'),
    hasInlineCSS: embedCode.includes('<style>'),
    hasInlineJS: embedCode.includes('<script>')
  };
  
  // HTMLの長さを計算
  const htmlMatch = embedCode.match(/<div id="inquiry-form-[\s\S]*?<\/div>/);
  if (htmlMatch) {
    stats.htmlLength = htmlMatch[0].length;
  }
  
  // CSSの長さを計算
  const cssMatch = embedCode.match(/<style>[\s\S]*?<\/style>/);
  if (cssMatch) {
    stats.cssLength = cssMatch[0].length;
  }
  
  // JavaScriptの長さを計算
  const jsMatch = embedCode.match(/<script>[\s\S]*?<\/script>/);
  if (jsMatch) {
    stats.jsLength = jsMatch[0].length;
  }
  
  // コメントの長さを計算
  const commentMatch = embedCode.match(/<!--[\s\S]*?-->/g);
  if (commentMatch) {
    stats.commentLength = commentMatch.join('').length;
  }
  
  return stats;
};
```

### 2. 埋め込みコードの最適化統計
```typescript
// 埋め込みコードの最適化統計
export const getOptimizationStats = (originalCode: string, optimizedCode: string): OptimizationStats => {
  return {
    originalLength: originalCode.length,
    optimizedLength: optimizedCode.length,
    reductionPercentage: ((originalCode.length - optimizedCode.length) / originalCode.length) * 100,
    compressionRatio: optimizedCode.length / originalCode.length
  };
};
```

## ⚠️ リファクタリング時の注意点

1. **埋め込みコード生成関数**: 現在の埋め込みコード生成関数を維持
2. **外部ファイルの埋め込み**: 現在の外部ファイルの埋め込みを維持
3. **インライン埋め込み**: 現在のインライン埋め込みを維持
4. **埋め込みコードの最適化**: 現在の埋め込みコードの最適化を維持
5. **埋め込みコードの検証**: 現在の埋め込みコードの検証を維持

## 📁 関連ファイル

- `src/shared/utils/dataManager.ts` - メイン実装
- `src/shared/types/index.ts` - 型定義
- `src/components/FormPreview.tsx` - フォームプレビュー

## 🔗 関連機能

- **フォーム管理**: フォームデータの取得
- **HTML生成**: フォームのHTML生成
- **CSS生成**: フォームのCSS生成
- **JavaScript生成**: フォームのJavaScript生成
- **プレビュー機能**: フォームのプレビュー表示

## 📝 テストケース

### 正常系
1. 基本的な埋め込みコード生成
2. 外部CSSファイルの埋め込みコード生成
3. 外部JavaScriptファイルの埋め込みコード生成
4. 外部ファイルの埋め込みコード生成
5. インライン埋め込みコード生成

### 異常系
1. 無効なフォームデータ
2. 埋め込みコード生成の失敗
3. 埋め込みコード検証の失敗
4. 埋め込みコード最適化の失敗

## 🚀 改善提案

1. **埋め込みコード生成の最適化**: パフォーマンスの向上
2. **埋め込みコード生成の拡張**: より多くの機能
3. **埋め込みコード生成の検証**: より詳細な埋め込みコード検証
4. **埋め込みコード生成の圧縮**: より効率的な埋め込みコード圧縮
5. **埋め込みコード生成のテンプレート**: より柔軟な埋め込みコードテンプレート
6. **埋め込みコード生成の統計**: 埋め込みコード生成の統計情報
