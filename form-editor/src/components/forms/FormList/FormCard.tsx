import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Edit,
    Trash2,
    Copy,
    Calendar,
    FileText
} from 'lucide-react';
import { FormCardProps } from './FormList.types';

/**
 * フォームカードコンポーネント
 * 個別のフォーム情報を表示し、アクションを提供
 */
export function FormCard({ form, onEdit, onDelete, onDuplicate }: FormCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFieldTypeCount = () => {
        const typeCount: Record<string, number> = {};
        form.fields.forEach(field => {
            typeCount[field.type] = (typeCount[field.type] || 0) + 1;
        });
        return typeCount;
    };

    const fieldTypeCount = getFieldTypeCount();

    return (
        <Card className="hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
                <div className="space-y-3">
                    <div>
                        <CardTitle className="text-lg font-semibold mb-1 truncate">
                            {form.name}
                        </CardTitle>
                        {form.description && (
                            <CardDescription className="text-sm text-gray-600 overflow-hidden" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                {form.description}
                            </CardDescription>
                        )}
                    </div>
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(form)}
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0 transition-colors duration-200"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDuplicate(form)}
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0 transition-colors duration-200"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 transition-colors duration-200"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white border shadow-xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>フォームを削除しますか？</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        フォーム「{form.name}」を削除します。この操作は取り消すことができません。
                                        {form.fields.length > 0 && (
                                            <span className="block mt-2 text-orange-600">
                                                ⚠️ このフォームには{form.fields.length}個のフィールドが含まれています。
                                            </span>
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="hover:bg-gray-100 transition-colors duration-200">キャンセル</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(form.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        削除する
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                    {/* フィールド情報 */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 flex-shrink-0" />
                            <span>{form.fields.length}個のフィールド</span>
                        </div>
                        {Object.keys(fieldTypeCount).length > 0 && (
                            <div className="flex flex-wrap items-center gap-1">
                                {Object.entries(fieldTypeCount).slice(0, 3).map(([type, count]) => (
                                    <Badge key={type} variant="secondary" className="text-xs">
                                        {type}: {count}
                                    </Badge>
                                ))}
                                {Object.keys(fieldTypeCount).length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{Object.keys(fieldTypeCount).length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 作成日時 */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">作成: {formatDate(form.createdAt)}</span>
                    </div>

                    {/* 更新日時 */}
                    {form.updatedAt !== form.createdAt && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">更新: {formatDate(form.updatedAt)}</span>
                        </div>
                    )}
                </div>

                {/* アクションボタン */}
                <div className="flex items-center space-x-2 pt-3 border-t mt-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(form)}
                        className="flex-1 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">編集</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDuplicate(form)}
                        className="flex-1 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">複製</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
