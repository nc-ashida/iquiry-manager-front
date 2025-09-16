import { Form, FormField } from '@/shared/types';

export interface FieldEditorProps {
    form: Form | null;
    onAddField: (field: Omit<FormField, 'id'>) => string | undefined;
    onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
    onDeleteField: (fieldId: string) => void;
    onMoveField: (fieldId: string, direction: 'up' | 'down') => void;
    onDuplicateField: (fieldId: string) => void;
}

export type FieldEditorRef = HTMLDivElement;

export interface FieldTypeOption {
    type: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

export interface SortableFieldProps {
    field: FormField;
    index: number;
    isExpanded: boolean;
    isHighlighted: boolean;
    onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
    onDelete: (fieldId: string) => void;
    onMove: (fieldId: string, direction: 'up' | 'down') => void;
    onDuplicate: (fieldId: string) => void;
    onToggleExpanded: (fieldId: string) => void;
    fieldTypes: FieldTypeOption[];
    sensors: ReturnType<typeof import('@dnd-kit/core').useSensors>;
    onOptionDragEnd: (event: import('@dnd-kit/core').DragEndEvent, fieldId: string) => void;
    onOptionUpdate: (fieldId: string, index: number, value: string) => void;
    onOptionDelete: (fieldId: string, index: number) => void;
    totalFields: number;
}

export interface SortableOptionProps {
    option: string;
    index: number;
    fieldId: string;
    onUpdate: (fieldId: string, index: number, value: string) => void;
    onDelete: (fieldId: string, index: number) => void;
}
