'use client';

import { useState, useMemo } from 'react';
import { Form } from '@/shared/types';
import { formatDate } from '@/shared/utils/dataManager';
import { Plus, Edit, Trash2, Copy, FileText, Calendar, Hash, Settings, Search, Eye, ChevronLeft, ChevronRight, Files } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FormListProps {
  forms: Form[];
  onCreateForm: () => void;
  onEditForm: (form: Form) => void;
  onDeleteForm: (formId: string) => void;
  onPreviewForm: (form: Form) => void;
  onDuplicateForm: (form: Form) => void;
}

export default function FormList({ forms, onCreateForm, onEditForm, onDeleteForm, onPreviewForm, onDuplicateForm }: FormListProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = (formId: string) => {
    onDeleteForm(formId);
    setShowDeleteConfirm(null);
  };

  // 検索とフィルタリング
  const filteredForms = useMemo(() => {
    if (!searchQuery.trim()) return forms;
    return forms.filter(form =>
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [forms, searchQuery]);

  // ページネーション
  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedForms = filteredForms.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 検索時にページをリセット
  };

  const handleCopyScript = async (form: Form) => {
    // 名前空間ベースのID生成（衝突を防ぐため）
    const namespace = `ir-form-${form.id}`;
    const formId = `${namespace}-container`;
    const formElementId = `${namespace}-form`;

    const script = `
<!-- 問合せフォーム: ${form.name} -->
<div id="${formId}" class="ir-form-container">
  <form id="${formElementId}" class="ir-form">
    ${form.fields.map(field => {
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
              ${field.options?.map(option => `<option value="${option}">${option}</option>`).join('')}
            </select>
          </div>`;
        case 'radio':
          return `<div class="ir-form-field">
            <fieldset class="ir-form-fieldset">
              <legend class="ir-form-legend">${field.label}${field.required ? ' *' : ''}</legend>
              ${field.options?.map(option => `
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
              ${field.options?.map(option => `
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
    }).join('\n    ')}
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

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // ドメイン設定のバリデーション
    const allowedDomains = ${JSON.stringify(form.settings.allowedDomains || [])};
    if (!allowedDomains || allowedDomains.length === 0 || allowedDomains.some(domain => !domain.trim())) {
      alert('エラー: 許可ドメインが設定されていません。フォーム管理者にお問い合わせください。');
      return;
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
    }
  });
})();
</script>`;

    try {
      await navigator.clipboard.writeText(script);
      alert('JavaScriptコードをクリップボードにコピーしました');
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('コピーに失敗しました');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold">フォーム一覧</CardTitle>
            <CardDescription className="text-xs sm:text-sm">作成されたフォームの一覧と管理</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          {/* 検索バー */}
          {forms.length > 0 && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="フォーム名で検索..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <p className="text-xs text-muted-foreground mt-2">
                  {filteredForms.length}件のフォームが見つかりました
                </p>
              )}
            </div>
          )}

          {forms.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-2">フォームがありません</h3>
              <p className="text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto text-xs sm:text-sm">最初のフォームを作成して、問合せシステムを始めましょう</p>
              <Button onClick={onCreateForm} size="lg" className="shadow-lg w-full sm:w-auto hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                フォームを作成
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedForms.map((form) => (
                <Card key={form.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-fit">
                  <CardHeader className="pb-3 px-4 py-4 sm:px-6 sm:py-4">
                    <div className="flex flex-col gap-3">
                      {/* フォーム名 */}
                      <div className="w-full">
                        <CardTitle className="text-xs sm:text-sm font-semibold break-words leading-tight">
                          {form.name}
                        </CardTitle>
                      </div>

                      {/* アクションボタン */}
                      <div className="flex justify-end">
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyScript(form)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
                            title="コードをコピー"
                          >
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPreviewForm(form)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-green-100 hover:text-green-600"
                            title="プレビュー"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditForm(form)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                            title="編集"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDuplicateForm(form)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-purple-100 hover:text-purple-600"
                            title="フォームを複製"
                          >
                            <Files className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(form.id)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="削除"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 説明文 */}
                      {form.description && (
                        <CardDescription className="line-clamp-2 text-xs text-muted-foreground">
                          {form.description}
                        </CardDescription>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 px-4 pb-4 sm:px-6 sm:pb-6">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Hash className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          <span className="text-xs">項目数</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">{form.fields.length}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          <span className="text-xs">自動返信</span>
                        </div>
                        <Badge variant={form.settings.autoReply ? "default" : "outline"} className="text-xs">
                          {form.settings.autoReply ? "有効" : "無効"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          <span className="text-xs sm:text-sm">更新日</span>
                        </div>
                        <span className="text-muted-foreground text-xs sm:text-sm">{formatDate(form.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ページネーション */}
          {filteredForms.length > itemsPerPage && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {startIndex + 1}-{Math.min(endIndex, filteredForms.length)} / {filteredForms.length}件
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-white text-gray-900 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 p-0 ${currentPage === page
                        ? 'bg-black text-white border-black hover:bg-gray-800'
                        : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-white text-gray-900 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 削除確認ダイアログ */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent className="bg-white border border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900">フォームを削除</DialogTitle>
            <DialogDescription className="text-gray-600">
              この操作は取り消せません。フォームとその関連データが完全に削除されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="bg-white border-gray-200 text-gray-900 hover:bg-gray-50">
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
