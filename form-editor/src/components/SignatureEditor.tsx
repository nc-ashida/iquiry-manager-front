'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Signature, CreateSignatureRequest, UpdateSignatureRequest } from '@/shared/types';

interface SignatureEditorProps {
    onSignaturesChange?: (signatures: Signature[]) => void;
}

export function SignatureEditor({ onSignaturesChange }: SignatureEditorProps) {
    const [signatures, setSignatures] = useState<Signature[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSignature, setEditingSignature] = useState<Signature | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        content: '',
        isDefault: false
    });

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

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.content.trim()) {
            alert('署名名と内容は必須です。');
            return;
        }

        try {
            if (editingSignature) {
                // 更新
                const updateData: UpdateSignatureRequest = {
                    id: editingSignature.id,
                    name: formData.name,
                    content: formData.content,
                    isDefault: formData.isDefault
                };

                const response = await fetch(`/api/signatures/${editingSignature.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                });

                if (response.ok) {
                    const updatedSignature = await response.json();
                    setSignatures(prev => prev.map(sig =>
                        sig.id === editingSignature.id ? updatedSignature : sig
                    ));
                }
            } else {
                // 新規作成
                const createData: CreateSignatureRequest = {
                    name: formData.name,
                    content: formData.content,
                    isDefault: formData.isDefault
                };

                const response = await fetch('/api/signatures', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createData)
                });

                if (response.ok) {
                    const newSignature = await response.json();
                    setSignatures(prev => [...prev, newSignature]);
                }
            }

            // デフォルト署名の処理
            if (formData.isDefault) {
                setSignatures(prev => prev.map(sig => ({
                    ...sig,
                    isDefault: sig.id === (editingSignature?.id || 'new') ? true : false
                })));
            }

            resetForm();
            setIsDialogOpen(false);
            onSignaturesChange?.(signatures);
        } catch (error) {
            console.error('署名の保存に失敗しました:', error);
            alert('署名の保存に失敗しました。');
        }
    };

    const handleEdit = (signature: Signature) => {
        setEditingSignature(signature);
        setFormData({
            name: signature.name,
            content: signature.content,
            isDefault: signature.isDefault
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/signatures/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setSignatures(prev => prev.filter(sig => sig.id !== id));
                onSignaturesChange?.(signatures.filter(sig => sig.id !== id));
            }
        } catch (error) {
            console.error('署名の削除に失敗しました:', error);
            alert('署名の削除に失敗しました。');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', content: '', isDefault: false });
        setEditingSignature(null);
    };

    const handleDialogClose = () => {
        resetForm();
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">署名管理</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => { resetForm(); setIsDialogOpen(true); }}
                            className="bg-black hover:bg-gray-800 text-white shadow-sm"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            新規署名
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                                {editingSignature ? '署名を編集' : '新規署名を作成'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4 bg-white dark:bg-gray-900">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-100">署名名</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="署名の名前を入力してください"
                                    className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content" className="text-sm font-medium text-gray-900 dark:text-gray-100">署名内容</Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                    placeholder="署名の内容を入力してください"
                                    rows={10}
                                    className="w-full min-h-[200px] resize-y bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                />
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    改行はそのまま反映されます。適切な署名文を作成してください。
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                                    className="rounded h-4 w-4 text-blue-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                />
                                <Label htmlFor="isDefault" className="text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-100">
                                    デフォルト署名として設定
                                </Label>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button variant="outline" onClick={handleDialogClose} className="w-full sm:w-auto bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:text-gray-900">
                                    <X className="h-4 w-4 mr-2" />
                                    キャンセル
                                </Button>
                                <Button onClick={handleSave} className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white shadow-sm">
                                    <Save className="h-4 w-4 mr-2" />
                                    保存
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {signatures.map((signature) => (
                    <Card key={signature.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <CardTitle className="text-lg text-gray-900">{signature.name}</CardTitle>
                                    {signature.isDefault && (
                                        <Badge variant="default" className="bg-gray-100 text-gray-800">デフォルト</Badge>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(signature)}
                                        className="bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-white border border-gray-200 shadow-lg">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>署名を削除しますか？</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    この操作は取り消すことができません。署名「{signature.name}」が完全に削除されます。
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="hover:bg-gray-100 transition-colors">キャンセル</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(signature.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    削除
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="whitespace-pre-wrap text-sm text-gray-600">
                                {signature.content}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                作成日: {new Date(signature.createdAt).toLocaleDateString('ja-JP')}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {signatures.length === 0 && (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-gray-600">署名が登録されていません。</p>
                        <p className="text-sm text-gray-500 mt-1">
                            新規署名ボタンから署名を作成してください。
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
