'use client';

import React from 'react';
import { Form } from '@/shared/types';
import { FormList as RefactoredFormList } from './forms/FormList/FormList';

interface FormListProps {
  forms: Form[];
  onCreateForm: () => void;
  onEditForm: (form: Form) => void;
  onDeleteForm: (formId: string) => void;
  onPreviewForm: (form: Form) => void;
  onDuplicateForm: (form: Form) => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * FormList コンポーネント
 * リファクタリングされたFormListのラッパー
 */
export default function FormList(props: FormListProps) {
  const {
    forms,
    onCreateForm,
    onEditForm,
    onDeleteForm,
    onDuplicateForm,
    loading = false,
    error = null
  } = props;

  return (
    <RefactoredFormList
      forms={forms}
      onCreate={onCreateForm}
      onEdit={onEditForm}
      onDelete={onDeleteForm}
      onDuplicate={onDuplicateForm}
      loading={loading}
      error={error}
    />
  );
}