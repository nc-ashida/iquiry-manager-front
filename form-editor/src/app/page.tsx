'use client';

import { useState, useEffect } from 'react';
import { Form } from '@/shared/types';
import { loadData, saveData, generateId, initializeData } from '@/shared/utils/dataManager';
import FormList from '@/components/FormList';
import FormEditor from '@/components/FormEditor';
import Header from '@/components/Header';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

export default function Home() {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    initializeData();
    const loadedForms = loadData.forms();
    setForms(loadedForms);
  }, []);

  const handleCreateForm = () => {
    const newForm: Form = {
      id: generateId(),
      name: '新しいフォーム',
      description: '',
      fields: [],
      styling: {
        css: `
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
        `,
        theme: 'default'
      },
      settings: {
        completionUrl: '',
        signatureId: '',
        autoReply: true,
        fileUpload: {
          enabled: false,
          maxFiles: 1,
          maxFileSize: 10
        },
        allowedDomains: ['localhost:3000'] // デフォルトで開発環境を許可
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSelectedForm(newForm);
    setIsEditing(true);
  };

  const handleSaveForm = (form: Form) => {
    // ドメイン設定のバリデーション
    const allowedDomains = form.settings.allowedDomains || [];
    if (allowedDomains.length === 0 || allowedDomains.some(domain => !domain.trim())) {
      alert('エラー: 最低1つ以上の有効なドメインを登録してください。');
      return;
    }

    const updatedForms = forms.find(f => f.id === form.id)
      ? forms.map(f => f.id === form.id ? { ...form, updatedAt: new Date().toISOString() } : f)
      : [...forms, { ...form, updatedAt: new Date().toISOString() }];

    setForms(updatedForms);
    saveData.forms(updatedForms);
    setIsEditing(false);
    setSelectedForm(null);
  };

  const handleEditForm = (form: Form) => {
    setSelectedForm(form);
    setIsEditing(true);
    setShowPreview(false);
  };

  const handleDuplicateForm = (originalForm: Form) => {
    const duplicatedForm: Form = {
      ...originalForm,
      id: generateId(),
      name: `${originalForm.name} (コピー)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSelectedForm(duplicatedForm);
    setIsEditing(true);
    setShowPreview(false);
  };

  const handleDeleteForm = (formId: string) => {
    const updatedForms = forms.filter(f => f.id !== formId);
    setForms(updatedForms);
    saveData.forms(updatedForms);
  };

  const handlePreviewForm = (form: Form) => {
    setSelectedForm(form);
    setShowPreview(true);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setShowPreview(false);
    setSelectedForm(null);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header currentPage="forms" />
        <main className="flex-1 p-4 sm:p-6">
          {isEditing || showPreview ? (
            <FormEditor
              form={selectedForm}
              onSave={handleSaveForm}
              onCancel={handleCancelEdit}
            />
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* ヘッダーセクション */}
              <FadeIn>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">フォーム管理</h1>
                    <p className="text-gray-600 mt-2 text-xs sm:text-sm">問合せフォームの作成・編集・管理を行います</p>
                  </div>
                  <Button
                    onClick={handleCreateForm}
                    size="lg"
                    className="bg-black hover:bg-gray-800 text-white shadow-sm w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">新しいフォームを作成</span>
                    <span className="sm:hidden">フォーム作成</span>
                  </Button>
                </div>
              </FadeIn>


              {/* フォームリスト */}
              <FadeIn delay={0.2}>
                <FormList
                  forms={forms}
                  onCreateForm={handleCreateForm}
                  onEditForm={handleEditForm}
                  onDeleteForm={handleDeleteForm}
                  onPreviewForm={handlePreviewForm}
                  onDuplicateForm={handleDuplicateForm}
                />
              </FadeIn>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}