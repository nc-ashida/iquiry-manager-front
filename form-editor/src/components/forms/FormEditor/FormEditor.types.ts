import { Form } from '@/shared/types';

export interface FormEditorProps {
    form: Form | null;
    onSave: (form: Form) => void;
    onCancel: () => void;
    mode?: 'create' | 'edit';
}

export type FormEditorRef = HTMLDivElement;

export interface UseFormEditorReturn {
    currentForm: Form | null;
    updateForm: (updates: Partial<Form>) => void;
    addField: (field: Omit<import('@/shared/types').FormField, 'id'>) => string | undefined;
    updateField: (fieldId: string, updates: Partial<import('@/shared/types').FormField>) => void;
    deleteField: (fieldId: string) => void;
    moveField: (fieldId: string, direction: 'up' | 'down') => void;
    duplicateField: (fieldId: string) => void;
    isDirty: boolean;
    isValid: boolean;
    saveForm: () => Promise<void>;
    resetForm: () => void;
}
