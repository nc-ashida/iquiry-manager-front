import { Form } from '@/shared/types';

export interface FormListProps {
    forms: Form[];
    onEdit: (form: Form) => void;
    onDelete: (formId: string) => void;
    onDuplicate: (form: Form) => void;
    onCreate: () => void;
    loading?: boolean;
    error?: string | null;
}

export type FormListRef = HTMLDivElement;

export interface FormCardProps {
    form: Form;
    onEdit: (form: Form) => void;
    onDelete: (formId: string) => void;
    onDuplicate: (form: Form) => void;
}

export interface UseFormListReturn {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredForms: Form[];
    handleCreateForm: () => void;
    handleEditForm: (form: Form) => void;
    handleDeleteForm: (formId: string) => void;
    handleDuplicateForm: (form: Form) => void;
}
