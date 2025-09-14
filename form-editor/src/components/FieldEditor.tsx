'use client';

import { useState } from 'react';
import { FormField, ValidationType } from '@/shared/types';
import { Plus, GripVertical, Trash2, Edit, Type, FileText, List, Radio, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer from '@/components/animations/StaggerContainer';

interface FieldEditorProps {
  fields: FormField[];
  onFieldAdd: (type: string) => void;
  onFieldUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldReorder: (fromIndex: number, toIndex: number) => void;
}

export default function FieldEditor({
  fields,
  onFieldAdd,
  onFieldUpdate,
  onFieldDelete,
  onFieldReorder
}: FieldEditorProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fieldTypes = [
    { type: 'text', label: 'テキスト', icon: Type, description: '一行のテキスト入力' },
    { type: 'textarea', label: 'テキストエリア', icon: FileText, description: '複数行のテキスト入力' },
    { type: 'select', label: 'セレクト', icon: List, description: 'ドロップダウン選択' },
    { type: 'radio', label: 'ラジオボタン', icon: Radio, description: '単一選択' },
    { type: 'checkbox', label: 'チェックボックス', icon: CheckSquare, description: '複数選択' }
  ];

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onFieldReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleOptionChange = (fieldId: string, optionIndex: number, value: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;

    const newOptions = [...field.options];
    newOptions[optionIndex] = value;
    onFieldUpdate(fieldId, { options: newOptions });
  };

  const handleOptionAdd = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const newOptions = [...(field.options || []), '新しい選択肢'];
    onFieldUpdate(fieldId, { options: newOptions });
  };

  const handleOptionDelete = (fieldId: string, optionIndex: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;

    const newOptions = field.options.filter((_, index) => index !== optionIndex);
    onFieldUpdate(fieldId, { options: newOptions });
  };

  return (
    <div className="space-y-6">
      {/* 項目追加セクション */}
      <FadeIn>
        <Card>
          <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
            <CardTitle className="text-lg font-semibold">項目の追加</CardTitle>
            <p className="text-sm text-muted-foreground">フォームに追加したい項目の種類を選択してください</p>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fieldTypes.map((fieldType) => {
                const Icon = fieldType.icon;
                return (
                  <Button
                    key={fieldType.type}
                    variant="outline"
                    onClick={() => onFieldAdd(fieldType.type)}
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Icon className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">{fieldType.label}</div>
                      <div className="text-xs text-muted-foreground">{fieldType.description}</div>
                    </div>
                  </Button>
                );
              })}
            </StaggerContainer>
          </CardContent>
        </Card>
      </FadeIn>

      {/* 項目一覧セクション */}
      {fields.length === 0 ? (
        <FadeIn delay={0.2}>
          <Card>
            <CardContent className="px-4 py-12 sm:px-6 sm:py-16 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Type className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">項目がありません</h3>
              <p className="text-muted-foreground">上記のボタンから項目を追加してください</p>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
              <CardTitle className="text-lg font-semibold">フォーム項目 ({fields.length})</CardTitle>
              <p className="text-sm text-muted-foreground">項目をドラッグして順序を変更できます</p>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="space-y-4">
                {fields.map((field, index) => {
                  const fieldType = fieldTypes.find(ft => ft.type === field.type);
                  const Icon = fieldType?.icon || Type;

                  return (
                    <Card
                      key={field.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`cursor-move transition-all duration-200 hover:shadow-md ${draggedIndex === index ? 'opacity-50 scale-95' : ''
                        }`}
                    >
                      <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="font-medium">{field.label}</span>
                            {field.required && (
                              <Badge variant="destructive" className="text-xs">必須</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">{fieldType?.label}</Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onFieldDelete(field.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {editingField === field.id && (
                        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                          <Separator className="mb-4" />
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`label-${field.id}`} className="text-sm font-medium">
                                  項目名
                                </Label>
                                <Input
                                  id={`label-${field.id}`}
                                  type="text"
                                  value={field.label}
                                  onChange={(e) => onFieldUpdate(field.id, { label: e.target.value })}
                                  placeholder="項目名を入力"
                                  className="h-9"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`placeholder-${field.id}`} className="text-sm font-medium">
                                  プレースホルダー
                                </Label>
                                <Input
                                  id={`placeholder-${field.id}`}
                                  type="text"
                                  value={field.placeholder || ''}
                                  onChange={(e) => onFieldUpdate(field.id, { placeholder: e.target.value })}
                                  placeholder="プレースホルダーを入力"
                                  className="h-9"
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => onFieldUpdate(field.id, { required: e.target.checked })}
                                  className="h-4 w-4"
                                />
                                <span className="text-sm font-medium">必須項目</span>
                              </label>
                            </div>

                            {/* 選択肢の設定（select, radio, checkbox用） */}
                            {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <Label className="text-sm font-medium">選択肢</Label>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOptionAdd(field.id)}
                                    className="h-8"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    追加
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {field.options?.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center space-x-2">
                                      <Input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(field.id, optionIndex, e.target.value)}
                                        placeholder="選択肢を入力"
                                        className="h-9"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleOptionDelete(field.id, optionIndex)}
                                        className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* バリデーション設定 */}
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">バリデーション</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-xs text-muted-foreground">種別</Label>
                                  <Select
                                    value={field.validation?.type || 'text'}
                                    onValueChange={(value) => onFieldUpdate(field.id, {
                                      validation: {
                                        ...field.validation,
                                        type: value as ValidationType
                                      }
                                    })}
                                  >
                                    <SelectTrigger className="h-9">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">テキスト</SelectItem>
                                      <SelectItem value="email">メールアドレス</SelectItem>
                                      <SelectItem value="phone">電話番号</SelectItem>
                                      <SelectItem value="number">数値</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs text-muted-foreground">最小文字数</Label>
                                  <Input
                                    type="number"
                                    value={field.validation?.minLength || ''}
                                    onChange={(e) => onFieldUpdate(field.id, {
                                      validation: {
                                        type: field.validation?.type || 'text',
                                        ...field.validation,
                                        minLength: e.target.value ? parseInt(e.target.value) : undefined
                                      }
                                    })}
                                    placeholder="最小文字数"
                                    className="h-9"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs text-muted-foreground">最大文字数</Label>
                                  <Input
                                    type="number"
                                    value={field.validation?.maxLength || ''}
                                    onChange={(e) => onFieldUpdate(field.id, {
                                      validation: {
                                        type: field.validation?.type || 'text',
                                        ...field.validation,
                                        maxLength: e.target.value ? parseInt(e.target.value) : undefined
                                      }
                                    })}
                                    placeholder="最大文字数"
                                    className="h-9"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}