'use client';

import { Form, FormField } from '@/shared/types';

interface FormPreviewProps {
  form: Form;
}

export default function FormPreview({ form }: FormPreviewProps) {
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

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-foreground">フォームプレビュー</h3>
        <div className="text-base text-muted-foreground">
          {form.fields.length}個の項目
        </div>
      </div>

      <div className="bg-card border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="w-full">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-2">{form.name}</h2>
            {form.description && (
              <p className="text-muted-foreground text-sm sm:text-base">{form.description}</p>
            )}
          </div>

          <div
            className="form-container bg-white border border-gray-200 rounded-lg w-full"
            style={{
              margin: '0 auto',
              padding: '16px',
              fontFamily: 'Arial, sans-serif',
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              minHeight: '150px'
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
        </div>
      </div>

      {/* 埋め込みコード */}
      <div className="mt-6 sm:mt-8 w-full max-w-full overflow-hidden">
        <h4 className="text-sm sm:text-md font-semibold text-foreground mb-3 sm:mb-4">埋め込みコード</h4>

        {/* コンパクト版（推奨） */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h5 className="text-xs sm:text-sm font-medium text-foreground">コンパクト版（推奨）</h5>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded w-fit">2行で実装</span>
          </div>
          <div className="bg-gray-900 text-gray-100 rounded p-3 sm:p-4 overflow-x-auto">
            <pre className="text-xs sm:text-sm whitespace-pre-wrap break-words">
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

        {/* インライン版 */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h5 className="text-xs sm:text-sm font-medium text-foreground">インライン版</h5>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded w-fit">完全自己完結</span>
          </div>
          <div className="bg-gray-900 text-gray-100 rounded p-3 sm:p-4 overflow-x-auto max-h-64 sm:max-h-96">
            <pre className="text-xs sm:text-sm whitespace-pre-wrap break-words">
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

        {/* 詳細版（開発用） */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h5 className="text-xs sm:text-sm font-medium text-foreground">詳細版（開発・デバッグ用）</h5>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded w-fit">読みやすい</span>
          </div>
          <div className="bg-gray-900 text-gray-100 rounded p-3 sm:p-4 overflow-x-auto max-h-48 sm:max-h-96">
            <pre className="text-xs sm:text-sm whitespace-pre-wrap break-words">
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
      </div>
    </div>
  );
}
