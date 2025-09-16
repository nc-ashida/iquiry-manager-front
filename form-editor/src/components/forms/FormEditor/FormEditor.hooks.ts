import { useState, useCallback, useEffect } from 'react';
import { Form, FormField } from '@/shared/types';
import { generateId } from '@/shared/utils/dataManager';

/**
 * フォームエディターの状態管理フック
 */
export function useFormEditor(
    initialForm: Form | null,
    onSave: (form: Form) => void
) {
    const [currentForm, setCurrentForm] = useState<Form | null>(initialForm);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setCurrentForm(initialForm);
        setIsDirty(false);
    }, [initialForm]);

    const updateForm = useCallback((updates: Partial<Form>) => {
        setCurrentForm(prev => prev ? { ...prev, ...updates } : null);
        setIsDirty(true);
    }, []);

    const addField = useCallback((field: Omit<FormField, 'id'>) => {
        if (!currentForm) return;

        const newField: FormField = {
            ...field,
            id: generateId(),
            order: currentForm.fields.length
        };

        setCurrentForm(prev => prev ? {
            ...prev,
            fields: [...prev.fields, newField]
        } : null);
        setIsDirty(true);

        return newField.id; // 新しく追加されたフィールドのIDを返す
    }, [currentForm]);

    const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
        if (!currentForm) return;

        setCurrentForm(prev => prev ? {
            ...prev,
            fields: prev.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
            )
        } : null);
        setIsDirty(true);
    }, [currentForm]);

    const deleteField = useCallback((fieldId: string) => {
        if (!currentForm) return;

        setCurrentForm(prev => prev ? {
            ...prev,
            fields: prev.fields.filter(field => field.id !== fieldId)
        } : null);
        setIsDirty(true);
    }, [currentForm]);

    const moveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
        if (!currentForm) return;

        const fields = [...currentForm.fields];
        const index = fields.findIndex(field => field.id === fieldId);

        if (index === -1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= fields.length) return;

        [fields[index], fields[newIndex]] = [fields[newIndex], fields[index]];

        setCurrentForm(prev => prev ? {
            ...prev,
            fields: fields.map((field, idx) => ({ ...field, order: idx }))
        } : null);
        setIsDirty(true);
    }, [currentForm]);

    const duplicateField = useCallback((fieldId: string) => {
        if (!currentForm) return;

        const field = currentForm.fields.find(f => f.id === fieldId);
        if (!field) return;

        const duplicatedField: FormField = {
            ...field,
            id: generateId(),
            label: `${field.label} (コピー)`,
            order: currentForm.fields.length
        };

        setCurrentForm(prev => prev ? {
            ...prev,
            fields: [...prev.fields, duplicatedField]
        } : null);
        setIsDirty(true);
    }, [currentForm]);

    const saveForm = useCallback(async () => {
        if (!currentForm) return;

        const formToSave: Form = {
            ...currentForm,
            updatedAt: new Date().toISOString()
        };

        onSave(formToSave);
        setIsDirty(false);
    }, [currentForm, onSave]);

    const resetForm = useCallback(() => {
        setCurrentForm(initialForm);
        setIsDirty(false);
    }, [initialForm]);

    const isValid = currentForm?.name && currentForm.fields.length > 0;

    return {
        currentForm,
        updateForm,
        addField,
        updateField,
        deleteField,
        moveField,
        duplicateField,
        isDirty,
        isValid,
        saveForm,
        resetForm
    };
}
