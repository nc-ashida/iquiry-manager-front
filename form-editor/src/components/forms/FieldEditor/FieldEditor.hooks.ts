import { useState, useCallback } from 'react';
import { FormField } from '@/shared/types';

export interface UseFieldEditorReturn {
    expandedFields: Set<string>;
    highlightedField: string | null;
    toggleFieldExpanded: (fieldId: string) => void;
    setHighlightedField: (fieldId: string | null) => void;
    addField: (field: Omit<FormField, 'id'>) => string | undefined;
    updateField: (fieldId: string, updates: Partial<FormField>) => void;
    deleteField: (fieldId: string) => void;
    moveField: (fieldId: string, direction: 'up' | 'down') => void;
    duplicateField: (fieldId: string) => void;
    moveOption: (fieldId: string, oldIndex: number, newIndex: number) => void;
    updateOption: (fieldId: string, index: number, value: string) => void;
    deleteOption: (fieldId: string, index: number) => void;
    addOption: (fieldId: string) => void;
    expandField: (fieldId: string) => void;
}

/**
 * フィールドエディターの状態管理フック
 */
export function useFieldEditor(
    form: { fields: FormField[] } | null,
    onAddField: (field: Omit<FormField, 'id'>) => string | undefined,
    onUpdateField: (fieldId: string, updates: Partial<FormField>) => void,
    onDeleteField: (fieldId: string) => void,
    onMoveField: (fieldId: string, direction: 'up' | 'down') => void,
    onDuplicateField: (fieldId: string) => void
): UseFieldEditorReturn {
    const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
    const [highlightedField, setHighlightedField] = useState<string | null>(null);

    // フィールドの展開状態を切り替え
    const toggleFieldExpanded = useCallback((fieldId: string) => {
        setExpandedFields(prev => {
            const newSet = new Set(prev);
            if (newSet.has(fieldId)) {
                newSet.delete(fieldId);
            } else {
                newSet.add(fieldId);
            }
            return newSet;
        });
    }, []);

    // フィールドを展開状態にする
    const expandField = useCallback((fieldId: string) => {
        setExpandedFields(prev => {
            const newSet = new Set(prev);
            newSet.add(fieldId);
            return newSet;
        });
    }, []);

    // フィールドを追加
    const addField = useCallback((field: Omit<FormField, 'id'>) => {
        return onAddField(field);
    }, [onAddField]);

    // フィールドを更新
    const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
        onUpdateField(fieldId, updates);
    }, [onUpdateField]);

    // フィールドを削除
    const deleteField = useCallback((fieldId: string) => {
        onDeleteField(fieldId);
        setExpandedFields(prev => {
            const newSet = new Set(prev);
            newSet.delete(fieldId);
            return newSet;
        });
    }, [onDeleteField]);

    // フィールドを移動
    const moveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
        onMoveField(fieldId, direction);
    }, [onMoveField]);

    // フィールドを複製
    const duplicateField = useCallback((fieldId: string) => {
        onDuplicateField(fieldId);
    }, [onDuplicateField]);

    // オプションを移動
    const moveOption = useCallback((fieldId: string, oldIndex: number, newIndex: number) => {
        const field = form?.fields.find((f: FormField) => f.id === fieldId);
        if (!field || !field.options) return;

        const newOptions = [...field.options];
        const [movedOption] = newOptions.splice(oldIndex, 1);
        newOptions.splice(newIndex, 0, movedOption);

        updateField(fieldId, { options: newOptions });
    }, [form, updateField]);

    // オプションを更新
    const updateOption = useCallback((fieldId: string, index: number, value: string) => {
        const field = form?.fields.find((f: FormField) => f.id === fieldId);
        if (!field || !field.options) return;

        const newOptions = [...field.options];
        newOptions[index] = value;

        updateField(fieldId, { options: newOptions });
    }, [form, updateField]);

    // オプションを削除
    const deleteOption = useCallback((fieldId: string, index: number) => {
        const field = form?.fields.find((f: FormField) => f.id === fieldId);
        if (!field || !field.options) return;

        const newOptions = field.options.filter((_, i) => i !== index);
        updateField(fieldId, { options: newOptions });
    }, [form, updateField]);

    // オプションを追加
    const addOption = useCallback((fieldId: string) => {
        const field = form?.fields.find((f: FormField) => f.id === fieldId);
        if (!field) return;

        const newOptions = [...(field.options || []), '新しいオプション'];
        updateField(fieldId, { options: newOptions });
    }, [form, updateField]);

    return {
        expandedFields,
        highlightedField,
        toggleFieldExpanded,
        setHighlightedField,
        addField,
        updateField,
        deleteField,
        moveField,
        duplicateField,
        moveOption,
        updateOption,
        deleteOption,
        addOption,
        expandField
    };
}
