'use client';

import { useState, useEffect } from 'react';
import { Form, FormField, Signature } from '@/shared/types';
import { generateId } from '@/shared/utils/dataManager';
import FormPreview from './FormPreview';
import SettingsEditor from './SettingsEditor';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Type,
  FileText,
  List,
  Radio,
  CheckSquare,
  GripVertical,
  Trash2,
  Info,
  Copy,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import FadeIn from '@/components/animations/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FormEditorProps {
  form: Form | null;
  onSave: (form: Form) => void;
  onCancel: () => void;
}

interface SortableOptionProps {
  option: string;
  index: number;
  fieldId: string;
  onUpdate: (fieldId: string, index: number, value: string) => void;
  onDelete: (fieldId: string, index: number) => void;
}

interface SortableFieldProps {
  field: FormField;
  index: number;
  isExpanded: boolean;
  isHighlighted: boolean;
  onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  onDelete: (fieldId: string) => void;
  onMove: (fieldId: string, direction: 'up' | 'down') => void;
  onDuplicate: (fieldId: string) => void;
  onToggleExpanded: (fieldId: string) => void;
  fieldTypes: Array<{ type: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
  sensors: ReturnType<typeof useSensors>;
  onOptionDragEnd: (event: DragEndEvent, fieldId: string) => void;
  onOptionUpdate: (fieldId: string, index: number, value: string) => void;
  onOptionDelete: (fieldId: string, index: number) => void;
  totalFields: number;
}

function SortableOption({ option, index, fieldId, onUpdate, onDelete }: SortableOptionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `option-${fieldId}-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-2"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-move p-1 hover:bg-gray-100 rounded"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </div>
      <Input
        value={option}
        onChange={(e) => onUpdate(fieldId, index, e.target.value)}
        className="h-8 sm:h-9 flex-1"
        placeholder={`選択肢 ${index + 1}`}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(fieldId, index)}
        className="h-8 w-8 p-0 flex-shrink-0 hover:bg-red-100 hover:text-red-600"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

function SortableField({
  field,
  index,
  isExpanded,
  isHighlighted,
  onUpdate,
  onDelete,
  onMove,
  onDuplicate,
  onToggleExpanded,
  fieldTypes,
  sensors,
  onOptionDragEnd,
  onOptionUpdate,
  onOptionDelete,
  totalFields
}: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = fieldTypes.find(ft => ft.type === field.type)?.icon || Type;


  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      data-field-id={field.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group relative ${isHighlighted ? 'ring-2 ring-green-500 ring-opacity-50 bg-green-50' : ''
        }`}
    >

