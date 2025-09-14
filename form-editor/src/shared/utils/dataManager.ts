import { Form, Inquiry, Signature, SystemSettings, FormField } from '../types';

// データファイルのパス（将来のファイルベース実装用）
// 現在はローカルストレージを使用

// ローカルストレージのキー
const STORAGE_KEYS = {
  FORMS: 'inquiry_forms',
  INQUIRIES: 'inquiry_inquiries',
  SIGNATURES: 'inquiry_signatures',
  SETTINGS: 'inquiry_settings',
};

// データの読み込み（ローカルストレージから）
export const loadData = {
  forms: (): Form[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.FORMS);
    return data ? JSON.parse(data) : [];
  },

  inquiries: (): Inquiry[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    return data ? JSON.parse(data) : [];
  },

  signatures: (): Signature[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.SIGNATURES);
    return data ? JSON.parse(data) : [];
  },

  settings: (): SystemSettings => {
    if (typeof window === 'undefined') return getDefaultSettings();
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : getDefaultSettings();
  },
};

// データの保存（ローカルストレージへ）
export const saveData = {
  forms: (forms: Form[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(forms));
  },

  inquiries: (inquiries: Inquiry[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  },

  signatures: (signatures: Signature[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SIGNATURES, JSON.stringify(signatures));
  },

  settings: (settings: SystemSettings): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
};

// デフォルト設定
const getDefaultSettings = (): SystemSettings => ({
  defaultSignature: '',
  autoReplyEnabled: true,
  maxFormsPerUser: 10,
});

// 初期データの設定
export const initializeData = (): void => {
  // 署名データの初期化
  const signatures = loadData.signatures();
  if (signatures.length === 0) {
    const defaultSignatures: Signature[] = [
      {
        id: '1',
        name: 'デフォルト署名',
        content: 'お問い合わせありがとうございます。\n\n担当者より改めてご連絡いたします。\n\nよろしくお願いいたします。',
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: '営業部署名',
        content: 'この度はお問い合わせいただき、誠にありがとうございます。\n\n営業部の担当者より、詳細についてご連絡いたします。\n\n何かご不明な点がございましたら、お気軽にお問い合わせください。\n\n営業部',
        isDefault: false,
        createdAt: new Date().toISOString(),
      },
    ];
    saveData.signatures(defaultSignatures);
  }

  // 設定の初期化
  const settings = loadData.settings();
  if (!settings.defaultSignature) {
    const signatures = loadData.signatures();
    const defaultSignature = signatures.find(s => s.isDefault);
    if (defaultSignature) {
      settings.defaultSignature = defaultSignature.id;
      saveData.settings(settings);
    }
  }
};

// ユーティリティ関数
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// フォーム用JavaScript生成
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
(function() {
  const form = document.getElementById('${formElementId}');
  if (!form) return;

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
  
  // エラーメッセージ表示
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // フィールドにエラークラスを追加
    field.classList.add('ir-form-error');
    
    // エラーメッセージ要素を作成
    const errorElement = document.createElement('div');
    errorElement.className = 'ir-form-error-message';
    errorElement.textContent = message;
    errorElement.id = \`\${fieldId}-error\`;
    
    // フィールドの後にエラーメッセージを挿入
    const fieldContainer = field.closest('.ir-form-field');
    if (fieldContainer) {
      fieldContainer.appendChild(errorElement);
    }
  }
  
  // エラーメッセージクリア
  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.remove('ir-form-error');
    }
    
    const errorElement = document.getElementById(\`\${fieldId}-error\`);
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  // 全フィールドのバリデーション
  function validateForm() {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    
    // ドメイン設定のバリデーション
    const allowedDomains = ${JSON.stringify(form.settings.allowedDomains || [])};
    if (!allowedDomains || allowedDomains.length === 0 || allowedDomains.some(domain => !domain.trim())) {
      alert('エラー: 許可ドメインが設定されていません。フォーム管理者にお問い合わせください。');
      isValid = false;
    }
    
    return isValid;
  }
  
  // リアルタイムバリデーション
  form.addEventListener('input', function(e) {
    if (e.target.matches('input, textarea, select')) {
      validateField(e.target);
    }
  });
  
  form.addEventListener('blur', function(e) {
    if (e.target.matches('input, textarea, select')) {
      validateField(e.target);
    }
  }, true);

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
})();
</script>
`;
};

// フィールドHTML生成（名前空間対応）
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