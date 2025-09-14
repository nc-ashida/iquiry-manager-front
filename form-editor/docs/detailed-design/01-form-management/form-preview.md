# フォームプレビュー機能

フォームのプレビュー表示と埋め込みコード生成を行う機能です。

## 📋 機能概要

フォームの実際の表示をプレビューし、埋め込み用のHTML/CSS/JavaScriptコードを生成・表示します。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/components/FormPreview.tsx`
- **インターフェース**: `FormPreviewProps`

### コンポーネント構成
```typescript
interface FormPreviewProps {
  form: Form;
}

export default function FormPreview({ form }: FormPreviewProps) {
  // プレビュー表示と埋め込みコード生成
}
```

## 🎯 主要機能

### 1. フォームプレビュー表示
```typescript
const renderField = (field: FormField) => {
  const fieldId = `preview-${field.id}`;

  switch (field.type) {
    case 'text':
      return (
        <div key={field.id} className="field">
          <label htmlFor={fieldId} className="text-foreground">
            {field.label}
            {field.required && <span className="required"> *</span>}
          </label>
          <input
            type="text"
            id={fieldId}
            name={field.id}
            placeholder={field.placeholder || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-none bg-white"
          />
        </div>
      );

    case 'textarea':
      return (
        <div key={field.id} className="field">
          <label htmlFor={fieldId} className="text-foreground">
            {field.label}
            {field.required && <span className="required"> *</span>}
          </label>
          <textarea
            id={fieldId}
            name={field.id}
            placeholder={field.placeholder || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-none bg-white"
            rows={4}
          />
        </div>
      );

    case 'select':
      return (
        <div key={field.id} className="field">
          <label htmlFor={fieldId} className="text-foreground">
            {field.label}
            {field.required && <span className="required"> *</span>}
          </label>
          <select
            id={fieldId}
            name={field.id}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-none bg-white"
          >
            <option value="">選択してください</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case 'radio':
      return (
        <div key={field.id} className="field">
          <label className="text-foreground">
            {field.label}
            {field.required && <span className="required"> *</span>}
          </label>
          <div className="space-y-2 mt-2">
            {field.options?.map((option: string) => (
              <label key={option} className="flex items-center text-foreground">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  disabled
                  className="mr-2"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div key={field.id} className="field">
          <label className="text-foreground">
            {field.label}
            {field.required && <span className="required"> *</span>}
          </label>
          <div className="space-y-2 mt-2">
            {field.options?.map((option: string) => (
              <label key={option} className="flex items-center text-foreground">
                <input
                  type="checkbox"
                  name={field.id}
                  value={option}
                  disabled
                  className="mr-2"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case 'file':
      return (
        <div key={field.id} className="field">
          <label htmlFor={fieldId} className="text-foreground">
            {field.label}
            {field.required && <span className="required"> *</span>}
          </label>
          <input
            type="file"
            id={fieldId}
            name={field.id}
            multiple={field.multiple || false}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-none bg-white"
          />
          <p className="text-xs text-muted-foreground mt-1">
            ファイルを選択してください
          </p>
        </div>
      );

    default:
      return null;
  }
};
```

### 2. フォームコンテナ
```typescript
<div
  className="form-container bg-white border border-gray-200 rounded-lg"
  style={{
    maxWidth: '600px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    minHeight: '200px'
  }}
>
  <form>
    {form.fields.map(renderField)}

    {/* 添付ファイル機能が有効な場合、自動的にファイルアップロードフィールドを表示 */}
    {form.settings.fileUpload?.enabled && (
      <div className="field">
        <label className="text-foreground">
          添付ファイル
          {form.settings.fileUpload.maxFiles > 1 && (
            <span className="text-sm text-muted-foreground ml-2">
              (最大{form.settings.fileUpload.maxFiles}ファイル、1ファイルあたり{form.settings.fileUpload.maxFileSize}MBまで)
            </span>
          )}
        </label>
        <input
          type="file"
          name="attachments"
          multiple={form.settings.fileUpload.maxFiles > 1}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-none bg-white"
        />
        <p className="text-xs text-muted-foreground mt-1">
          ファイルを選択してください
          {form.settings.fileUpload.maxFiles > 1 && (
            <span> (最大{form.settings.fileUpload.maxFiles}ファイル)</span>
          )}
          <span> (1ファイルあたり{form.settings.fileUpload.maxFileSize}MBまで)</span>
        </p>
      </div>
    )}
    
    <button
      type="submit"
      disabled
      className="mt-6 bg-gray-400 text-white px-6 py-3 rounded-none cursor-not-allowed"
    >
      送信
    </button>
  </form>
</div>
```

## 🎨 埋め込みコード生成

### 1. コンパクト版（推奨）
```typescript
{/* コンパクト版（推奨） */}
<div className="mb-6">
  <div className="flex items-center justify-between mb-2">
    <h5 className="text-sm font-medium text-foreground">コンパクト版（推奨）</h5>
    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">2行で実装</span>
  </div>
  <div className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto">
    <pre className="text-sm">
      <code>{`<div id="inquiry-form-${form.id}"></div>
<script src="https://your-domain.com/forms/inquiry-form-${form.id}.js"></script>`}</code>
    </pre>
  </div>
  <div className="text-xs text-muted-foreground mt-2 space-y-1">
    <p>• <strong>divタグ</strong>: フォームを表示したい場所に配置</p>
    <p>• <strong>scriptタグ</strong>: divタグを探してフォームを自動生成</p>
    <p>• サーバにホストされたJavaScriptファイルを読み込みます。実装が隠蔽され、コード量が最小限です。</p>
  </div>
</div>
```

### 2. インライン版（完全自己完結）
```typescript
{/* インライン版 */}
<div className="mb-6">
  <div className="flex items-center justify-between mb-2">
    <h5 className="text-sm font-medium text-foreground">インライン版</h5>
    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">完全自己完結</span>
  </div>
  <div className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto">
    <pre className="text-sm">
      <code>{`<!-- 問合せフォーム: ${form.name} -->
<div id="ir-form-${form.id}-container" class="ir-form-container"></div>
<script>
(function(){
  const f=document.createElement('form');
  f.className='ir-form';
  f.innerHTML=\`${form.fields.map(field => {
    const fieldId = `ir-form-${form.id}-field-${field.id}`;
    const required = field.required ? 'required' : '';

    switch (field.type) {
      case 'text':
        return `<div class="ir-form-field"><label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label><input type="text" id="${fieldId}" name="${field.id}" class="ir-form-input" placeholder="${field.placeholder || ''}" ${required}></div>`;
      case 'textarea':
        return `<div class="ir-form-field"><label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label><textarea id="${fieldId}" name="${field.id}" class="ir-form-textarea" placeholder="${field.placeholder || ''}" ${required}></textarea></div>`;
      case 'select':
        return `<div class="ir-form-field"><label for="${fieldId}" class="ir-form-label">${field.label}${field.required ? ' *' : ''}</label><select id="${fieldId}" name="${field.id}" class="ir-form-select" ${required}><option value="">選択してください</option>${field.options?.map(option => `<option value="${option}">${option}</option>`).join('')}</select></div>`;
      case 'radio':
        return `<div class="ir-form-field"><fieldset class="ir-form-fieldset"><legend class="ir-form-legend">${field.label}${field.required ? ' *' : ''}</legend>${field.options?.map(option => `<label class="ir-form-radio-label"><input type="radio" name="${field.id}" value="${option}" class="ir-form-radio" ${required}><span class="ir-form-radio-text">${option}</span></label>`).join('')}</fieldset></div>`;
      case 'checkbox':
        return `<div class="ir-form-field"><fieldset class="ir-form-fieldset"><legend class="ir-form-legend">${field.label}${field.required ? ' *' : ''}</legend>${field.options?.map(option => `<label class="ir-form-checkbox-label"><input type="checkbox" name="${field.id}" value="${option}" class="ir-form-checkbox"><span class="ir-form-checkbox-text">${option}</span></label>`).join('')}</fieldset></div>`;
      default:
        return '';
    }
  }).join('')}<button type="submit" class="ir-form-submit">送信</button>\`;
  
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    
    // ドメイン設定のバリデーション
    const allowedDomains = ${JSON.stringify(form.settings.allowedDomains || [])};
    if (!allowedDomains || allowedDomains.length === 0 || allowedDomains.some(domain => !domain.trim())) {
      alert('エラー: 許可ドメインが設定されていません。フォーム管理者にお問い合わせください。');
      return;
    }
    
    const d=new FormData(f);
    const data={};
    for(let[k,v]of d.entries())data[k]=v;
    try{
      const r=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({formId:'${form.id}',responses:data,senderInfo:{name:data.name||'',email:data.email||'',phone:data.phone||''},allowedDomains:${JSON.stringify(form.settings.allowedDomains || [])}})});
      if(r.ok){${form.settings.completionUrl ? `window.location.href='${form.settings.completionUrl}';` : `alert("送信完了しました。");`}}else{alert("送信に失敗しました。");}
    }catch(e){console.error('Error:',e);alert("送信に失敗しました。");}
  });
  
  const container=document.getElementById('ir-form-${form.id}-container');
  if(container)container.appendChild(f);
})();
</script>
<style>
/* 名前空間ベースのCSS（衝突を防ぐため） */
.ir-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.ir-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ir-form-field {
  margin-bottom: 20px;
}

.ir-form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.ir-form-input,
.ir-form-textarea,
.ir-form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.ir-form-input:focus,
.ir-form-textarea:focus,
.ir-form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.ir-form-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.ir-form-legend {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.ir-form-radio-label,
.ir-form-checkbox-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
}

.ir-form-radio,
.ir-form-checkbox {
  margin-right: 8px;
}

.ir-form-radio-text,
.ir-form-checkbox-text {
  font-size: 14px;
}

.ir-form-submit {
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-start;
}

.ir-form-submit:hover {
  background-color: #0056b3;
}

.ir-form-submit:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* 必須項目のスタイル */
.ir-form-label:has(+ .ir-form-input[required]),
.ir-form-legend:has(+ * [required]) {
  color: #dc3545;
}

.ir-form-label:has(+ .ir-form-input[required])::after,
.ir-form-legend:has(+ * [required])::after {
  content: " *";
  color: #dc3545;
}

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

/* 送信ボタンの状態 */
.ir-form-submit:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

/* フォーカス時のアクセシビリティ向上 */
.ir-form-input:focus,
.ir-form-textarea:focus,
.ir-form-select:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* ラジオボタン・チェックボックスのアクセシビリティ */
.ir-form-radio:focus,
.ir-form-checkbox:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
</style>`}</code>
    </pre>
  </div>
  <div className="text-xs text-muted-foreground mt-2 space-y-1">
    <p>• <strong>divタグ</strong>: フォームを表示したい場所に配置</p>
    <p>• <strong>scriptタグ</strong>: divタグを探してフォームを自動生成</p>
    <p>• 完全に自己完結したコードです。外部ファイルに依存しません。</p>
  </div>
</div>
```

### 3. 詳細版（開発・デバッグ用）
```typescript
{/* 詳細版（開発・デバッグ用） */}
<div>
  <div className="flex items-center justify-between mb-2">
    <h5 className="text-sm font-medium text-foreground">詳細版（開発・デバッグ用）</h5>
    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">読みやすい</span>
  </div>
  <div className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto max-h-96">
    <pre className="text-sm">
      <code>{`<!-- 問合せフォーム: ${form.name} -->
<div id="inquiry-form-${form.id}">
  <form id="inquiry-form-${form.id}-form">
    ${form.fields.map(field => {
      const fieldId = `field-${field.id}`;
      const required = field.required ? 'required' : '';

      switch (field.type) {
        case 'text':
          return `    <div class="field">
      <label for="${fieldId}">${field.label}${field.required ? ' *' : ''}</label>
      <input type="text" id="${fieldId}" name="${field.id}" placeholder="${field.placeholder || ''}" ${required}>
    </div>`;
        case 'textarea':
          return `    <div class="field">
      <label for="${fieldId}">${field.label}${field.required ? ' *' : ''}</label>
      <textarea id="${fieldId}" name="${field.id}" placeholder="${field.placeholder || ''}" ${required}></textarea>
    </div>`;
        case 'select':
          return `    <div class="field">
      <label for="${fieldId}">${field.label}${field.required ? ' *' : ''}</label>
      <select id="${fieldId}" name="${field.id}" ${required}>
        <option value="">選択してください</option>
        ${field.options?.map(option => `        <option value="${option}">${option}</option>`).join('\n')}
      </select>
    </div>`;
        case 'radio':
          return `    <div class="field">
      <label>${field.label}${field.required ? ' *' : ''}</label>
      <div class="space-y-2 mt-2">
        ${field.options?.map(option => `
        <label class="flex items-center">
          <input type="radio" name="${field.id}" value="${option}" ${required} class="mr-2">
          <span>${option}</span>
        </label>`).join('')}
      </div>
    </div>`;
        case 'checkbox':
          return `    <div class="field">
      <label>${field.label}${field.required ? ' *' : ''}</label>
      <div class="space-y-2 mt-2">
        ${field.options?.map(option => `
        <label class="flex items-center">
          <input type="checkbox" name="${field.id}" value="${option}" class="mr-2">
          <span>${option}</span>
        </label>`).join('')}
      </div>
    </div>`;
        default:
          return '';
      }
    }).join('\n')}
    <button type="submit">送信</button>
  </form>
</div>

<style>
${form.styling.css}
</style>

<script>
(function() {
  const form = document.getElementById('inquiry-form-${form.id}-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
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
          }
        })
      });

      if (response.ok) {
        ${form.settings.completionUrl ?
          `        window.location.href = '${form.settings.completionUrl}';` :
          '        alert("送信完了しました。");'
        }
      } else {
        alert("送信に失敗しました。");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("送信に失敗しました。");
    }
  });
})();
</script>`}</code>
    </pre>
  </div>
  <p className="text-xs text-muted-foreground mt-2">
    開発やデバッグ時に読みやすい形式です。本番環境では推奨されません。
  </p>
</div>
```

## 🎨 レスポンシブ対応

### 1. プレビューコンテナ
```typescript
<div
  className="form-container bg-white border border-gray-200 rounded-lg"
  style={{
    maxWidth: '600px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    minHeight: '200px'
  }}
>
  {/* フォーム内容 */}
</div>
```

### 2. 埋め込みコード表示
```typescript
<div className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto">
  <pre className="text-sm">
    <code>{/* 生成されたコード */}</code>
  </pre>
</div>
```

## ⚠️ リファクタリング時の注意点

1. **フィールドレンダリング**: 現在のフィールドレンダリングロジックを維持
2. **埋め込みコード生成**: 3種類の埋め込みコード形式を維持
3. **CSS生成**: 現在のCSS生成機能を維持
4. **JavaScript生成**: 現在のJavaScript生成機能を維持
5. **レスポンシブ対応**: 現在のレスポンシブ対応を維持

## 📁 関連ファイル

- `src/components/FormPreview.tsx` - メイン実装
- `src/shared/utils/dataManager.ts` - フォーム生成機能
- `src/shared/types/index.ts` - 型定義

## 🔗 関連機能

- **フォーム管理**: フォームデータの取得
- **フィールド管理**: フィールドデータの取得
- **設定管理**: フォーム設定の取得
- **コード生成**: 埋め込みコードの生成

## 📝 テストケース

### 正常系
1. フォームプレビューの表示
2. 各種フィールドタイプの表示
3. 埋め込みコードの生成
4. レスポンシブ表示

### 異常系
1. 無効なフォームデータ
2. フィールドの表示エラー
3. コード生成の失敗

## 🚀 改善提案

1. **リアルタイムプレビュー**: フォーム編集時のリアルタイム更新
2. **テーマ対応**: 複数のテーマ選択
3. **カスタマイズ**: より詳細なカスタマイズオプション
4. **エクスポート**: プレビューの画像エクスポート
5. **アクセシビリティ**: アクセシビリティの向上
6. **国際化**: 多言語対応
