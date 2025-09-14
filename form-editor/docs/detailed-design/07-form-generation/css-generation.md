# CSS生成機能

フォームのCSS生成機能です。

## 📋 機能概要

フォームのスタイリング設定からCSSを生成し、フォームの見た目をカスタマイズします。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/shared/utils/dataManager.ts`

### CSS生成関数
```typescript
// CSS生成関数
export const generateFormCSS = (form: Form): string => {
  const namespace = `ir-form-${form.id}`;
  
  const css = `
/* 問合せフォーム: ${form.name} */
.${namespace}-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.${namespace}-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.${namespace}-field {
  margin-bottom: 20px;
}

.${namespace}-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.${namespace}-input,
.${namespace}-textarea,
.${namespace}-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.${namespace}-input:focus,
.${namespace}-textarea:focus,
.${namespace}-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.${namespace}-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.${namespace}-legend {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.${namespace}-radio-label,
.${namespace}-checkbox-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
}

.${namespace}-radio,
.${namespace}-checkbox {
  margin-right: 8px;
}

.${namespace}-radio-text,
.${namespace}-checkbox-text {
  font-size: 14px;
}

.${namespace}-submit {
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-start;
}

.${namespace}-submit:hover {
  background-color: #0056b3;
}

.${namespace}-submit:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* 必須項目のスタイル */
.${namespace}-label:has(+ .${namespace}-input[required]),
.${namespace}-legend:has(+ * [required]) {
  color: #dc3545;
}

.${namespace}-label:has(+ .${namespace}-input[required])::after,
.${namespace}-legend:has(+ * [required])::after {
  content: " *";
  color: #dc3545;
}

/* バリデーションエラーのスタイル */
.${namespace}-error {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
}

.${namespace}-error:focus {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
}

.${namespace}-error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.${namespace}-error-message::before {
  content: "⚠";
  font-size: 14px;
}

/* 送信ボタンの状態 */
.${namespace}-submit:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

/* フォーカス時のアクセシビリティ向上 */
.${namespace}-input:focus,
.${namespace}-textarea:focus,
.${namespace}-select:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* ラジオボタン・チェックボックスのアクセシビリティ */
.${namespace}-radio:focus,
.${namespace}-checkbox:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}`;

  return css;
};
```

## 🎯 主要機能

### 1. テーマベースのCSS生成
```typescript
// テーマベースのCSS生成
export const generateThemeCSS = (form: Form): string => {
  const namespace = `ir-form-${form.id}`;
  const theme = form.styling.theme;
  
  let css = '';
  
  switch (theme) {
    case 'light':
      css = generateLightThemeCSS(namespace);
      break;
    case 'dark':
      css = generateDarkThemeCSS(namespace);
      break;
    case 'custom':
      css = generateCustomThemeCSS(namespace, form.styling);
      break;
    default:
      css = generateLightThemeCSS(namespace);
  }
  
  return css;
};
```

### 2. ライトテーマのCSS生成
```typescript
// ライトテーマのCSS生成
const generateLightThemeCSS = (namespace: string): string => {
  return `
.${namespace}-container {
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #e0e0e0;
}

.${namespace}-label {
  color: #333333;
}

.${namespace}-input,
.${namespace}-textarea,
.${namespace}-select {
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #cccccc;
}

.${namespace}-input:focus,
.${namespace}-textarea:focus,
.${namespace}-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.${namespace}-submit {
  background-color: #007bff;
  color: #ffffff;
}

.${namespace}-submit:hover {
  background-color: #0056b3;
}`;
};
```

### 3. ダークテーマのCSS生成
```typescript
// ダークテーマのCSS生成
const generateDarkThemeCSS = (namespace: string): string => {
  return `
.${namespace}-container {
  background-color: #1a1a1a;
  color: #ffffff;
  border: 1px solid #333333;
}

.${namespace}-label {
  color: #ffffff;
}

.${namespace}-input,
.${namespace}-textarea,
.${namespace}-select {
  background-color: #2d2d2d;
  color: #ffffff;
  border: 1px solid #555555;
}

.${namespace}-input:focus,
.${namespace}-textarea:focus,
.${namespace}-select:focus {
  border-color: #4dabf7;
  box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.25);
}

.${namespace}-submit {
  background-color: #4dabf7;
  color: #ffffff;
}

.${namespace}-submit:hover {
  background-color: #339af0;
}`;
};
```

### 4. カスタムテーマのCSS生成
```typescript
// カスタムテーマのCSS生成
const generateCustomThemeCSS = (namespace: string, styling: FormStyling): string => {
  const primaryColor = styling.primaryColor || '#007bff';
  const secondaryColor = styling.secondaryColor || '#6c757d';
  const fontFamily = styling.fontFamily || 'Arial, sans-serif';
  
  return `
.${namespace}-container {
  font-family: ${fontFamily};
}

.${namespace}-input,
.${namespace}-textarea,
.${namespace}-select {
  border-color: ${secondaryColor};
}

.${namespace}-input:focus,
.${namespace}-textarea:focus,
.${namespace}-select:focus {
  border-color: ${primaryColor};
  box-shadow: 0 0 0 2px ${primaryColor}25;
}

.${namespace}-submit {
  background-color: ${primaryColor};
  color: #ffffff;
}

.${namespace}-submit:hover {
  background-color: ${darkenColor(primaryColor, 10)};
}

.${namespace}-label {
  color: ${primaryColor};
}`;
};
```

### 5. レスポンシブCSS生成
```typescript
// レスポンシブCSS生成
export const generateResponsiveCSS = (namespace: string): string => {
  return `
/* モバイル対応 */
@media (max-width: 768px) {
  .${namespace}-container {
    padding: 15px;
    margin: 10px;
  }
  
  .${namespace}-form {
    gap: 15px;
  }
  
  .${namespace}-field {
    margin-bottom: 15px;
  }
  
  .${namespace}-input,
  .${namespace}-textarea,
  .${namespace}-select {
    padding: 8px;
    font-size: 16px; /* iOS Safari のズーム防止 */
  }
  
  .${namespace}-submit {
    width: 100%;
    padding: 15px;
    font-size: 18px;
  }
}

/* タブレット対応 */
@media (min-width: 769px) and (max-width: 1024px) {
  .${namespace}-container {
    padding: 20px;
    margin: 20px auto;
  }
  
  .${namespace}-form {
    gap: 18px;
  }
}

/* デスクトップ対応 */
@media (min-width: 1025px) {
  .${namespace}-container {
    padding: 24px;
    margin: 0 auto;
  }
  
  .${namespace}-form {
    gap: 20px;
  }
}`;
};
```

### 6. アニメーションCSS生成
```typescript
// アニメーションCSS生成
export const generateAnimationCSS = (namespace: string): string => {
  return `
/* アニメーション */
.${namespace}-container {
  animation: fadeIn 0.5s ease-in-out;
}

.${namespace}-field {
  animation: slideIn 0.3s ease-out;
}

.${namespace}-submit {
  transition: all 0.3s ease;
}

.${namespace}-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.${namespace}-input:focus,
.${namespace}-textarea:focus,
.${namespace}-select:focus {
  transition: all 0.3s ease;
}

/* キーフレーム */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}`;
};
```

## 🔄 CSS生成の使用例

### 1. 基本的なCSS生成
```typescript
// 基本的なCSS生成
const form: Form = {
  id: 'form-1',
  name: 'お問い合わせフォーム',
  description: 'お問い合わせフォームです',
  fields: [],
  settings: defaultFormSettings,
  styling: {
    css: '',
    theme: 'light',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    fontFamily: 'Arial, sans-serif'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const css = generateFormCSS(form);
console.log(css);
```

### 2. カスタムテーマのCSS生成
```typescript
// カスタムテーマのCSS生成
const customForm: Form = {
  id: 'form-2',
  name: 'カスタムフォーム',
  description: 'カスタムテーマのフォームです',
  fields: [],
  settings: defaultFormSettings,
  styling: {
    css: '',
    theme: 'custom',
    primaryColor: '#28a745',
    secondaryColor: '#6c757d',
    fontFamily: 'Helvetica, Arial, sans-serif'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const css = generateFormCSS(customForm);
console.log(css);
```

### 3. レスポンシブCSS生成
```typescript
// レスポンシブCSS生成
const responsiveForm: Form = {
  id: 'form-3',
  name: 'レスポンシブフォーム',
  description: 'レスポンシブ対応のフォームです',
  fields: [],
  settings: defaultFormSettings,
  styling: {
    css: '',
    theme: 'light',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    fontFamily: 'Arial, sans-serif'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const css = generateFormCSS(responsiveForm);
const responsiveCSS = generateResponsiveCSS(`ir-form-${responsiveForm.id}`);
const fullCSS = css + '\n' + responsiveCSS;
console.log(fullCSS);
```

## 🔄 CSS生成の最適化

### 1. CSSの最適化
```typescript
// CSSの最適化
export const optimizeCSS = (css: string): string => {
  // 不要な空白の削除
  let optimized = css.replace(/\s+/g, ' ').trim();
  
  // 不要な改行の削除
  optimized = optimized.replace(/\n\s*\n/g, '\n');
  
  // 不要なタブの削除
  optimized = optimized.replace(/\t/g, '');
  
  // 不要なセミコロンの削除
  optimized = optimized.replace(/;\s*}/g, '}');
  
  return optimized;
};
```

### 2. CSSの圧縮
```typescript
// CSSの圧縮
export const compressCSS = (css: string): string => {
  // コメントの削除
  let compressed = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 不要な空白の削除
  compressed = compressed.replace(/\s+/g, ' ').trim();
  
  // 不要な改行の削除
  compressed = compressed.replace(/\n/g, '');
  
  // 不要なセミコロンの削除
  compressed = compressed.replace(/;\s*}/g, '}');
  
  return compressed;
};
```

### 3. CSSの検証
```typescript
// CSSの検証
export const validateCSS = (css: string): boolean => {
  try {
    // 基本的なCSS構造の検証
    const hasContainer = css.includes('.ir-form-container');
    const hasForm = css.includes('.ir-form');
    const hasField = css.includes('.ir-form-field');
    const hasSubmit = css.includes('.ir-form-submit');
    
    return hasContainer && hasForm && hasField && hasSubmit;
  } catch (error) {
    console.error('CSS検証エラー:', error);
    return false;
  }
};
```

## 🔄 CSS生成の拡張

### 1. カスタムプロパティのCSS生成
```typescript
// カスタムプロパティのCSS生成
export const generateCustomPropertiesCSS = (namespace: string, styling: FormStyling): string => {
  return `
:root {
  --${namespace}-primary-color: ${styling.primaryColor || '#007bff'};
  --${namespace}-secondary-color: ${styling.secondaryColor || '#6c757d'};
  --${namespace}-font-family: ${styling.fontFamily || 'Arial, sans-serif'};
  --${namespace}-border-radius: 4px;
  --${namespace}-padding: 10px;
  --${namespace}-margin: 20px;
}

.${namespace}-container {
  --primary-color: var(--${namespace}-primary-color);
  --secondary-color: var(--${namespace}-secondary-color);
  --font-family: var(--${namespace}-font-family);
  --border-radius: var(--${namespace}-border-radius);
  --padding: var(--${namespace}-padding);
  --margin: var(--${namespace}-margin);
}`;
};
```

### 2. ダークモード対応のCSS生成
```typescript
// ダークモード対応のCSS生成
export const generateDarkModeCSS = (namespace: string): string => {
  return `
/* ダークモード対応 */
@media (prefers-color-scheme: dark) {
  .${namespace}-container {
    background-color: #1a1a1a;
    color: #ffffff;
    border-color: #333333;
  }
  
  .${namespace}-label {
    color: #ffffff;
  }
  
  .${namespace}-input,
  .${namespace}-textarea,
  .${namespace}-select {
    background-color: #2d2d2d;
    color: #ffffff;
    border-color: #555555;
  }
  
  .${namespace}-input:focus,
  .${namespace}-textarea:focus,
  .${namespace}-select:focus {
    border-color: #4dabf7;
    box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.25);
  }
}

/* ダークモードクラス */
.${namespace}-container.dark-mode {
  background-color: #1a1a1a;
  color: #ffffff;
  border-color: #333333;
}

.${namespace}-container.dark-mode .${namespace}-label {
  color: #ffffff;
}

.${namespace}-container.dark-mode .${namespace}-input,
.${namespace}-container.dark-mode .${namespace}-textarea,
.${namespace}-container.dark-mode .${namespace}-select {
  background-color: #2d2d2d;
  color: #ffffff;
  border-color: #555555;
}`;
};
```

### 3. アクセシビリティ対応のCSS生成
```typescript
// アクセシビリティ対応のCSS生成
export const generateAccessibilityCSS = (namespace: string): string => {
  return `
/* アクセシビリティ対応 */
.${namespace}-container {
  /* フォーカス表示の改善 */
  *:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
  
  /* ハイコントラストモード対応 */
  @media (prefers-contrast: high) {
    .${namespace}-input,
    .${namespace}-textarea,
    .${namespace}-select {
      border: 2px solid #000000;
    }
    
    .${namespace}-submit {
      border: 2px solid #000000;
    }
  }
  
  /* アニメーション無効化対応 */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* スクリーンリーダー対応 */
  .${namespace}-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}`;
};
```

## ⚠️ リファクタリング時の注意点

1. **CSS生成関数**: 現在のCSS生成関数を維持
2. **テーマCSS生成**: 現在のテーマCSS生成を維持
3. **レスポンシブCSS生成**: 現在のレスポンシブCSS生成を維持
4. **CSS最適化**: 現在のCSS最適化機能を維持
5. **CSS検証**: 現在のCSS検証機能を維持

## 📁 関連ファイル

- `src/shared/utils/dataManager.ts` - メイン実装
- `src/shared/types/index.ts` - 型定義
- `src/components/FormPreview.tsx` - フォームプレビュー

## 🔗 関連機能

- **フォーム管理**: フォームデータの取得
- **スタイリング管理**: フォームスタイリングの管理
- **フォーム生成**: フォームのCSS生成
- **プレビュー機能**: フォームのプレビュー表示

## 📝 テストケース

### 正常系
1. 基本的なCSS生成
2. テーマベースのCSS生成
3. レスポンシブCSS生成
4. アニメーションCSS生成
5. アクセシビリティCSS生成

### 異常系
1. 無効なスタイリング設定
2. CSS生成の失敗
3. CSS検証の失敗
4. CSS最適化の失敗

## 🚀 改善提案

1. **CSS生成の最適化**: パフォーマンスの向上
2. **CSS生成の拡張**: より多くのテーマオプション
3. **CSS生成の検証**: より詳細なCSS検証
4. **CSS生成の圧縮**: より効率的なCSS圧縮
5. **CSS生成のテンプレート**: より柔軟なCSSテンプレート
6. **CSS生成の統計**: CSS生成の統計情報
