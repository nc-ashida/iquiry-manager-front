'use client';

import React, { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, FileText } from 'lucide-react';
import { FormListProps, FormListRef } from './FormList.types';
import { useFormList } from './FormList.hooks';
import { FormCard } from './FormCard';
import { LoadingWrapper } from '../../common/LoadingWrapper';
import { ErrorMessage } from '../../common/ErrorMessage';

/**
 * FormList コンポーネント
 * フォーム一覧の表示と管理
 */
export const FormList = forwardRef<FormListRef, FormListProps>(
    ({ forms, onEdit, onDelete, onDuplicate, onCreate, loading = false, error }, ref) => {
        const {
            searchQuery,
            setSearchQuery,
            filteredForms,
            handleCreateForm,
            handleEditForm,
            handleDeleteForm,
            handleDuplicateForm
        } = useFormList(forms, onCreate, onEdit, onDelete, onDuplicate);

        return (
            <div ref={ref} className="h-full flex flex-col">

                {/* 検索バー */}
                <div className="p-4 border-b">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="フォーム名、説明、フィールドで検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* エラー表示 */}
                {error && (
                    <div className="p-4">
                        <ErrorMessage message={error} />
                    </div>
                )}

                {/* フォーム一覧 */}
                <div className="flex-1 overflow-auto p-4">
                    <LoadingWrapper loading={loading}>
                        {filteredForms.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredForms.map((form) => (
                                    <FormCard
                                        key={form.id}
                                        form={form}
                                        onEdit={handleEditForm}
                                        onDelete={handleDeleteForm}
                                        onDuplicate={handleDuplicateForm}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchQuery ? '検索結果が見つかりません' : 'フォームがありません'}
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    {searchQuery
                                        ? '検索条件を変更してお試しください'
                                        : '最初のフォームを作成して開始してください'
                                    }
                                </p>
                                {!searchQuery && (
                                    <Button
                                        onClick={handleCreateForm}
                                        className="bg-black text-white hover:bg-gray-800"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        最初のフォームを作成
                                    </Button>
                                )}
                            </div>
                        )}
                    </LoadingWrapper>
                </div>
            </div>
        );
    }
);

FormList.displayName = 'FormList';
