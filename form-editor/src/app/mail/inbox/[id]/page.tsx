'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { AppSidebar } from '@/components/AppSidebar';
import Header from '@/components/Header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
    ArrowLeft,
    Reply,
    Trash2,
    Clock,
    User,
    Mail,
    Send
} from 'lucide-react';

// サンプルメールデータ
const sampleMessages = [
    {
        id: '1',
        from: '田中太郎',
        fromEmail: 'tanaka@example.com',
        subject: 'お問い合わせフォームについて',
        content: `先日送信いただいたお問い合わせフォームについて、ご回答いたします。

フォームの設定について詳しく説明させていただきます。

【現在の設定】
- フォーム名: お問い合わせフォーム
- 送信先メール: info@company.com
- 自動返信: 有効
- 必須項目: お名前、メールアドレス、お問い合わせ内容

【ご質問への回答】
1. フォームのカスタマイズについて
   現在のフォームは基本的な設定となっております。
   より詳細なカスタマイズをご希望の場合は、別途ご相談ください。

2. 送信確認メールについて
   送信確認メールは自動的に送信される設定になっております。
   送信者には送信完了の通知が届きます。

3. データの保存について
   送信されたデータは安全に保存され、適切に管理されております。

何かご不明な点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。

田中太郎`,
        receivedAt: '2024-01-15 14:30',
        isRead: false,
        priority: 'high' as const,
        category: 'inquiry' as const,
    },
    {
        id: '2',
        from: '佐藤花子',
        fromEmail: 'sato@example.com',
        subject: 'フォームの修正依頼',
        content: `現在使用しているフォームに一部修正が必要です。

詳細は以下の通りです：

1. 必須項目の追加
   - 電話番号を必須項目に追加
   - 会社名を必須項目に追加

2. フォームのレイアウト変更
   - 項目の順序を変更
   - 説明文の追加

3. バリデーション設定
   - メールアドレスの形式チェック強化
   - 電話番号の形式チェック追加

修正完了予定日: 2024年1月20日

ご確認のほど、よろしくお願いいたします。

佐藤花子`,
        receivedAt: '2024-01-15 10:15',
        isRead: true,
        priority: 'medium' as const,
        category: 'correction' as const,
    },
    {
        id: '3',
        from: '山田次郎',
        fromEmail: 'yamada@example.com',
        subject: 'フォームの使用方法について',
        content: `フォームの使用方法についてご相談があります。

現在、以下のような状況です：

- フォームの送信がうまくいかない
- エラーメッセージが表示される
- 送信確認メールが届かない

これらの問題について、解決方法を教えていただけますでしょうか。

また、フォームの使い方について、詳しい説明書などはございますか？

お忙しい中恐縮ですが、ご回答いただけますと幸いです。

山田次郎`,
        receivedAt: '2024-01-14 16:45',
        isRead: true,
        priority: 'low' as const,
        category: 'consultation' as const,
    },
];

export default function MailDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

    // 返信フォームが表示されたときにテキストエリアにフォーカス
    useEffect(() => {
        if (isReplying && replyTextareaRef.current) {
            // 少し遅延させてフォーカスを設定（DOM更新を待つ）
            setTimeout(() => {
                replyTextareaRef.current?.focus();
            }, 100);
        }
    }, [isReplying]);

    const messageId = params.id as string;
    const message = sampleMessages.find(msg => msg.id === messageId);

    if (!message) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <Header currentPage="inbox" />
                    <div className="flex-1 flex items-center justify-center p-8">
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                                    <Mail className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">メールが見つかりません</h3>
                                <p className="text-sm text-gray-500 text-center max-w-sm">
                                    指定されたメールが見つかりませんでした。
                                </p>
                                <Button
                                    onClick={() => router.push('/mail/inbox')}
                                    className="mt-4"
                                    variant="outline"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    受信箱に戻る
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'destructive';
            case 'medium': return 'default';
            case 'low': return 'secondary';
            default: return 'secondary';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high': return '高';
            case 'medium': return '中';
            case 'low': return '低';
            default: return '中';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'inquiry': return 'お問い合わせ';
            case 'correction': return '修正依頼';
            case 'consultation': return 'ご相談';
            default: return 'その他';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'inquiry': return 'default';
            case 'correction': return 'secondary';
            case 'consultation': return 'outline';
            default: return 'secondary';
        }
    };

    const handleReply = () => {
        if (replyContent.trim()) {
            // 返信処理（実際の実装ではAPIを呼び出す）
            console.log('返信送信:', {
                to: message.fromEmail,
                subject: `Re: ${message.subject}`,
                content: replyContent,
                originalMessageId: message.id
            });

            // 送信完了の通知（実際の実装ではトースト通知など）
            alert('返信を送信しました。');

            // 送信完了後、送信ページにリダイレクト
            router.push('/mail/sent');
        }
    };

    const handleDelete = () => {
        // 削除処理（実際の実装ではAPIを呼び出す）
        console.log('メール削除:', message.id);

        // 削除完了の通知（実際の実装ではトースト通知など）
        alert('メールを削除しました。');

        // 削除完了後、受信箱にリダイレクト
        router.push('/mail/inbox');
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header currentPage="inbox" />
                <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
                    {/* ヘッダーセクション */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/mail/inbox')}
                                className="p-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{message.subject}</h1>
                                <p className="text-sm text-gray-600">メール詳細</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsReplying(!isReplying)}
                                className={`transition-colors ${isReplying ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-50"}`}
                            >
                                <Reply className="h-4 w-4 mr-2" />
                                {isReplying ? "返信をキャンセル" : "返信"}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        削除
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white border border-gray-200 shadow-lg">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>メールを削除しますか？</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            この操作は取り消すことができません。メールが完全に削除されます。
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="hover:bg-gray-100 transition-colors">キャンセル</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            削除
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    {/* メール詳細 */}
                    <Card className="rounded-l-none">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1 min-w-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 flex-shrink-0">
                                        <User className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <CardTitle className="text-base font-semibold text-gray-900">
                                                {message.from}
                                            </CardTitle>
                                            {!message.isRead && (
                                                <Badge variant="default" className="text-xs bg-black text-white">
                                                    未読
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mb-1">{message.fromEmail}</p>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant={getCategoryColor(message.category)} className="text-xs">
                                                {getCategoryLabel(message.category)}
                                            </Badge>
                                            <Badge variant={getPriorityColor(message.priority)} className="text-xs">
                                                {getPriorityLabel(message.priority)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center text-xs text-gray-500 flex-shrink-0">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {message.receivedAt}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {/* 返信フォーム */}
                            {isReplying && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border animate-in slide-in-from-top-2 duration-200">
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                            <Reply className="h-4 w-4 mr-2" />
                                            返信
                                        </h4>
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <div>宛先: {message.fromEmail}</div>
                                            <div>件名: Re: {message.subject}</div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <Textarea
                                            ref={replyTextareaRef}
                                            placeholder="返信内容を入力してください..."
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            className="min-h-[120px]"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <Button
                                            size="sm"
                                            onClick={handleReply}
                                            disabled={!replyContent.trim()}
                                            className="hover:bg-blue-600 transition-colors"
                                        >
                                            <Send className="h-4 w-4 mr-2" />
                                            送信
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="prose prose-sm max-w-none">
                                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                                    {message.content}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
