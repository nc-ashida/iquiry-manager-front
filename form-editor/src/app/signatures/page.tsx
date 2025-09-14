'use client';

import { SignatureEditor } from '@/components/SignatureEditor';
import Header from '@/components/Header';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import FadeIn from '@/components/animations/FadeIn';

export default function SignaturesPage() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header currentPage="signatures" />
                <main className="flex-1 p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        {/* ヘッダーセクション */}
                        <FadeIn>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">署名管理</h1>
                                    <p className="text-gray-600 mt-2 text-xs sm:text-sm">メール署名の作成・編集・管理を行います</p>
                                </div>
                            </div>
                        </FadeIn>

                        {/* 署名エディター */}
                        <FadeIn delay={0.2}>
                            <SignatureEditor />
                        </FadeIn>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
