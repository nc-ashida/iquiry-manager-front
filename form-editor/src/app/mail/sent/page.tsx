'use client';

import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Clock, User, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SentPage() {
    // サンプルデータ - HP問合せシステム
    const hpSentMessages = [
        {
            id: 1,
            to: '田中太郎',
            toEmail: 'tanaka@example.com',
            subject: 'Re: お問い合わせフォームについて',
            preview: 'ご質問いただいたお問い合わせフォームについて、詳細をご回答いたします。',
            sentAt: '2024-01-15 15:45',
            status: 'delivered',
            priority: 'high',
            originalMessageId: '1'
        },
        {
            id: 2,
            to: '佐藤花子',
            toEmail: 'sato@example.com',
            subject: 'Re: フォームの修正依頼',
            preview: '修正依頼について承知いたしました。詳細を確認の上、対応いたします。',
            sentAt: '2024-01-15 11:20',
            status: 'delivered',
            priority: 'medium',
            originalMessageId: '2'
        },
        {
            id: 3,
            to: '山田次郎',
            toEmail: 'yamada@example.com',
            subject: 'Re: フォームの使用方法について',
            preview: 'フォームの使用方法について、詳しくご説明いたします。',
            sentAt: '2024-01-14 17:30',
            status: 'pending',
            priority: 'low',
            originalMessageId: '3'
        }
    ];

    // サンプルデータ - エミダスシステム
    const emidasSentMessages = [
        {
            id: 101,
            to: 'エミダス太郎',
            toEmail: 'emidas1@example.com',
            subject: 'Re: エミダスシステムからのお問い合わせ',
            preview: 'エミダスシステムについてご質問いただき、ありがとうございます。詳細をご回答いたします。',
            sentAt: '2024-01-15 14:30',
            status: 'delivered',
            priority: 'high',
            originalMessageId: '101'
        },
        {
            id: 102,
            to: 'エミダス花子',
            toEmail: 'emidas2@example.com',
            subject: 'Re: エミダス機能追加のご相談',
            preview: 'エミダスシステムの機能追加について、詳細を検討いたします。',
            sentAt: '2024-01-15 12:15',
            status: 'delivered',
            priority: 'medium',
            originalMessageId: '102'
        },
        {
            id: 103,
            to: 'エミダス次郎',
            toEmail: 'emidas3@example.com',
            subject: 'Re: エミダスデータ移行について',
            preview: 'データ移行の手順について、詳細なマニュアルをお送りいたします。',
            sentAt: '2024-01-14 15:30',
            status: 'delivered',
            priority: 'medium',
            originalMessageId: '103'
        },
        {
            id: 104,
            to: 'エミダス一郎',
            toEmail: 'emidas4@example.com',
            subject: 'Re: エミダスシステム障害報告',
            preview: 'システム障害について、復旧作業を実施いたしました。',
            sentAt: '2024-01-14 09:45',
            status: 'delivered',
            priority: 'high',
            originalMessageId: '104'
        },
        {
            id: 105,
            to: 'エミダス美咲',
            toEmail: 'emidas5@example.com',
            subject: 'Re: エミダスカスタマイズ依頼',
            preview: 'カスタマイズのご依頼について、詳細を確認いたします。',
            sentAt: '2024-01-13 17:20',
            status: 'pending',
            priority: 'low',
            originalMessageId: '105'
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'default';
            case 'pending': return 'secondary';
            case 'failed': return 'destructive';
            default: return 'secondary';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'delivered': return '配信済み';
            case 'pending': return '配信中';
            case 'failed': return '配信失敗';
            default: return '不明';
        }
    };

    // 送信メールリストコンポーネント
    const SentMailList = ({ messages, systemType }: { messages: typeof hpSentMessages, systemType: string }) => (
        <div className="space-y-3 md:space-y-4">
            {messages.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-6 md:py-8">
                        <Send className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">送信メールがありません</h3>
                        <p className="text-xs text-gray-600">
                            {systemType === 'hp' ? 'HP問合せシステム' : 'エミダスシステム'}からの返信はありません。
                        </p>
                    </CardContent>
                </Card>
            ) : (
                messages.map((message) => (
                    <Card key={message.id} className="group hover:shadow-md transition-all duration-200 cursor-pointer rounded-l-none">
                        <CardContent className="p-3 md:p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 space-y-1 sm:space-y-0">
                                        <div className="flex items-center space-x-2 min-w-0">
                                            <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                            <span className="text-sm font-medium text-gray-900 truncate">
                                                {message.to}
                                            </span>
                                            <span className="text-xs text-gray-500 truncate hidden sm:inline">
                                                ({message.toEmail})
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1 flex-wrap">
                                            <Badge variant={getPriorityColor(message.priority)} className="text-xs">
                                                {getPriorityLabel(message.priority)}
                                            </Badge>
                                            <Badge variant={getStatusColor(message.status)} className="text-xs">
                                                {getStatusLabel(message.status)}
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
                                            <span>{message.sentAt}</span>
                                        </div>
                                        {message.status === 'delivered' && (
                                            <div className="flex items-center space-x-1 text-green-600">
                                                <CheckCircle className="h-3 w-3" />
                                                <span>配信済み</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                <Header currentPage="sent" />
                <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-8 pt-6">
                    {/* ヘッダーセクション */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
                                    <Send className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg md:text-xl font-bold text-gray-900">送信メール</h1>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        HP問合せ: {hpSentMessages.length}件 / エミダス: {emidasSentMessages.length}件
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                <Badge variant="outline" className="text-xs w-fit">
                                    HP問合せ: {hpSentMessages.filter(msg => msg.status === 'delivered').length}件配信済み
                                </Badge>
                                <Badge variant="secondary" className="text-xs w-fit">
                                    エミダス: {emidasSentMessages.filter(msg => msg.status === 'delivered').length}件配信済み
                                </Badge>
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
                                <span className="ml-1">({hpSentMessages.length})</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="emidas"
                                className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-200 transition-colors text-xs sm:text-sm"
                            >
                                <span className="hidden sm:inline">エミダスシステム</span>
                                <span className="sm:hidden">エミダス</span>
                                <span className="ml-1">({emidasSentMessages.length})</span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="hp" className="mt-4 md:mt-6">
                            <SentMailList messages={hpSentMessages} systemType="hp" />
                        </TabsContent>
                        <TabsContent value="emidas" className="mt-4 md:mt-6">
                            <SentMailList messages={emidasSentMessages} systemType="emidas" />
                        </TabsContent>
                    </Tabs>

                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
