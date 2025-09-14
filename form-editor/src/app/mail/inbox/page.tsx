'use client';

import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Inbox, Mail, Clock, User, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function InboxPage() {
    const router = useRouter();

    // サンプルデータ - HP問合せシステム
    const hpInboxMessages = [
        {
            id: 1,
            from: '田中太郎',
            fromEmail: 'tanaka@example.com',
            subject: 'お問い合わせフォームについて',
            preview: '先日送信いただいたお問い合わせフォームについて、ご回答いたします。フォームの設定について詳しく説明させていただきます...',
            receivedAt: '2024-01-15 14:30',
            isRead: false,
            priority: 'high',
            category: 'inquiry'
        },
        {
            id: 2,
            from: '佐藤花子',
            fromEmail: 'sato@example.com',
            subject: 'フォームの修正依頼',
            preview: '現在使用しているフォームに一部修正が必要です。詳細は以下の通りです...',
            receivedAt: '2024-01-15 10:15',
            isRead: true,
            priority: 'medium',
            category: 'request'
        },
        {
            id: 3,
            from: '山田次郎',
            fromEmail: 'yamada@example.com',
            subject: '新規フォーム作成のご相談',
            preview: '弊社では新しいお問い合わせフォームの作成を検討しており、ご相談させていただきたく...',
            receivedAt: '2024-01-14 16:45',
            isRead: true,
            priority: 'low',
            category: 'consultation'
        },
        {
            id: 4,
            from: '鈴木一郎',
            fromEmail: 'suzuki@example.com',
            subject: 'フォーム送信エラーについて',
            preview: 'フォーム送信時にエラーが発生しており、解決方法をご教示いただけますでしょうか...',
            receivedAt: '2024-01-14 09:20',
            isRead: false,
            priority: 'high',
            category: 'error'
        },
        {
            id: 5,
            from: '高橋美咲',
            fromEmail: 'takahashi@example.com',
            subject: 'フォームデザインのカスタマイズ',
            preview: 'フォームのデザインをカスタマイズしたいのですが、どのような方法がありますか...',
            receivedAt: '2024-01-13 15:30',
            isRead: true,
            priority: 'medium',
            category: 'customization'
        }
    ];

    // サンプルデータ - エミダスシステム
    const emidasInboxMessages = [
        {
            id: 101,
            from: 'エミダス太郎',
            fromEmail: 'emidas1@example.com',
            subject: 'エミダスシステムからのお問い合わせ',
            preview: 'エミダスシステムをご利用いただき、ありがとうございます。システムについてご質問がございます...',
            receivedAt: '2024-01-15 13:20',
            isRead: false,
            priority: 'high',
            category: 'inquiry'
        },
        {
            id: 102,
            from: 'エミダス花子',
            fromEmail: 'emidas2@example.com',
            subject: 'エミダス機能追加のご相談',
            preview: 'エミダスシステムに新機能の追加をご希望されており、詳細についてご相談させていただきたく...',
            receivedAt: '2024-01-15 11:45',
            isRead: true,
            priority: 'medium',
            category: 'consultation'
        },
        {
            id: 103,
            from: 'エミダス次郎',
            fromEmail: 'emidas3@example.com',
            subject: 'エミダスデータ移行について',
            preview: '既存のデータをエミダスシステムに移行する件について、手順をご教示いただけますでしょうか...',
            receivedAt: '2024-01-14 14:15',
            isRead: true,
            priority: 'medium',
            category: 'migration'
        },
        {
            id: 104,
            from: 'エミダス一郎',
            fromEmail: 'emidas4@example.com',
            subject: 'エミダスシステム障害報告',
            preview: 'エミダスシステムで障害が発生しており、復旧状況についてご連絡いたします...',
            receivedAt: '2024-01-14 08:30',
            isRead: false,
            priority: 'high',
            category: 'incident'
        },
        {
            id: 105,
            from: 'エミダス美咲',
            fromEmail: 'emidas5@example.com',
            subject: 'エミダスカスタマイズ依頼',
            preview: 'エミダスシステムのカスタマイズをご依頼いたしたく、詳細についてご相談させていただきます...',
            receivedAt: '2024-01-13 16:20',
            isRead: true,
            priority: 'low',
            category: 'customization'
        }
    ];

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
            default: return '低';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'inquiry': return 'default';
            case 'request': return 'secondary';
            case 'consultation': return 'outline';
            case 'error': return 'destructive';
            case 'customization': return 'default';
            case 'migration': return 'outline';
            case 'incident': return 'destructive';
            default: return 'secondary';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'inquiry': return 'お問い合わせ';
            case 'request': return '修正依頼';
            case 'consultation': return 'ご相談';
            case 'error': return 'エラー報告';
            case 'customization': return 'カスタマイズ';
            case 'migration': return 'データ移行';
            case 'incident': return '障害報告';
            default: return 'その他';
        }
    };

    // メールリストコンポーネント
    const MailList = ({ messages, systemType }: { messages: typeof hpInboxMessages, systemType: string }) => (
        <div className="space-y-3 md:space-y-4">
            {messages.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-6 md:py-8">
                        <Mail className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">メールがありません</h3>
                        <p className="text-xs text-gray-600">
                            {systemType === 'hp' ? 'HP問合せシステム' : 'エミダスシステム'}からのメールはありません。
                        </p>
                    </CardContent>
                </Card>
            ) : (
                messages.map((message) => (
                    <Card key={message.id} className={`group hover:shadow-md transition-all duration-200 cursor-pointer ${!message.isRead ? 'border-l-4 border-l-blue-500' : ''} rounded-l-none`}>
                        <CardContent className="p-3 md:p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0" onClick={() => router.push(`/mail/inbox/${message.id}`)}>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 space-y-1 sm:space-y-0">
                                        <div className="flex items-center space-x-2 min-w-0">
                                            <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                            <span className="text-sm font-medium text-gray-900 truncate">
                                                {message.from}
                                            </span>
                                            <span className="text-xs text-gray-500 truncate hidden sm:inline">
                                                ({message.fromEmail})
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1 flex-wrap">
                                            <Badge variant={getPriorityColor(message.priority)} className="text-xs">
                                                {getPriorityLabel(message.priority)}
                                            </Badge>
                                            <Badge variant={getCategoryColor(message.category)} className="text-xs">
                                                {getCategoryLabel(message.category)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                                        {message.subject}
                                    </h3>
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                        {message.preview}
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{message.receivedAt}</span>
                                        </div>
                                        {!message.isRead && (
                                            <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 w-fit">
                                                未読
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors flex-shrink-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            className="font-medium"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/mail/inbox/${message.id}`);
                                            }}
                                        >
                                            返信
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>アーカイブ</DropdownMenuItem>
                                        <DropdownMenuItem>転送</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">削除</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header currentPage="inbox" />
                <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-8 pt-6">
                    {/* ヘッダーセクション */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
                                    <Inbox className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg md:text-xl font-bold text-gray-900">受信メール</h1>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        HP問合せ: {hpInboxMessages.length}件 / エミダス: {emidasInboxMessages.length}件
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                <Badge variant="outline" className="text-xs w-fit">
                                    HP問合せ: {hpInboxMessages.filter(msg => !msg.isRead).length}件未読
                                </Badge>
                                <Badge variant="secondary" className="text-xs w-fit">
                                    エミダス: {emidasInboxMessages.filter(msg => !msg.isRead).length}件未読
                                </Badge>
                            </div>
                        </div>

                        {/* 検索・フィルターセクション */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="メールを検索..."
                                    className="pl-10 h-9 md:h-10"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-colors h-9 md:h-10">
                                            <Filter className="mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">フィルター</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>未読のみ</DropdownMenuItem>
                                        <DropdownMenuItem>優先度: 高</DropdownMenuItem>
                                        <DropdownMenuItem>今日</DropdownMenuItem>
                                        <DropdownMenuItem>今週</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>

                    {/* タブ機能 */}
                    <Tabs defaultValue="hp" className="w-full">
                        <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger
                                value="hp"
                                className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-200 transition-colors text-xs sm:text-sm"
                            >
                                <span className="hidden sm:inline">HP問合せシステム</span>
                                <span className="sm:hidden">HP問合せ</span>
                                <span className="ml-1">({hpInboxMessages.length})</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="emidas"
                                className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-200 transition-colors text-xs sm:text-sm"
                            >
                                <span className="hidden sm:inline">エミダスシステム</span>
                                <span className="sm:hidden">エミダス</span>
                                <span className="ml-1">({emidasInboxMessages.length})</span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="hp" className="mt-4 md:mt-6">
                            <MailList messages={hpInboxMessages} systemType="hp" />
                        </TabsContent>
                        <TabsContent value="emidas" className="mt-4 md:mt-6">
                            <MailList messages={emidasInboxMessages} systemType="emidas" />
                        </TabsContent>
                    </Tabs>

                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
