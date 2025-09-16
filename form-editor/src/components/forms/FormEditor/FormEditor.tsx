'use client';

import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import { FieldEditor } from '../FieldEditor/FieldEditor';
import FormPreview from '../../FormPreview';
import SettingsEditor from '../../SettingsEditor';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormEditor } from './FormEditor.hooks';
import { FormEditorProps, FormEditorRef } from './FormEditor.types';
import { Signature } from '@/shared/types';
import { loadData } from '@/shared/utils/dataManager';

export const FormEditor = forwardRef<FormEditorRef, FormEditorProps>(
    ({ form, onSave, onCancel, mode = 'edit' }, ref) => {
        const {
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
        } = useFormEditor(form, onSave);

        const [activeTab, setActiveTab] = useState('settings');
        const [signatures, setSignatures] = useState<Signature[]>([]);

        // 署名データの読み込み
        useEffect(() => {
            const loadSignatures = () => {
                try {
                    const signatureData = loadData.signatures();
                    if (signatureData && signatureData.length > 0) {
                        setSignatures(signatureData);
                    } else {
                        // ローカルストレージに署名データがない場合、デフォルト署名データを使用
                        setSignatures([
                            {
                                id: "default",
                                name: "デフォルト署名",
                                content: "お問い合わせありがとうございます。\n\n担当者より改めてご連絡いたします。\n\nよろしくお願いいたします。",
                                isDefault: true,
                                createdAt: new Date().toISOString()
                            }
                        ]);
                    }
                } catch (error) {
                    console.error('署名データの読み込みに失敗しました:', error);
                    // フォールバック: デフォルト署名データを使用
                    setSignatures([
                        {
                            id: "default",
                            name: "デフォルト署名",
                            content: "お問い合わせありがとうございます。\n\n担当者より改めてご連絡いたします。\n\nよろしくお願いいたします。",
                            isDefault: true,
                            createdAt: new Date().toISOString()
                        }
                    ]);
                }
            };

            loadSignatures();
        }, []);

        const handleSave = useCallback(async () => {
            if (isValid) {
                await saveForm();
            }
        }, [isValid, saveForm]);

        const handleCancel = useCallback(() => {
            if (isDirty) {
                if (confirm('変更が保存されていません。本当にキャンセルしますか？')) {
                    resetForm();
                    onCancel();
                }
            } else {
                onCancel();
            }
        }, [isDirty, resetForm, onCancel]);

        return (
            <div ref={ref} className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-xl font-semibold">
                        {mode === 'create' ? '新しいフォームを作成' : 'フォームを編集'}
                    </h1>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                        >
                            キャンセル
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleSave}
                            disabled={!isValid}
                            className="bg-black text-white hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            保存
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger
                                value="settings"
                                className="hover:bg-gray-100 transition-colors duration-200 data-[state=active]:bg-black data-[state=active]:text-white"
                            >
                                設定
                            </TabsTrigger>
                            <TabsTrigger
                                value="fields"
                                className="hover:bg-gray-100 transition-colors duration-200 data-[state=active]:bg-black data-[state=active]:text-white"
                            >
                                フィールド
                            </TabsTrigger>
                            <TabsTrigger
                                value="preview"
                                className="hover:bg-gray-100 transition-colors duration-200 data-[state=active]:bg-black data-[state=active]:text-white"
                            >
                                プレビュー
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="settings" className="h-full">
                            {currentForm && (
                                <SettingsEditor
                                    form={currentForm}
                                    settings={currentForm.settings}
                                    signatures={signatures}
                                    onFormChange={(formUpdates) => updateForm(formUpdates)}
                                    onSettingsChange={(settings) => updateForm({ settings })}
                                />
                            )}
                        </TabsContent>

                        <TabsContent value="fields" className="h-full">
                            <FieldEditor
                                form={currentForm}
                                onAddField={addField}
                                onUpdateField={updateField}
                                onDeleteField={deleteField}
                                onMoveField={moveField}
                                onDuplicateField={duplicateField}
                            />
                        </TabsContent>

                        <TabsContent value="preview" className="h-full overflow-auto">
                            {currentForm && <FormPreview form={currentForm} />}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        );
    }
);

FormEditor.displayName = 'FormEditor';
