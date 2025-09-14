# フォーム生成機能

フォームのHTML、CSS、JavaScriptを生成し、埋め込みコードを提供する機能です。

## 📋 機能一覧

### 1. HTML生成
- **ファイル**: `src/shared/utils/dataManager.ts` (generateFieldHTML)
- **機能**: フィールドのHTML生成
- **詳細**: [html-generation.md](./html-generation.md)

### 2. CSS生成
- **ファイル**: `src/shared/utils/dataManager.ts` (generateFormScript)
- **機能**: フォームのCSS生成
- **詳細**: [css-generation.md](./css-generation.md)

### 3. JavaScript生成
- **ファイル**: `src/shared/utils/dataManager.ts` (generateFormScript)
- **機能**: フォームのJavaScript生成
- **詳細**: [javascript-generation.md](./javascript-generation.md)

### 4. 埋め込みコード生成
- **ファイル**: `src/components/FormPreview.tsx` (埋め込みコード部分)
- **機能**: 埋め込み用コードの生成
- **詳細**: [embed-codes.md](./embed-codes.md)

## 🔧 主要な実装詳細

### フォーム生成関数
```typescript
export const generateFormScript = (form: Form): string => {
  // 名前空間ベースのID生成（衝突を防ぐため）
  const namespace = `ir-form-${form.id}`;
  const formId = `${namespace}-container`;
  const formElementId = `${namespace}-form`;

  return `
<!-- 問合せフォーム: ${form.name} -->
<div id="${formId}" class="ir-form-container">
  <form id="${formElementId}" class="ir-form">
    ${form.fields.map(field => generateFieldHTML(field, namespace)).join('\n    ')}
    <button type="submit" class="ir-form-submit">送信</button>
  </form>
</div>

<style>
${form.styling.css}
</style>

<script>
${generateFormJavaScript(form, formElementId)}
</script>
`;
};
```

### フィールドHTML生成
```typescript
const generateFieldHTML = (field: FormField, namespace: string): string => {
  const fieldId = `${namespace}-field-${field.id}`;
  const required = field.required ? 'required' : '';

  switch (field.type) {
    case 'text':
      return `<div class="ir-form-field">
        <label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label>
        <input type="text" id="${fieldId}" name="${field.id}" class="ir-form-input" placeholder="${field.placeholder || ''}" ${required}>
      </div>`;

    case 'textarea':
      return `<div class="ir-form-field">
        <label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label>
        <textarea id="${fieldId}" name="${field.id}" class="ir-form-textarea" placeholder="${field.placeholder || ''}" ${required}></textarea>
      </div>`;

    case 'select':
      return `<div class="ir-form-field">
        <label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label>
        <select id="${fieldId}" name="${field.id}" class="ir-form-select" ${required}>
          <option value="">選択してください</option>
          ${field.options?.map((option: string) => `<option value="${option}">${option}</option>`).join('')}
        </select>
      </div>`;

    case 'radio':
      return `<div class="ir-form-field">
        <fieldset class="ir-form-fieldset">
          <legend class="ir-form-legend">${field.label}${field.required ? ' *' : ''}</legend>
          ${field.options?.map((option: string) => `
            <label class="ir-form-radio-label">
              <input type="radio" name="${field.id}" value="${option}" class="ir-form-radio" ${required}>
              <span class="ir-form-radio-text">${option}</span>
            </label>
          `).join('')}
        </fieldset>
      </div>`;

    case 'checkbox':
      return `<div class="ir-form-field">
        <fieldset class="ir-form-fieldset">
          <legend class="ir-form-legend">${field.label}${field.required ? ' *' : ''}</legend>
          ${field.options?.map((option: string) => `
            <label class="ir-form-checkbox-label">
              <input type="checkbox" name="${field.id}" value="${option}" class="ir-form-checkbox">
              <span class="ir-form-checkbox-text">${option}</span>
            </label>
          `).join('')}
        </fieldset>
      </div>`;

    default:
      return '';
  }
};
```

## 🎯 主要機能