      <Card
        className={`transition-all duration-200 hover:shadow-md cursor-pointer ${isExpanded ? 'ring-2 ring-primary ring-opacity-50' : ''
          }`}
        onClick={() => {
          onToggleExpanded(field.id);
        }}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-move p-1 hover:bg-gray-100 rounded flex-shrink-0"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <Icon className="h-4 w-4 text-primary flex-shrink-0" />


            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">
                {field.label}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                {fieldTypes.find(ft => ft.type === field.type)?.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </div>
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(field.id, 'up');
                }}
                disabled={index === 0}
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(field.id, 'down');
                }}
                disabled={index === totalFields - 1}
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(field.id);
                }}
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 hover:text-blue-600"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(field.id);
                }}
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* インライン編集パネル */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="mt-2 border-l-4 border-l-primary bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>項目設定</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  選択した項目の詳細設定を行います
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs sm:text-sm font-medium">ラベル</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                    className="h-8 sm:h-9 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs sm:text-sm font-medium">プレースホルダー</Label>
                  <Input
                    value={field.placeholder || ''}
                    onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                    className="h-8 sm:h-9 mt-1"
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor={`required-${field.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      必須項目
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      この項目を必須入力にします
                    </p>
                  </div>
                  <Switch
                    id={`required-${field.id}`}
                    checked={field.required}
                    onCheckedChange={(checked: boolean) => onUpdate(field.id, { required: checked })}
                  />
                </div>

                {/* バリデーション設定 */}
                {field.type === 'text' && (
                  <div className="space-y-3">
                    <Label className="text-xs sm:text-sm font-medium">バリデーション設定</Label>
                    <div className="space-y-2">
                      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor={`minLength-${field.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            最小文字数
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            入力文字数の最小値を設定します
                          </p>
                        </div>
                        <Switch
                          id={`minLength-${field.id}`}
                          checked={field.validation?.minLength ? true : false}
                          onCheckedChange={(checked: boolean) => {
                            const validation = field.validation || {};
                            if (checked) {
                              onUpdate(field.id, {
                                validation: { ...validation, minLength: 1 }
                              });
                            } else {
                              const { minLength: _, ...rest } = validation;
                              onUpdate(field.id, {
                                validation: Object.keys(rest).length > 0 ? rest : undefined
                              });
                            }
                          }}
                        />
                      </div>
                      {field.validation?.minLength && (
                        <Input
                          type="number"
                          value={field.validation.minLength}
                          onChange={(e) => {
                            const validation = field.validation || {};
                            onUpdate(field.id, {
                              validation: { ...validation, minLength: parseInt(e.target.value) || 1 }
                            });
                          }}
                          className="h-8 sm:h-9"
                          placeholder="最小文字数"
                        />
                      )}

                      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor={`maxLength-${field.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            最大文字数
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            入力文字数の最大値を設定します
                          </p>
                        </div>
                        <Switch
                          id={`maxLength-${field.id}`}
                          checked={field.validation?.maxLength ? true : false}
                          onCheckedChange={(checked: boolean) => {
                            const validation = field.validation || {};
                            if (checked) {
                              onUpdate(field.id, {
                                validation: { ...validation, maxLength: 100 }
                              });
                            } else {
                              const { maxLength: _, ...rest } = validation;
                              onUpdate(field.id, {
                                validation: Object.keys(rest).length > 0 ? rest : undefined
                              });
                            }
                          }}
                        />
                      </div>
                      {field.validation?.maxLength && (
                        <Input
                          type="number"
                          value={field.validation.maxLength}
                          onChange={(e) => {
                            const validation = field.validation || {};
                            onUpdate(field.id, {
                              validation: { ...validation, maxLength: parseInt(e.target.value) || 100 }
                            });
                          }}
                          className="h-8 sm:h-9"
                          placeholder="最大文字数"
                        />
                      )}

                      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor={`pattern-${field.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            メール形式
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            メールアドレスの形式をチェックします
                          </p>
                        </div>
                        <Switch
                          id={`pattern-${field.id}`}
                          checked={field.validation?.pattern ? true : false}
                          onCheckedChange={(checked: boolean) => {
                            const validation = field.validation || {};
                            if (checked) {
                              onUpdate(field.id, {
                                validation: { ...validation, pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }
                              });
                            } else {
                              const { pattern: _, ...rest } = validation;
                              onUpdate(field.id, {
                                validation: Object.keys(rest).length > 0 ? rest : undefined
                              });
                            }
                          }}
                        />
                      </div>
                      {field.validation?.pattern && (
                        <Input
                          value={field.validation.pattern}
                          onChange={(e) => {
                            const validation = field.validation || {};
                            onUpdate(field.id, {
                              validation: { ...validation, pattern: e.target.value }
                            });
                          }}
                          className="h-8 sm:h-9"
                          placeholder="正規表現パターン"
                        />
                      )}
                    </div>
                  </div>
                )}

                {field.type === 'textarea' && (
                  <div className="space-y-3">
                    <Label className="text-xs sm:text-sm font-medium">バリデーション設定</Label>
                    <div className="space-y-2">
                      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor={`textarea-minLength-${field.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            最小文字数
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            入力文字数の最小値を設定します
                          </p>
                        </div>
                        <Switch
                          id={`textarea-minLength-${field.id}`}
                          checked={field.validation?.minLength ? true : false}
                          onCheckedChange={(checked: boolean) => {
                            const validation = field.validation || {};
                            if (checked) {
                              onUpdate(field.id, {
                                validation: { ...validation, minLength: 10 }
                              });
                            } else {
                              const { minLength: _, ...rest } = validation;
                              onUpdate(field.id, {
                                validation: Object.keys(rest).length > 0 ? rest : undefined
                              });
                            }
                          }}
                        />
                      </div>
                      {field.validation?.minLength && (
                        <Input
                          type="number"
                          value={field.validation.minLength}
                          onChange={(e) => {
                            const validation = field.validation || {};
                            onUpdate(field.id, {
                              validation: { ...validation, minLength: parseInt(e.target.value) || 10 }
                            });
                          }}
                          className="h-8 sm:h-9"
                          placeholder="最小文字数"
                        />
                      )}

                      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor={`textarea-maxLength-${field.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            最大文字数
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            入力文字数の最大値を設定します
                          </p>
                        </div>
                        <Switch
                          id={`textarea-maxLength-${field.id}`}
                          checked={field.validation?.maxLength ? true : false}
                          onCheckedChange={(checked: boolean) => {
                            const validation = field.validation || {};
                            if (checked) {
                              onUpdate(field.id, {
                                validation: { ...validation, maxLength: 1000 }
                              });
                            } else {
                              const { maxLength: _, ...rest } = validation;
                              onUpdate(field.id, {
                                validation: Object.keys(rest).length > 0 ? rest : undefined
                              });
                            }
                          }}
                        />
                      </div>
                      {field.validation?.maxLength && (
                        <Input
                          type="number"
                          value={field.validation.maxLength}
                          onChange={(e) => {
                            const validation = field.validation || {};
                            onUpdate(field.id, {
                              validation: { ...validation, maxLength: parseInt(e.target.value) || 1000 }
                            });
                          }}
                          className="h-8 sm:h-9"
                          placeholder="最大文字数"
                        />
                      )}
                    </div>
                  </div>
                )}

                {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                  <div className="space-y-3">
                    <Label className="text-xs sm:text-sm font-medium">選択肢設定</Label>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => onOptionDragEnd(event, field.id)}
                    >
                      <SortableContext
                        items={field.options?.map((_, index) => `option-${field.id}-${index}`) || []}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {field.options?.map((option, optionIndex) => (
                            <SortableOption
                              key={`option-${field.id}-${optionIndex}`}
                              option={option}
                              index={optionIndex}
                              fieldId={field.id}
                              onUpdate={onOptionUpdate}
                              onDelete={onOptionDelete}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...(field.options || []), '新しい選択肢'];
                        onUpdate(field.id, { options: newOptions });
                      }}
                      className="w-full h-8 sm:h-9 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      <span className="text-xs sm:text-sm">選択肢を追加</span>
                    </Button>

                    {/* 選択項目の追加設定 */}
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor={`allowOther-${field.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            「その他」オプションを追加
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            自由入力の「その他」選択肢を追加します
                          </p>
                        </div>
                        <Switch
                          id={`allowOther-${field.id}`}
                          checked={field.allowOther || false}
                          onCheckedChange={(checked: boolean) => onUpdate(field.id, { allowOther: checked })}
                        />
                      </div>

                      {field.type === 'select' && (
                        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <Label
                              htmlFor={`multiple-${field.id}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              複数選択を許可
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              複数の選択肢を同時に選択できるようにします
                            </p>
                          </div>
                          <Switch
                            id={`multiple-${field.id}`}
                            checked={field.multiple || false}
                            onCheckedChange={(checked: boolean) => onUpdate(field.id, { multiple: checked })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FormEditor({ form, onSave, onCancel }: FormEditorProps) {
  const [currentForm, setCurrentForm] = useState<Form | null>(form);
  const [showPreview, setShowPreview] = useState(false);
  const [signatures, setSignatures] = useState<Signature[]>([]);

  // ドラッグアンドドロップのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [expandedField, setExpandedField] = useState<string | null>(null);

  // 署名データの読み込み
  useEffect(() => {
    loadSignatures();
  }, []);

  const loadSignatures = async () => {
    try {
      const response = await fetch('/api/signatures');
      if (response.ok) {
        const data = await response.json();
        setSignatures(data);
      } else {
        // フォールバック: ローカルデータを使用
        const { signatures: localData } = await import('@/data/signatures');
        setSignatures(localData);
      }
    } catch (error) {
      console.error('署名データの読み込みに失敗しました:', error);
      // フォールバック: ローカルデータを使用
      try {
        const { signatures: localData } = await import('@/data/signatures');
        setSignatures(localData);
      } catch (localError) {
        console.error('ローカルデータの読み込みにも失敗しました:', localError);
      }
    }
  };

  useEffect(() => {
    setCurrentForm(form);
  }, [form]);

  if (!currentForm) return null;

  const handleFormChange = (updates: Partial<Form>) => {
    setCurrentForm({ ...currentForm, ...updates });
  };

  const handleFieldAdd = (type: string) => {
    const newField: FormField = {
      id: generateId(),
      type: type as FormField['type'],
      label: '新しい項目',
      placeholder: '',
      required: false,
      order: currentForm.fields.length,
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['選択肢1', '選択肢2'] : undefined
    };

    handleFormChange({
      fields: [...currentForm.fields, newField]
    });

    // 追加した項目を選択状態にして、その項目にフォーカス
    setTimeout(() => {
      setHighlightedField(newField.id);
      setExpandedField(newField.id);

      // 追加した項目が画面内に表示されるようにスクロール
      const addedField = document.querySelector(`[data-field-id="${newField.id}"]`);
      if (addedField) {
        addedField.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }

      // ハイライト効果を3秒後に解除
      setTimeout(() => {
        setHighlightedField(null);
      }, 3000);
    }, 100);
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    const updatedFields = currentForm.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    handleFormChange({ fields: updatedFields });
  };

  const handleFieldDelete = (fieldId: string) => {
    const updatedFields = currentForm.fields.filter(field => field.id !== fieldId);
    handleFormChange({ fields: updatedFields });
  };

  const handleSave = () => {
    onSave(currentForm);
  };

  const fieldTypes = [
    { type: 'text', label: 'テキスト', icon: Type, description: '1行のテキスト入力' },
    { type: 'textarea', label: '長文テキスト', icon: FileText, description: '複数行のテキスト入力' },
    { type: 'select', label: '選択肢', icon: List, description: 'ドロップダウン選択' },
    { type: 'radio', label: 'ラジオボタン', icon: Radio, description: '単一選択' },
    { type: 'checkbox', label: 'チェックボックス', icon: CheckSquare, description: '複数選択' }
  ];


  const duplicateField = (fieldId: string) => {
    const field = currentForm.fields.find(f => f.id === fieldId);
    if (!field) return;

    const newField: FormField = {
      ...field,
      id: generateId(),
      label: `${field.label} (コピー)`,
      order: currentForm.fields.length
    };

    handleFormChange({
      fields: [...currentForm.fields, newField]
    });
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = currentForm.fields.findIndex(f => f.id === fieldId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= currentForm.fields.length) return;

    const newFields = [...currentForm.fields];
    [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];

    // order を更新
    newFields.forEach((field, index) => {
      field.order = index;
    });

    handleFormChange({ fields: newFields });
  };

  // 選択肢の並び替えを処理する関数
  const handleOptionDragEnd = (event: DragEndEvent, fieldId: string) => {
    const { active, over } = event;

    if (!over || !currentForm) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const field = currentForm.fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;

    const oldIndex = field.options.findIndex((_, index) => `option-${fieldId}-${index}` === activeId);
    const newIndex = field.options.findIndex((_, index) => `option-${fieldId}-${index}` === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOptions = arrayMove(field.options, oldIndex, newIndex);
    handleFieldUpdate(fieldId, { options: newOptions });
  };

  // 選択肢の更新を処理する関数
  const handleOptionUpdate = (fieldId: string, optionIndex: number, value: string) => {
    if (!currentForm) return;

    const field = currentForm.fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;

    const newOptions = [...field.options];
    newOptions[optionIndex] = value;
    handleFieldUpdate(fieldId, { options: newOptions });
  };

  // 選択肢の削除を処理する関数
  const handleOptionDelete = (fieldId: string, optionIndex: number) => {
    if (!currentForm) return;

    const field = currentForm.fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;

    const newOptions = field.options.filter((_, i) => i !== optionIndex);
    handleFieldUpdate(fieldId, { options: newOptions });
  };

  // フォーム項目の並び替えを処理する関数


  const handleFieldDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !currentForm) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const oldIndex = currentForm.fields.findIndex(field => field.id === activeId);
    const newIndex = currentForm.fields.findIndex(field => field.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newFields = arrayMove(currentForm.fields, oldIndex, newIndex);

    // orderプロパティを更新
    newFields.forEach((field, index) => {
      field.order = index;
    });

    setCurrentForm({ ...currentForm, fields: newFields });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <FadeIn>
        <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
              <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="flex items-center space-x-2 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>戻る</span>
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold truncate">フォーム編集</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">直感的にフォームを作成・編集</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 h-9 flex-1 sm:flex-none hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{showPreview ? '編集' : 'プレビュー'}</span>
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex items-center space-x-2 h-9 flex-1 sm:flex-none bg-black hover:bg-gray-800 text-white shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-sm">保存</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* メインコンテンツ */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto">
          {/* フォーム編集エリア */}
          <div className="space-y-4 sm:space-y-6">
            {/* フォーム基本情報と設定 */}
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-lg">基本情報・設定</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 基本情報セクション */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <span className="text-sm font-medium text-gray-600 px-3">基本情報</span>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="form-name" className="text-sm font-medium">
                          フォーム名 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="form-name"
                          type="text"
                          value={currentForm.name}
                          onChange={(e) => handleFormChange({ name: e.target.value })}
                          placeholder="フォーム名を入力"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="form-description" className="text-sm font-medium">説明</Label>
                        <Input
                          id="form-description"
                          type="text"
                          value={currentForm.description || ''}
                          onChange={(e) => handleFormChange({ description: e.target.value })}
                          placeholder="フォームの説明を入力"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 設定セクション */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <span className="text-sm font-medium text-gray-600 px-3">設定</span>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    {/* 自動返信設定 */}
                    <div className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
                      <div className="space-y-2 flex-1 pr-4">
                        <Label
                          htmlFor="autoReply"
                          className="text-base font-semibold cursor-pointer text-gray-900"
                        >
                          自動返信
                        </Label>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          フォーム送信時に自動返信メールを送信します
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Switch
                          id="autoReply"
                          checked={currentForm.settings.autoReply}
                          onCheckedChange={(checked: boolean) =>
                            handleFormChange({
                              settings: { ...currentForm.settings, autoReply: checked }
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* 添付ファイル設定 */}
                    <div className="space-y-4">
                      <div className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
                        <div className="space-y-2 flex-1 pr-4">
                          <Label
                            htmlFor="fileUpload"
                            className="text-base font-semibold cursor-pointer text-gray-900"
                          >
                            添付ファイル
                          </Label>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            このフォームで添付ファイルの送信を許可します
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Switch
                            id="fileUpload"
                            checked={currentForm.settings.fileUpload?.enabled || false}
                            onCheckedChange={(checked: boolean) => {
                              const currentFileUpload = currentForm.settings.fileUpload || {
                                enabled: false,
                                maxFiles: 1,
                                maxFileSize: 10
                              };
                              handleFormChange({
                                settings: {
                                  ...currentForm.settings,
                                  fileUpload: {
                                    ...currentFileUpload,
                                    enabled: checked
                                  }
                                }
                              });
                            }}
                          />
                        </div>
                      </div>

                      {/* 添付ファイルの詳細設定 */}
                      {currentForm.settings.fileUpload?.enabled && (
                        <div className="space-y-6 pl-8 border-l-2 border-black bg-gray-50/50 p-6 rounded-r-xl">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <Label htmlFor="maxFiles" className="text-sm font-semibold text-gray-900">
                                最大ファイル数
                              </Label>
                              <Input
                                id="maxFiles"
                                type="number"
                                min="1"
                                max="5"
                                value={currentForm.settings.fileUpload?.maxFiles || 1}
                                onChange={(e) => {
                                  const value = Math.min(5, Math.max(1, parseInt(e.target.value) || 1));
                                  handleFormChange({
                                    settings: {
                                      ...currentForm.settings,
                                      fileUpload: {
                                        ...currentForm.settings.fileUpload!,
                                        maxFiles: value
                                      }
                                    }
                                  });
                                }}
                                className="h-10"
                              />
                              <p className="text-sm text-gray-600">1〜5ファイルまで</p>
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor="maxFileSize" className="text-sm font-semibold text-gray-900">
                                1ファイルあたりの最大容量 (MB)
                              </Label>
                              <Input
                                id="maxFileSize"
                                type="number"
                                min="1"
                                max="20"
                                value={currentForm.settings.fileUpload?.maxFileSize || 10}
                                onChange={(e) => {
                                  const value = Math.min(20, Math.max(1, parseInt(e.target.value) || 1));
                                  handleFormChange({
                                    settings: {
                                      ...currentForm.settings,
                                      fileUpload: {
                                        ...currentForm.settings.fileUpload!,
                                        maxFileSize: value
                                      }
                                    }
                                  });
                                }}
                                className="h-10"
                              />
                              <p className="text-sm text-gray-600">1〜20MBまで</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-lg border border-gray-200">
                            💡 添付ファイルは自動的にフォームの最後に表示されます
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 許可ドメイン設定 */}
                    <div className="space-y-4">
                      <div className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
                        <div className="space-y-2 flex-1 pr-4">
                          <Label
                            htmlFor="allowedDomains"
                            className="text-base font-semibold cursor-pointer text-gray-900"
                          >
                            許可ドメイン設定
                          </Label>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            問合せ受付を許可するドメインを指定します（CORS設定用）
                          </p>
                        </div>
                      </div>

                      {/* ドメイン一覧 */}
                      <div className="space-y-4 pl-8 border-l-2 border-blue-200 bg-blue-50/30 p-6 rounded-r-xl">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-900">
                            許可ドメイン一覧
                          </Label>
                          <p className="text-xs text-gray-600">
                            例: example.com, subdomain.example.com, localhost:3000
                          </p>

                          {/* ドメイン入力エリア */}
                          <div className="space-y-2">
                            {currentForm.settings.allowedDomains?.map((domain, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Input
                                  type="text"
                                  value={domain}
                                  onChange={(e) => {
                                    const newDomains = [...(currentForm.settings.allowedDomains || [])];
                                    newDomains[index] = e.target.value;
                                    handleFormChange({
                                      settings: {
                                        ...currentForm.settings,
                                        allowedDomains: newDomains
                                      }
                                    });
                                  }}
                                  placeholder="example.com"
                                  className={`flex-1 ${!domain.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const currentDomains = currentForm.settings.allowedDomains || [];
                                    // 最低1つは残す必要がある
                                    if (currentDomains.length <= 1) {
                                      return; // 削除を無効化
                                    }
                                    const newDomains = [...currentDomains];
                                    newDomains.splice(index, 1);
                                    handleFormChange({
                                      settings: {
                                        ...currentForm.settings,
                                        allowedDomains: newDomains
                                      }
                                    });
                                  }}
                                  disabled={(currentForm.settings.allowedDomains || []).length <= 1}
                                  className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${(currentForm.settings.allowedDomains || []).length <= 1
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                    }`}
                                >
                                  削除
                                </Button>
                              </div>
                            )) || []}

                            {/* ドメイン追加ボタン */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentDomains = currentForm.settings.allowedDomains || [];
                                // 空のドメインがある場合は追加しない
                                if (currentDomains.some(domain => !domain.trim())) {
                                  return;
                                }
                                const newDomains = [...currentDomains, ''];
                                handleFormChange({
                                  settings: {
                                    ...currentForm.settings,
                                    allowedDomains: newDomains
                                  }
                                });
                              }}
                              disabled={(currentForm.settings.allowedDomains || []).some(domain => !domain.trim())}
                              className={`w-full border-dashed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 ${(currentForm.settings.allowedDomains || []).some(domain => !domain.trim())
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                                }`}
                            >
                              + ドメインを追加
                            </Button>
                          </div>

                          {/* バリデーションエラー表示 */}
                          {(!currentForm.settings.allowedDomains ||
                            currentForm.settings.allowedDomains.length === 0 ||
                            currentForm.settings.allowedDomains.some(domain => !domain.trim())) && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start space-x-2">
                                  <div className="text-red-600 text-sm">❌</div>
                                  <div className="text-xs text-red-800">
                                    <p className="font-medium mb-1">必須設定エラー:</p>
                                    <ul className="space-y-1 text-xs">
                                      <li>• 最低1つ以上のドメインを登録してください</li>
                                      <li>• 空のドメインは登録できません</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* 注意事項 */}
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <div className="text-yellow-600 text-sm">⚠️</div>
                              <div className="text-xs text-yellow-800">
                                <p className="font-medium mb-1">設定時の注意事項:</p>
                                <ul className="space-y-1 text-xs">
                                  <li>• <strong>最低1つ以上のドメイン登録が必須です</strong></li>
                                  <li>• プロトコル（http://, https://）は不要です</li>
                                  <li>• ポート番号を含める場合は「:」で区切ってください</li>
                                  <li>• ワイルドカード（*）は使用できません</li>
                                  <li>• 開発環境では「localhost:3000」などを追加してください</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 送信設定 */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">送信設定</Label>
                      <SettingsEditor
                        settings={currentForm.settings}
                        signatures={signatures}
                        onSettingsChange={(settings) => handleFormChange({ settings })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>


            {/* 項目リスト */}
            <FadeIn delay={0.3}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">フォーム項目</CardTitle>
                      <CardDescription>{currentForm.fields.length} 個の項目</CardDescription>
                    </div>
                    <Badge variant={currentForm.settings.autoReply ? "default" : "outline"}>
                      {currentForm.settings.autoReply ? "自動返信ON" : "自動返信OFF"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {currentForm.fields.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">項目がありません</p>
                      <p className="text-sm">下の「項目を追加」ボタンから項目を追加してください</p>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleFieldDragEnd}
                    >
                      <SortableContext
                        items={currentForm.fields.map(field => field.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {currentForm.fields.map((field, index) => {
                            const isHighlighted = highlightedField === field.id;
                            const isExpanded = expandedField === field.id;

                            return (
                              <SortableField
                                key={field.id}
                                field={field}
                                index={index}
                                isExpanded={isExpanded}
                                isHighlighted={isHighlighted}
                                onUpdate={handleFieldUpdate}
                                onDelete={handleFieldDelete}
                                onMove={moveField}
                                onDuplicate={duplicateField}
                                onToggleExpanded={(fieldId) => {
                                  setExpandedField(expandedField === fieldId ? null : fieldId);
                                }}
                                fieldTypes={fieldTypes}
                                sensors={sensors}
                                onOptionDragEnd={handleOptionDragEnd}
                                onOptionUpdate={handleOptionUpdate}
                                onOptionDelete={handleOptionDelete}
                                totalFields={currentForm.fields.length}
                              />
                            );
                          })}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}

                  {/* 項目追加コマンドパレット */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-medium">項目を追加</h3>
                        <p className="text-xs text-muted-foreground">新しい項目をフォームに追加します</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {fieldTypes.map((fieldType) => {
                        const Icon = fieldType.icon;
                        return (
                          <Button
                            key={fieldType.type}
                            variant="outline"
                            size="sm"
                            onClick={() => handleFieldAdd(fieldType.type)}
                            className="h-auto p-3 flex flex-col items-center space-y-2 hover:bg-primary/5 hover:border-primary/20"
                          >
                            <Icon className="h-4 w-4 text-primary" />
                            <div className="text-center">
                              <div className="text-xs font-medium leading-tight">{fieldType.label}</div>
                              <div className="text-xs text-muted-foreground leading-tight hidden sm:block">{fieldType.description}</div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* フローティングアクションボタン */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-30"
      >
        <div className="relative group">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            onClick={() => handleFieldAdd('text')}
          >
            <Plus className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-16 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              項目を追加
            </div>
          </div>
        </div>
      </motion.div>

      {/* プレビューモーダル */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">プレビュー</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowPreview(false)}
                    className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600"
                  >
                    ×
                  </Button>
                </div>
                <FormPreview form={currentForm} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}