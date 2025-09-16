'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { FormField, ValidationType } from '@/shared/types';
import {
    Plus,
    Type,
    FileText,
    List,
    Radio,
    CheckSquare,
    GripVertical,
    Trash2,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FieldEditorProps, FieldEditorRef, SortableFieldProps, SortableOptionProps } from './FieldEditor.types';
import { useFieldEditor } from './FieldEditor.hooks';

// フィールドタイプの定義
const fieldTypes = [
    { type: 'text', label: 'テキスト', icon: Type },
    { type: 'textarea', label: 'テキストエリア', icon: FileText },
    { type: 'select', label: 'セレクト', icon: List },
    { type: 'radio', label: 'ラジオボタン', icon: Radio },
    { type: 'checkbox', label: 'チェックボックス', icon: CheckSquare },
];

// ソート可能なオプションコンポーネント
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
            className="flex items-center space-x-2 p-2 bg-gray-50 rounded border"
        >
            <div {...attributes} {...listeners} className="cursor-grab">
                <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <Input
                value={option}
                onChange={(e) => onUpdate(fieldId, index, e.target.value)}
                className="flex-1"
                placeholder="オプション名"
            />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(fieldId, index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

// ソート可能なフィールドコンポーネント
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
    totalFields,
}: SortableFieldProps) {
    const labelInputRef = useRef<HTMLInputElement>(null);

    // フィールドが展開された時にラベル入力フィールドにフォーカスを移動
    useEffect(() => {
        if (isExpanded && labelInputRef.current) {
            // 少し遅延させてからフォーカスを移動（アニメーション完了後）
            const timer = setTimeout(() => {
                labelInputRef.current?.focus();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isExpanded]);

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

    const fieldType = fieldTypes.find(ft => ft.type === field.type);
    const Icon = fieldType?.icon || Type;

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            id={`field-${field.id}`}
            className={`border rounded-lg transition-all duration-200 ${isHighlighted ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm'
                } ${isDragging ? 'shadow-xl' : ''}`}
        >
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div {...attributes} {...listeners} className="cursor-grab">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <Icon className="h-5 w-5 text-gray-600" />
                            <div>
                                <CardTitle className="text-base">{field.label || '無題のフィールド'}</CardTitle>
                                <CardDescription className="text-sm flex items-center gap-2 flex-wrap">
                                    <span>{fieldType?.label}</span>
                                    {field.required && <Badge variant="secondary" className="text-xs">必須</Badge>}
                                    {field.validation?.type && (
                                        <Badge variant="outline" className="text-xs">
                                            {field.validation.type === 'email' && 'メール'}
                                            {field.validation.type === 'phone' && '電話'}
                                            {field.validation.type === 'number' && '数値'}
                                            {field.validation.type === 'text' && 'テキスト'}
                                        </Badge>
                                    )}
                                    {(field.validation?.minLength || field.validation?.maxLength) && (
                                        <Badge variant="outline" className="text-xs">
                                            {field.validation.minLength && field.validation.maxLength
                                                ? `${field.validation.minLength}-${field.validation.maxLength}文字`
                                                : field.validation.minLength
                                                    ? `${field.validation.minLength}文字以上`
                                                    : `${field.validation.maxLength}文字以下`
                                            }
                                        </Badge>
                                    )}
                                    {field.validation?.pattern && (
                                        <Badge variant="outline" className="text-xs">カスタム</Badge>
                                    )}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onToggleExpanded(field.id)}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                                {isExpanded ? '折りたたむ' : '展開'}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMove(field.id, 'up')}
                                disabled={index === 0}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMove(field.id, 'down')}
                                disabled={index === totalFields - 1}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDuplicate(field.id)}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(field.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {isExpanded && (
                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            {/* 基本設定 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`label-${field.id}`}>ラベル</Label>
                                    <Input
                                        ref={labelInputRef}
                                        id={`label-${field.id}`}
                                        value={field.label}
                                        onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                                        placeholder="フィールドラベル"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`placeholder-${field.id}`}>プレースホルダー</Label>
                                    <Input
                                        id={`placeholder-${field.id}`}
                                        value={field.placeholder || ''}
                                        onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                                        placeholder="プレースホルダーテキスト"
                                    />
                                </div>
                            </div>

                            {/* 必須設定 */}
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`required-${field.id}`}
                                    checked={field.required}
                                    onCheckedChange={(checked) => onUpdate(field.id, { required: checked })}
                                />
                                <Label htmlFor={`required-${field.id}`}>必須項目</Label>
                            </div>

                            {/* バリデーション設定（テキスト系フィールドのみ） */}
                            {(field.type === 'text' || field.type === 'textarea') && (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold text-gray-900">バリデーション設定</Label>
                                        <Badge variant="outline" className="text-xs">オプション</Badge>
                                    </div>

                                    {/* バリデーションタイプ（テキストフィールドのみ表示） */}
                                    {field.type === 'text' && (
                                        <div className="space-y-2">
                                            <Label htmlFor={`validation-type-${field.id}`} className="text-sm text-gray-700">
                                                バリデーションタイプ
                                            </Label>
                                            <Select
                                                value={field.validation?.type || 'none'}
                                                onValueChange={(value) => {
                                                    const newValidation = {
                                                        ...field.validation,
                                                        type: value === 'none' ? undefined : value as ValidationType
                                                    };

                                                    // バリデーションタイプに応じてデフォルトパターンを設定
                                                    // ただし、既にカスタムパターンが入力されている場合は保持
                                                    if (value === 'email') {
                                                        // メールアドレスのデフォルトパターン
                                                        if (!field.validation?.pattern) {
                                                            newValidation.pattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
                                                        }
                                                    } else if (value === 'phone') {
                                                        // 電話番号のデフォルトパターン（日本の電話番号形式）
                                                        if (!field.validation?.pattern) {
                                                            newValidation.pattern = '^[0-9]{2,4}-[0-9]{2,4}-[0-9]{4}$';
                                                        }
                                                    } else if (value === 'number') {
                                                        // 数値のデフォルトパターン
                                                        if (!field.validation?.pattern) {
                                                            newValidation.pattern = '^[0-9]+$';
                                                        }
                                                    } else if (value === 'none' || value === 'text') {
                                                        // なしまたはテキストの場合はパターンをクリア
                                                        newValidation.pattern = undefined;
                                                    }

                                                    onUpdate(field.id, { validation: newValidation });
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="バリデーションタイプを選択" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">なし</SelectItem>
                                                    <SelectItem value="email">メールアドレス</SelectItem>
                                                    <SelectItem value="phone">電話番号</SelectItem>
                                                    <SelectItem value="number">数値</SelectItem>
                                                    <SelectItem value="text">テキスト</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* 文字数制限 */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`min-length-${field.id}`} className="text-sm text-gray-700">
                                                最小文字数
                                            </Label>
                                            <Input
                                                id={`min-length-${field.id}`}
                                                type="number"
                                                min="0"
                                                value={field.validation?.minLength || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                                                    const newValidation = {
                                                        ...field.validation,
                                                        minLength: value,
                                                        // テキストエリアの場合は内部的にtypeを'text'に設定
                                                        type: field.type === 'textarea' ? 'text' : field.validation?.type
                                                    };
                                                    onUpdate(field.id, { validation: newValidation });
                                                }}
                                                placeholder="例: 3"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`max-length-${field.id}`} className="text-sm text-gray-700">
                                                最大文字数
                                            </Label>
                                            <Input
                                                id={`max-length-${field.id}`}
                                                type="number"
                                                min="1"
                                                value={field.validation?.maxLength || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                                                    const newValidation = {
                                                        ...field.validation,
                                                        maxLength: value,
                                                        // テキストエリアの場合は内部的にtypeを'text'に設定
                                                        type: field.type === 'textarea' ? 'text' : field.validation?.type
                                                    };
                                                    onUpdate(field.id, { validation: newValidation });
                                                }}
                                                placeholder="例: 100"
                                            />
                                        </div>
                                    </div>

                                    {/* カスタムパターン（テキストフィールドのみ表示） */}
                                    {field.type === 'text' && (
                                        <div className="space-y-2">
                                            <Label htmlFor={`pattern-${field.id}`} className="text-sm text-gray-700">
                                                カスタムパターン（正規表現）
                                            </Label>
                                            <Input
                                                id={`pattern-${field.id}`}
                                                value={field.validation?.pattern || ''}
                                                onChange={(e) => {
                                                    const newValidation = {
                                                        ...field.validation,
                                                        pattern: e.target.value || undefined
                                                    };
                                                    onUpdate(field.id, { validation: newValidation });
                                                }}
                                                placeholder={
                                                    field.validation?.type === 'email'
                                                        ? '例: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
                                                        : field.validation?.type === 'phone'
                                                            ? '例: ^[0-9]{2,4}-[0-9]{2,4}-[0-9]{4}$'
                                                            : field.validation?.type === 'number'
                                                                ? '例: ^[0-9]+$'
                                                                : '例: ^[0-9]{3}-[0-9]{4}-[0-9]{4}$'
                                                }
                                                className="font-mono text-sm"
                                            />
                                            <div className="text-xs text-gray-500 space-y-1">
                                                <p>正規表現を使用してカスタムバリデーションを設定できます</p>
                                                {field.validation?.type && !field.validation?.pattern && (
                                                    <p className="text-blue-600">
                                                        💡 {field.validation.type === 'email' && 'メールアドレス形式のデフォルトパターンが自動設定されます'}
                                                        {field.validation.type === 'phone' && '電話番号形式のデフォルトパターンが自動設定されます'}
                                                        {field.validation.type === 'number' && '数値形式のデフォルトパターンが自動設定されます'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* バリデーション設定の説明 */}
                                    <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                                        <p className="font-medium mb-1">バリデーション設定の説明:</p>
                                        {field.type === 'text' ? (
                                            <ul className="space-y-1">
                                                <li>• <strong>メールアドレス</strong>: 有効なメールアドレス形式をチェック（デフォルトパターン自動設定）</li>
                                                <li>• <strong>電話番号</strong>: 電話番号形式をチェック（デフォルトパターン自動設定）</li>
                                                <li>• <strong>数値</strong>: 数値のみの入力をチェック（デフォルトパターン自動設定）</li>
                                                <li>• <strong>最小/最大文字数</strong>: 入力文字数の制限を設定</li>
                                                <li>• <strong>カスタムパターン</strong>: 正規表現で独自のバリデーションを設定（デフォルトパターンを上書き）</li>
                                            </ul>
                                        ) : (
                                            <ul className="space-y-1">
                                                <li>• <strong>最小/最大文字数</strong>: 入力文字数の制限を設定</li>
                                                <li>• テキストエリアでは文字数制限のみ設定可能です</li>
                                            </ul>
                                        )}
                                        {field.type === 'text' && (
                                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                                <p className="font-medium text-yellow-800">💡 パターンの優先順位:</p>
                                                <p className="text-yellow-700">1. カスタムパターンが入力されている場合 → カスタムパターンで検証</p>
                                                <p className="text-yellow-700">2. カスタムパターンが未入力の場合 → デフォルトパターンで検証</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* オプション設定（select, radio, checkbox用） */}
                            {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>オプション</Label>
                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={(event) => onOptionDragEnd(event, field.id)}
                                        >
                                            <SortableContext
                                                items={field.options?.map((_, index) => `option-${field.id}-${index}`) || []}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="space-y-2 mt-2">
                                                    {field.options?.map((option, index) => (
                                                        <SortableOption
                                                            key={`option-${field.id}-${index}`}
                                                            option={option}
                                                            index={index}
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
                                                const newOptions = [...(field.options || []), '新しいオプション'];
                                                onUpdate(field.id, { options: newOptions });
                                            }}
                                            className="mt-2 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            オプションを追加
                                        </Button>
                                    </div>

                                    {/* 選択系フィールドの説明 */}
                                    <div className="text-xs text-gray-600 bg-green-50 p-3 rounded border border-green-200">
                                        <p className="font-medium mb-1 text-green-800">💡 選択系フィールドについて:</p>
                                        <ul className="space-y-1 text-green-700">
                                            <li>• <strong>ラジオボタン</strong>: 複数の選択肢から1つを選択</li>
                                            <li>• <strong>チェックボックス</strong>: 複数の選択肢から複数選択可能</li>
                                            <li>• <strong>セレクト</strong>: ドロップダウンから1つを選択</li>
                                            <li>• バリデーション設定は不要です（選択肢から選ぶため）</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                )}
            </Card>
        </motion.div>
    );
}

export const FieldEditor = forwardRef<FieldEditorRef, FieldEditorProps>(
    ({ form, onAddField, onUpdateField, onDeleteField, onMoveField, onDuplicateField }, ref) => {
        const [showAddField, setShowAddField] = useState(false);
        const [lastAddedFieldId, setLastAddedFieldId] = useState<string | null>(null);

        const {
            expandedFields,
            highlightedField,
            toggleFieldExpanded,
            moveOption,
            updateOption,
            deleteOption,
            expandField,
        } = useFieldEditor(
            form,
            onAddField,
            onUpdateField,
            onDeleteField,
            onMoveField,
            onDuplicateField
        );

        // 新しく追加されたフィールドにスムーススクロールする機能
        useEffect(() => {
            if (lastAddedFieldId) {
                const fieldElement = document.getElementById(`field-${lastAddedFieldId}`);
                if (fieldElement) {
                    // スムーススクロールでフィールドに移動
                    fieldElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                }
                // スクロール完了後に状態をリセット
                setLastAddedFieldId(null);
            }
        }, [lastAddedFieldId]);

        const sensors = useSensors(
            useSensor(PointerSensor),
            useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
            })
        );

        const handleDragEnd = (event: DragEndEvent) => {
            const { active, over } = event;

            if (!over || active.id === over.id) return;

            const oldIndex = form?.fields.findIndex((field: FormField) => field.id === active.id) || 0;
            const newIndex = form?.fields.findIndex((field: FormField) => field.id === over.id) || 0;

            if (oldIndex !== -1 && newIndex !== -1 && form) {
                const newFields = arrayMove(form.fields, oldIndex, newIndex);
                // フィールドの順序を更新
                newFields.forEach((field: FormField, index: number) => {
                    onUpdateField(field.id, { order: index });
                });
            }
        };

        const handleOptionDragEnd = (event: DragEndEvent, fieldId: string) => {
            const { active, over } = event;

            if (!over || active.id === over.id) return;

            const activeIndex = parseInt(active.id.toString().split('-').pop() || '0');
            const overIndex = parseInt(over.id.toString().split('-').pop() || '0');

            moveOption(fieldId, activeIndex, overIndex);
        };

        const handleAddField = (type: string) => {
            const newField: Omit<FormField, 'id'> = {
                type: type as FormField['type'],
                label: '',
                placeholder: '',
                required: false,
                order: form?.fields.length || 0,
                options: ['select', 'radio', 'checkbox'].includes(type) ? ['オプション1', 'オプション2'] : undefined,
                validation: {
                    type: undefined,
                    minLength: undefined,
                    maxLength: undefined,
                    pattern: undefined,
                    required: false
                }
            };

            const newFieldId = onAddField(newField);
            setShowAddField(false);

            // 新しく追加されたフィールドを展開状態にして、スクロール対象に設定
            if (newFieldId) {
                expandField(newFieldId);
                setLastAddedFieldId(newFieldId);
            }
        };

        const handleDuplicateField = (fieldId: string) => {
            const field = form?.fields.find((f: FormField) => f.id === fieldId);
            if (!field || !form) return;

            const duplicatedField: Omit<FormField, 'id'> = {
                ...field,
                label: `${field.label} (コピー)`,
                order: form.fields.length,
            };

            const newFieldId = onAddField(duplicatedField);

            // 複製されたフィールドも展開状態にして、スクロール対象に設定
            if (newFieldId) {
                expandField(newFieldId);
                setLastAddedFieldId(newFieldId);
            }
        };

        return (
            <div ref={ref} className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">フィールド管理</h2>
                    <Button
                        onClick={() => setShowAddField(!showAddField)}
                        className="bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        フィールドを追加
                    </Button>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {showAddField && (
                        <FadeIn>
                            <Card className="mb-4">
                                <CardHeader>
                                    <CardTitle className="text-base">フィールドタイプを選択</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {fieldTypes.map((fieldType) => {
                                            const Icon = fieldType.icon;
                                            return (
                                                <Button
                                                    key={fieldType.type}
                                                    variant="outline"
                                                    onClick={() => handleAddField(fieldType.type)}
                                                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                                                >
                                                    <Icon className="h-6 w-6" />
                                                    <span className="text-sm">{fieldType.label}</span>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    )}

                    {form?.fields && form.fields.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={form.fields.map((field: FormField) => field.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {form.fields
                                            .sort((a: FormField, b: FormField) => a.order - b.order)
                                            .map((field: FormField, index: number) => (
                                                <SortableField
                                                    key={field.id}
                                                    field={field}
                                                    index={index}
                                                    isExpanded={expandedFields.has(field.id)}
                                                    isHighlighted={highlightedField === field.id}
                                                    onUpdate={onUpdateField}
                                                    onDelete={onDeleteField}
                                                    onMove={onMoveField}
                                                    onDuplicate={handleDuplicateField}
                                                    onToggleExpanded={toggleFieldExpanded}
                                                    fieldTypes={fieldTypes}
                                                    sensors={sensors}
                                                    onOptionDragEnd={handleOptionDragEnd}
                                                    onOptionUpdate={updateOption}
                                                    onOptionDelete={deleteOption}
                                                    totalFields={form.fields.length}
                                                />
                                            ))}
                                    </AnimatePresence>
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">フィールドがありません</h3>
                            <p className="text-gray-500 mb-4">フォームにフィールドを追加して開始してください</p>
                            <Button
                                onClick={() => setShowAddField(true)}
                                className="bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                最初のフィールドを追加
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

FieldEditor.displayName = 'FieldEditor';
