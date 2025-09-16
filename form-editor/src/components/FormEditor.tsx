'use client';

import React from 'react';
import { Form } from '@/shared/types';
import { FormEditor as RefactoredFormEditor } from './forms/FormEditor/FormEditor';

interface FormEditorProps {
  form: Form | null;
  onSave: (form: Form) => void;
  onCancel: () => void;
  mode?: 'create' | 'edit';
}

/**
 * FormEditor コンポーネント
 * リファクタリングされたFormEditorのラッパー
 */
export default function FormEditor(props: FormEditorProps) {
  return <RefactoredFormEditor {...props} />;
}