import { useState, useCallback, useMemo } from 'react';
import { Form } from '@/shared/types';

/**
 * FormListの状態管理フック
 */
export function useFormList(
    forms: Form[],
    onCreate: () => void,
    onEdit: (form: Form) => void,
    onDelete: (formId: string) => void,
    onDuplicate: (form: Form) => void
) {
    const [searchQuery, setSearchQuery] = useState('');

    // フォームを検索でフィルタリング
    const filteredForms = useMemo(() => {
        if (!searchQuery.trim()) return forms;

        const query = searchQuery.toLowerCase();
        return forms.filter(form =>
            form.name.toLowerCase().includes(query) ||
            form.description?.toLowerCase().includes(query) ||
            form.fields.some(field =>
                field.label.toLowerCase().includes(query)
            )
        );
    }, [forms, searchQuery]);

    const handleCreateForm = useCallback(() => {
        onCreate();
    }, [onCreate]);

    const handleEditForm = useCallback((form: Form) => {
        onEdit(form);
    }, [onEdit]);

    const handleDeleteForm = useCallback((formId: string) => {
        if (confirm('このフォームを削除しますか？この操作は元に戻せません。')) {
            onDelete(formId);
        }
    }, [onDelete]);

    const handleDuplicateForm = useCallback((form: Form) => {
        onDuplicate(form);
    }, [onDuplicate]);

    return {
        searchQuery,
        setSearchQuery,
        filteredForms,
        handleCreateForm,
        handleEditForm,
        handleDeleteForm,
        handleDuplicateForm
    };
}
