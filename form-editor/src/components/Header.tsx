'use client';

import React from 'react';
import { FileText, User, Settings, LogOut, Home, PenTool, HelpCircle, Inbox, Send, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({
  currentPage = 'dashboard'
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // 全ナビゲーション項目
  const allNavigationItems = [
    { id: 'forms', label: 'フォーム管理', href: '/', icon: Home },
    { id: 'signatures', label: '署名管理', href: '/signatures', icon: PenTool },
    { id: 'inbox', label: '受信', href: '/mail/inbox', icon: Inbox },
    { id: 'sent', label: '送信', href: '/mail/sent', icon: Send },
    { id: 'help', label: 'ヘルプ', href: '/help', icon: HelpCircle },
  ];

  // 現在アクティブなメニュー項目を取得
  const currentActiveItem = allNavigationItems.find(item => item.id === currentPage) || allNavigationItems[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* ロゴとブランド - 768px以下でのみ表示 */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:hidden">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-black">
                <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-base sm:text-lg font-bold text-foreground truncate">フォームエディタ</h1>
            </div>
          </div>

          {/* スペーサー - 768px以上でユーザーメニューを右端に押し出す */}
          <div className="flex-1"></div>

          {/* ユーザーメニュー - 右端に配置 */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-black hover:border-2 hover:border-black focus:border-black focus:ring-0">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarImage src="/avatars/01.png" alt="ユーザー" />
                    <AvatarFallback className="text-xs sm:text-sm">U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-gray-900">ユーザー名</p>
                    <p className="w-[200px] truncate text-sm text-gray-600">
                      user@example.com
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
                  <User className="mr-2 h-4 w-4" />
                  <span>プロフィール</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>設定</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ログアウト</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* モバイルナビゲーション - 768px以下でのみ表示 */}
        <div className="md:hidden border-t">
          <nav className="flex items-center justify-between py-2 px-2">
            {/* 現在アクティブなメニュー項目 */}
            <a
              href={currentActiveItem.href}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-xs font-medium transition-colors flex-1 text-white bg-black"
              aria-current="page"
            >
              <currentActiveItem.icon className="h-4 w-4" />
              <span className="truncate text-xs">{currentActiveItem.label}</span>
            </a>

            {/* ハンバーガーメニューボタン */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col items-center space-y-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="text-xs">メニュー</span>
            </button>
          </nav>

          {/* ハンバーガーメニューのドロップダウン */}
          {isMobileMenuOpen && (
            <div className="border-t bg-white shadow-lg">
              <div className="py-2">
                {allNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${isActive
                        ? 'text-white bg-black'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