### 1. 名前空間ベースのID生成
- **目的**: CSS/JSの衝突を防ぐ
- **形式**: `ir-form-{formId}-field-{fieldId}`
- **例**: `ir-form-abc123-field-def456`

### 2. バリデーション機能
```typescript
// バリデーション関数
function validateField(field) {
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

### 3. フォーム送信処理
```typescript
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
  
  // 送信ボタンを無効化
  const submitButton = form.querySelector('.ir-form-submit');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
  }
  
  const formData = new FormData(form);
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }

  try {
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
        allowedDomains: ${JSON.stringify(form.settings.allowedDomains || [])}
      })
    });

    if (response.ok) {
      ${form.settings.completionUrl ?
        `window.location.href = '${form.settings.completionUrl}';` :
        'alert("送信完了しました。");'
      }
    } else {
      alert("送信に失敗しました。");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("送信に失敗しました。");
  } finally {
    // 送信ボタンを再有効化
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = '送信';
    }
  }
});
```

## 🎨 埋め込みコードの種類

### 1. コンパクト版（推奨）
```html
<div id="inquiry-form-${form.id}"></div>
<script src="https://your-domain.com/forms/inquiry-form-${form.id}.js"></script>
```

### 2. インライン版（完全自己完結）
```html
<!-- 問合せフォーム: ${form.name} -->
<div id="ir-form-${form.id}-container" class="ir-form-container"></div>
<script>
(function(){
  const f=document.createElement('form');
  f.className='ir-form';
  f.innerHTML=`${form.fields.map(field => {
    // フィールドHTML生成
  }).join('')}<button type="submit" class="ir-form-submit">送信</button>`;
  
  f.addEventListener('submit',async e=>{
    // 送信処理
  });
  
  const container=document.getElementById('ir-form-${form.id}-container');
  if(container)container.appendChild(f);
})();
</script>
<style>
/* CSS */
</style>
```

### 3. 詳細版（開発・デバッグ用）
```html
<!-- 問合せフォーム: ${form.name} -->
<div id="inquiry-form-${form.id}">
  <form id="inquiry-form-${form.id}-form">
    ${form.fields.map(field => {
      // 詳細なフィールドHTML生成
    }).join('\n')}
    <button type="submit">送信</button>
  </form>
</div>

<style>
${form.styling.css}
</style>

<script>
// 詳細なJavaScript処理
</script>
```

## ⚠️ リファクタリング時の注意点

1. **名前空間**: 現在の名前空間ベースのID生成を維持
2. **バリデーション**: 現在のバリデーション機能を維持
3. **送信処理**: 現在の送信処理ロジックを維持
4. **埋め込みコード**: 3種類の埋め込みコード形式を維持
5. **CSS**: 現在のCSS構造を維持

## 📁 関連ファイル

- `src/shared/utils/dataManager.ts` - メイン実装
- `src/components/FormPreview.tsx` - 埋め込みコード表示
- `src/components/FormList.tsx` - コードコピー機能
- `src/shared/types/index.ts` - 型定義

## 🔗 関連機能

- **フォーム管理**: フォームデータの取得
- **フィールド管理**: フィールドデータの取得
- **設定管理**: フォーム設定の取得
- **API統合**: 送信先APIの設定

## 📝 テストケース

### 正常系
1. HTML生成の正確性
2. CSS生成の正確性
3. JavaScript生成の正確性
4. バリデーション機能
5. 送信処理
6. 埋め込みコードの動作

### 異常系
1. 無効なフォームデータ
2. 送信エラー
3. バリデーションエラー
4. ネットワークエラー

## 🚀 改善提案

1. **テンプレート機能**: よく使われるフォームのテンプレート
2. **カスタマイズ機能**: より詳細なカスタマイズオプション
3. **パフォーマンス最適化**: 生成コードの最適化
4. **エラーハンドリング**: より詳細なエラーメッセージ
5. **アクセシビリティ**: アクセシビリティの向上
6. **国際化**: 多言語対応
