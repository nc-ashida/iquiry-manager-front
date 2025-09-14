# Form-Editor デザイン改善実装例

## 概要

form-editorアプリケーションのデザイン改善における具体的な実装例とコードサンプルを提供します。これらの例を参考に、AIを活用して効率的にデザイン改善を進めることができます。

## 実装例1: shadcn/ui統一の実装

### 現在のコンポーネント状況
```typescript
// 現在使用中のコンポーネント
- Button, Card, Dialog, Input, Label, Select, Textarea
- Badge, Avatar, DropdownMenu, Sheet, Tabs
- Sidebar, Command, Popover, Toast, Skeleton, Progress, Separator, ScrollArea
- Checkbox (新規追加)
```

### Checkboxコンポーネントのshadcn/ui化

**問題:** チェックボックスのルックフィールをshadcn/uiに統一

**AIプロンプト:**
```
「form-editorアプリケーションのチェックボックスコンポーネントをshadcn/uiに統一してください：

現在の状況:
- 標準HTML input[type="checkbox"]を使用
- 統一されたデザインシステムが不足
- アクセシビリティの改善が必要

統一要件:
1. shadcn/ui Checkboxコンポーネントの作成
2. Radix UIベースの実装
3. アクセシビリティの向上
4. テーマシステムとの統合
5. 日本語テキストでのデモ実装

技術要件:
- @radix-ui/react-checkbox
- Lucide React icons
- TypeScript
- Tailwind CSS」
```

**期待される出力:**
```tsx
// src/components/ui/checkbox.tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

**解決した問題:**
- 統一されたチェックボックスデザイン
- アクセシビリティの向上
- テーマシステムとの統合
- カスタマイズ可能なスタイリング

### SelectコンポーネントのShadcn UI化

**問題:** 標準HTML selectからShadcn UI Selectへの移行時のエラー対応

**AIプロンプト:**
```
「form-editorのSettingsEditorコンポーネントで標準HTML selectをShadcn UI Selectに変更してください：

現在のコード:
<select
  value={settings.signatureId}
  onChange={(e) => handleSignatureChange(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>
  <option value="">署名を選択してください</option>
  {signatures.map((signature) => (
    <option key={signature.id} value={signature.id}>
      {signature.name}
    </option>
  ))}
</select>

変更要件:
1. Shadcn UI Selectコンポーネントに置き換え
2. 空文字列valueエラーの解決
3. 統一されたデザインの適用
4. アクセシビリティの向上

技術要件:
- Shadcn UI Select
- TypeScript
- エラーハンドリング」
```

**期待される出力:**
```tsx
// 修正後のSelectコンポーネント
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select
  value={settings.signatureId || undefined}
  onValueChange={(value) => handleSignatureChange(value || "")}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="署名を選択してください" />
  </SelectTrigger>
  <SelectContent>
    {signatures.map((signature) => (
      <SelectItem key={signature.id} value={signature.id}>
        {signature.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**解決した問題:**
- Runtime Error: `<Select.Item /> must have a value prop that is not an empty string`
- 空文字列のSelectItemを削除し、placeholderで対応
- 値の管理ロジックを更新（`undefined`でplaceholder表示）

### 改善されたshadcn/ui統一

**AIプロンプト:**
```
「form-editorアプリケーションのUIコンポーネントをshadcn/uiに統一してください：

現在のコンポーネント:
[現在のコンポーネントリスト]

統一要件:
1. 不足しているshadcn/uiコンポーネントの追加
2. 既存コンポーネントのshadcn/ui化
3. テーマシステムの統一
4. アクセシビリティの向上
5. 一貫性の確保

技術要件:
- Next.js 15.5.3
- React 19.1.0
- Tailwind CSS 4.0
- TypeScript

追加推奨コンポーネント:
- Sidebar (ナビゲーション改善)
- Sheet (モーダル改善)
- Command (検索機能)
- Popover (ツールチップ)
- Toast (通知システム)

出力形式:
- 実装計画
- コンポーネント追加手順
- 既存コンポーネントの移行手順」
```

**期待される出力:**
```bash
# 1. 不足しているshadcn/uiコンポーネントの追加
npx shadcn@latest add sidebar
npx shadcn@latest add command
npx shadcn@latest add popover
npx shadcn@latest add toast
npx shadcn@latest add skeleton
npx shadcn@latest add progress
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
```

```tsx
// 2. 改善されたナビゲーション例
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <span className="font-bold">フォームエディタ</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/">
                <Home className="h-4 w-4" />
                <span>ダッシュボード</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
```

```tsx
// 3. フォーム編集用のSheet
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export function FormEditSheet({ form, isOpen, onClose }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>フォーム編集</SheetTitle>
          <SheetDescription>
            フォームの設定を編集してください
          </SheetDescription>
        </SheetHeader>
        {/* フォーム編集コンテンツ */}
      </SheetContent>
    </Sheet>
  )
}
```

### 使用例
```tsx
// 改善されたHeader + Sidebar
export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <SidebarTrigger />
            <div className="flex items-center space-x-4">
              {/* 検索バー、通知、ユーザーメニュー */}
            </div>
          </div>
        </header>
        {children}
      </main>
    </SidebarProvider>
  )
}
```

## 実装例2: モノトーンデザインの実装

### モノトーンデザインシステムの構築

**目標:** 洗練されたモノトーンデザインで統一感のあるUIを構築する

**AIプロンプト:**
```
「form-editorアプリケーションにモノトーンデザインを実装してください：

実装要件:
1. サイドバーのアクティブ色を黒に設定
2. ヘッダーナビゲーションのアクティブ色を黒に設定
3. 新規作成ボタンを黒背景に統一
4. 削除ボタンを赤色に統一
5. ページネーションのアクティブ色を黒に設定
6. 保存ボタンを黒背景に変更
7. 戻るボタンをShadcn UIのoutlineスタイルに変更

技術要件:
- 黒、白、グレーの色調で統一
- アクティブ状態は黒背景で強調
- セカンダリアクションは白背景で表現
- 削除などの危険なアクションは赤色で警告
- 適度なシャドウとボーダーで立体感を表現」
```

**期待される出力:**

```tsx
// サイドバーのアクティブ状態
<SidebarMenuButton
  isActive={isActive}
  className="data-[active=true]:bg-black data-[active=true]:text-white"
>

// ヘッダーナビゲーションのアクティブ状態
<a
  className={`${isActive
    ? 'text-white bg-black'
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  }`}
>

// 新規作成ボタン（黒背景）
<Button className="bg-black hover:bg-gray-800 text-white shadow-sm">
  新規作成
</Button>

// 削除ボタン（赤色）
<Button className="bg-red-600 hover:bg-red-700 text-white">
  削除
</Button>

// ページネーションのアクティブ状態
<Button className="bg-black text-white border-black hover:bg-gray-800">
  {page}
</Button>

// 保存ボタン（黒背景）
<Button className="bg-black hover:bg-gray-800 text-white shadow-sm">
  保存
</Button>

// 戻るボタン（outlineスタイル）
<Button variant="outline" size="sm" className="flex items-center space-x-2">
  <ArrowLeft className="h-4 w-4" />
  <span>戻る</span>
</Button>
```

**実装済み項目:**
- ✅ サイドバーのアクティブ色を黒に設定
- ✅ ヘッダーナビゲーションのアクティブ色を黒に設定
- ✅ 新規作成ボタンを黒背景に統一
- ✅ 削除ボタンを赤色に統一
- ✅ ページネーションのアクティブ色を黒に設定
- ✅ 保存ボタンを黒背景に変更
- ✅ 戻るボタンをShadcn UIのoutlineスタイルに変更

## 実装例3: カラーパレットの拡張

### 現在のカラーパレット
```css
/* src/app/globals.css */
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}
```

### 改善されたカラーパレット

**AIプロンプト:**
```
「form-editorのカラーパレットを以下の要件で拡張してください：

現在のパレット:
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

拡張要件:
1. ブランドカラーの追加（プライマリ: #3B82F6, セカンダリ: #8B5CF6）
2. セマンティックカラーの拡張（success, warning, error, info）
3. グラデーションカラーの定義
4. ダークモード対応の改善
5. アクセシビリティ基準（WCAG 2.1 AA）の満足

出力形式: 完全なCSS変数定義 + 使用例」
```

**期待される出力:**
```css
/* src/app/globals.css */
:root {
  /* 既存のカラー */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  
  /* 拡張されたブランドカラー */
  --brand-primary: 217 91% 60%; /* #3B82F6 */
  --brand-primary-foreground: 0 0% 100%;
  --brand-secondary: 262 83% 58%; /* #8B5CF6 */
  --brand-secondary-foreground: 0 0% 100%;
  
  /* セマンティックカラー */
  --success: 142 76% 36%; /* #16A34A */
  --success-foreground: 0 0% 100%;
  --warning: 38 92% 50%; /* #F59E0B */
  --warning-foreground: 0 0% 100%;
  --error: 0 84% 60%; /* #EF4444 */
  --error-foreground: 0 0% 100%;
  --info: 199 89% 48%; /* #0EA5E9 */
  --info-foreground: 0 0% 100%;
  
  /* グラデーションカラー */
  --gradient-primary: linear-gradient(135deg, hsl(var(--brand-primary)), hsl(var(--brand-secondary)));
  --gradient-surface: linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted)));
  --gradient-card: linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)));
  
  /* ニュートラルカラーの拡張 */
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 217 91% 60%;
  
  /* カードとポップオーバー */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
}

/* ダークモード */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  
  --brand-primary: 217 91% 60%;
  --brand-primary-foreground: 222.2 84% 4.9%;
  --brand-secondary: 262 83% 58%;
  --brand-secondary-foreground: 222.2 84% 4.9%;
  
  --success: 142 76% 36%;
  --success-foreground: 210 40% 98%;
  --warning: 38 92% 50%;
  --warning-foreground: 222.2 84% 4.9%;
  --error: 0 84% 60%;
  --error-foreground: 210 40% 98%;
  --info: 199 89% 48%;
  --info-foreground: 222.2 84% 4.9%;
  
  --gradient-primary: linear-gradient(135deg, hsl(var(--brand-primary)), hsl(var(--brand-secondary)));
  --gradient-surface: linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted)));
  --gradient-card: linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)));
  
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 217 91% 60%;
  
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
}
```

### 使用例
```tsx
// グラデーションボタンの例
<Button className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
  グラデーションボタン
</Button>

// セマンティックカラーの例
<div className="bg-success text-success-foreground p-4 rounded-lg">
  成功メッセージ
</div>

<div className="bg-warning text-warning-foreground p-4 rounded-lg">
  警告メッセージ
</div>
```

## 実装例3: Headerコンポーネントの最適化

### ヘッダーコンポーネントの最適化実装

**問題:** ヘッダーの検索バーと通知機能の削除、レスポンシブロゴ表示の実装

**AIプロンプト:**
```
「form-editorのHeaderコンポーネントを以下の要件で最適化してください：

現在の状況:
- 検索バーと通知のベルアイコンが不要
- 768px以上ではサイドバーが固定表示されるため、ヘッダーロゴが重複
- 768px以下ではサイドバーが非表示で、ヘッダーにロゴ表示が必要
- モバイル表示時のサイドバートグルボタンが不要
- サイトロゴをモノトーンに統一

最適化要件:
1. 検索バーと通知のベルアイコンを削除
2. 768px以上ではヘッダーロゴを非表示
3. 768px以下ではヘッダーロゴを表示
4. モバイル表示時のサイドバートグルボタンを削除
5. サイトロゴをモノトーン（黒背景）に統一
6. 不要なimportとstate変数を削除

技術要件:
- TypeScript
- Tailwind CSS
- レスポンシブデザイン
- クリーンアップ」
```

**期待される出力:**
```tsx
// src/components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { FileText, User, Settings, LogOut, Moon, Sun, Home, PenTool, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ThemeProvider';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({
  currentPage = 'dashboard'
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // クライアントサイドでのマウント状態を管理
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // マウント前は常にライトモードとして扱う（ハイドレーションエラー回避）
  const isDarkMode = mounted && (theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches));

  const navigationItems = [
    { id: 'forms', label: 'フォーム管理', href: '/', icon: Home },
    { id: 'signatures', label: '署名管理', href: '/signatures', icon: PenTool },
    { id: 'help', label: 'ヘルプ', href: '/help', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴとブランド - 768px以下でのみ表示 */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:hidden">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-black">
                <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">フォームエディタ</h1>
            </div>
          </div>

          {/* ナビゲーションとアクション */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* テーマ切り替え - モバイルでは非表示 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 hidden sm:flex hover:bg-muted"
              aria-label={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            >
              {isDarkMode ? (
                <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>

            {/* ユーザーメニュー */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
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
          <nav className="flex items-center justify-around py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center space-y-1 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${isActive
                    ? 'text-white bg-black'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
```

**解決した問題:**
- 検索バーと通知機能の削除によるUIの簡素化
- レスポンシブロゴ表示による重複表示の解消
- モバイル表示時のサイドバートグルボタン削除
- サイトロゴのモノトーン統一
- 不要なimportとstate変数のクリーンアップ

## 実装例3.1: ヘッダーのライトモード固定化とユーザーメニュー最適化

### ヘッダーのライトモード固定化とユーザーメニュー最適化実装

**問題:** ダークモード切替ボタンの削除、ライトモード固定化、ユーザーメニューボタンの右端配置と黒境界線スタイリング

**AIプロンプト:**
```
「form-editorのHeaderコンポーネントを以下の要件で最適化してください：

現在の状況:
- ダークモード・ライトモード切替ボタンが不要
- ライトモードのみの実装に変更したい
- ユーザーメニューボタンを右端に配置したい
- ユーザーメニューボタンに黒境界線を追加したい

最適化要件:
1. ダークモード・ライトモード切替ボタンを削除
2. ThemeProviderをライトモード固定に変更
3. ユーザーメニューボタンを右端に配置
4. ユーザーメニューボタンに黒境界線を追加（通常時細線、ホバー時太線）
5. 不要なimportとstate変数を削除

技術要件:
- TypeScript
- Tailwind CSS
- レスポンシブデザイン
- モノトーンデザイン統一」
```

**期待される出力:**
```tsx
// src/components/Header.tsx
'use client';

import { FileText, User, Settings, LogOut, Home, PenTool, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({
  currentPage = 'dashboard'
}: HeaderProps) {
  const navigationItems = [
    { id: 'forms', label: 'フォーム管理', href: '/', icon: Home },
    { id: 'signatures', label: '署名管理', href: '/signatures', icon: PenTool },
    { id: 'help', label: 'ヘルプ', href: '/help', icon: HelpCircle },
  ];

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
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">フォームエディタ</h1>
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
          <nav className="flex items-center justify-around py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center space-y-1 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${isActive
                    ? 'text-white bg-black'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
```

```tsx
// src/components/ThemeProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: 'light',
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = 'light',
    storageKey = 'vite-ui-theme',
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const [mounted, setMounted] = useState(false);

    // クライアントサイドでのマウント後にライトモードを強制設定
    useEffect(() => {
        setMounted(true);
        setTheme('light');
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;

        // ダークモードクラスを削除し、ライトモードクラスを追加
        root.classList.remove('dark');
        root.classList.add('light');
    }, [theme, mounted]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            // ライトモードのみを許可
            setTheme('light');
        },
    };

    // マウント前はライトモードでレンダリング
    if (!mounted) {
        return (
            <ThemeProviderContext.Provider {...props} value={value}>
                {children}
            </ThemeProviderContext.Provider>
        );
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};
```

**解決した問題:**
- ダークモード切替ボタンの削除によるUIの簡素化
- ライトモード固定化によるデザインの一貫性向上
- ユーザーメニューボタンの右端配置によるレイアウト改善
- 黒境界線スタイリングによるモノトーンデザインの統一
- 不要なimportとstate変数のクリーンアップ

## 実装例4: Headerコンポーネントの改善

### 現在のHeaderコンポーネント
```tsx
// src/components/Header.tsx
'use client';

import { FileText, Copy, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">フォームエディタ</h1>
          </div>
          
          <nav className="flex items-center space-x-3 sm:space-x-6">
            <a href="#" className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] px-2">
              <Copy className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base hidden sm:inline">フォーム一覧</span>
            </a>
            <a href="#" className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] px-2">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base hidden sm:inline">設定</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
```

### 改善されたHeaderコンポーネント

**AIプロンプト:**
```
「form-editorのHeaderコンポーネントを以下の要件で改善してください：

現在のコード:
[上記のHeader.tsxコード]

改善要件:
1. より洗練されたナビゲーションデザイン
2. アクティブ状態の表示
3. ドロップダウンメニューの追加
4. 検索機能の統合
5. ユーザープロフィール表示
6. アクセシビリティの向上
7. ダークモード対応

技術要件:
- TypeScript
- Tailwind CSS
- shadcn/ui
- レスポンシブデザイン
- キーボードナビゲーション対応

出力形式: 完全なコンポーネントコード + 型定義 + 使用例」
```

**期待される出力:**
```tsx
// src/components/Header.tsx
'use client';

import { useState } from 'react';
import { FileText, Search, Bell, User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  currentPage?: string;
  onSearch?: (query: string) => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

export default function Header({ 
  currentPage = 'dashboard', 
  onSearch, 
  onThemeToggle, 
  isDarkMode = false 
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3); // 仮の通知数

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'ダッシュボード', href: '/', icon: FileText },
    { id: 'forms', label: 'フォーム一覧', href: '/forms', icon: FileText },
    { id: 'settings', label: '設定', href: '/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴとブランド */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">フォームエディタ</h1>
            </div>
          </div>

          {/* 検索バー */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="フォームを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-9"
                aria-label="フォーム検索"
              />
            </form>
          </div>

          {/* ナビゲーションとアクション */}
          <div className="flex items-center space-x-2">
            {/* テーマ切り替え */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeToggle}
              className="h-9 w-9 p-0"
              aria-label={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* 通知 */}
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notifications}
                </Badge>
              )}
              <span className="sr-only">通知</span>
            </Button>

            {/* ユーザーメニュー */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="ユーザー" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">ユーザー名</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>プロフィール</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>設定</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ログアウト</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* モバイルナビゲーション */}
        <div className="md:hidden border-t">
          <nav className="flex items-center justify-around py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-primary bg-brand-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
```

## 実装例4: アニメーションシステムの実装

### Framer Motionの統合

**AIプロンプト:**
```
「form-editorにFramer Motionを統合し、以下のアニメーションを実装してください：

実装要件:
1. ページ遷移アニメーション
2. コンポーネントのマウント/アンマウント
3. ホバーエフェクト
4. フォーカス状態
5. ローディングアニメーション

技術要件:
- Framer Motion
- TypeScript
- パフォーマンス最適化
- アクセシビリティ配慮

実装対象:
- src/app/layout.tsx
- src/components/*.tsx
- アニメーション設定」
```

**期待される出力:**

```tsx
// src/components/animations/PageTransition.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

```tsx
// src/components/animations/FadeIn.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  direction = 'up' 
}: FadeInProps) {
  const directionVariants = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directionVariants[direction] 
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      transition={{ 
        duration, 
        delay,
        ease: 'easeOut' 
      }}
    >
      {children}
    </motion.div>
  );
}
```

```tsx
// src/components/animations/StaggerContainer.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export default function StaggerContainer({ 
  children, 
  staggerDelay = 0.1,
  className = '' 
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
```

### アニメーション付きコンポーネントの例

```tsx
// src/components/AnimatedCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  delay?: number;
}

export default function AnimatedCard({ 
  children, 
  title, 
  className = '', 
  delay = 0 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: 'easeOut' 
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`transition-shadow duration-300 hover:shadow-lg ${className}`}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

## 実装例5: パフォーマンス最適化

### バンドルサイズの最適化

**AIプロンプト:**
```
「form-editorのバンドルサイズを最適化してください：

最適化要件:
1. 不要な依存関係の削除
2. 動的インポートの活用
3. ツリーシェイキングの最適化
4. CSS最適化
5. 画像最適化

目標:
- バンドルサイズ20%削減
- 初期ロード時間30%短縮

技術要件:
- Next.js 15.5.3
- Webpack最適化
- コード分割」
```

**期待される出力:**

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  webpack: (config, { dev, isServer }) => {
    // 本番環境での最適化
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          ui: {
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
```

```typescript
// src/components/LazyFormEditor.tsx
'use client';

import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// 動的インポートでFormEditorを遅延読み込み
const FormEditor = lazy(() => import('./FormEditor'));

interface LazyFormEditorProps {
  form: any;
  onSave: (form: any) => void;
  onCancel: () => void;
}

export default function LazyFormEditor(props: LazyFormEditorProps) {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <FormEditor {...props} />
    </Suspense>
  );
}
```

### レンダリングパフォーマンスの最適化

```tsx
// src/components/OptimizedFormList.tsx
'use client';

import { memo, useMemo, useCallback } from 'react';
import { Form } from '@/shared/types';
import { FixedSizeList as List } from 'react-window';
import FormCard from './FormCard';

interface OptimizedFormListProps {
  forms: Form[];
  onCreateForm: () => void;
  onEditForm: (form: Form) => void;
  onDeleteForm: (formId: string) => void;
}

// メモ化されたフォームカード
const MemoizedFormCard = memo(FormCard);

// 仮想スクロール用のアイテムレンダラー
const FormItem = memo(({ index, style, data }: any) => {
  const { forms, onEditForm, onDeleteForm } = data;
  const form = forms[index];

  return (
    <div style={style} className="px-4">
      <MemoizedFormCard
        form={form}
        onEdit={onEditForm}
        onDelete={onDeleteForm}
      />
    </div>
  );
});

FormItem.displayName = 'FormItem';

export default function OptimizedFormList({
  forms,
  onCreateForm,
  onEditForm,
  onDeleteForm,
}: OptimizedFormListProps) {
  // フォームデータのメモ化
  const formData = useMemo(() => ({
    forms,
    onEditForm,
    onDeleteForm,
  }), [forms, onEditForm, onDeleteForm]);

  // コールバックのメモ化
  const handleCreateForm = useCallback(() => {
    onCreateForm();
  }, [onCreateForm]);

  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">フォームがありません</p>
        <button onClick={handleCreateForm}>
          新しいフォームを作成
        </button>
      </div>
    );
  }

  return (
    <div className="h-96">
      <List
        height={400}
        itemCount={forms.length}
        itemSize={200}
        itemData={formData}
        overscanCount={5}
      >
        {FormItem}
      </List>
    </div>
  );
}
```

## 実装例6: 名前空間ベース設計の実装

### 埋め込みフォーム用の名前空間設計

**問題:** 生成されるHTML/CSS/JavaScriptで他のアプリケーションとの名前衝突を防ぐ

**AIプロンプト:**
```
「form-editorの埋め込みフォーム生成機能で名前空間ベースの設計を実装してください：

現在の状況:
- 生成されるHTML/CSS/JavaScriptで名前衝突のリスク
- 他のアプリケーションとの競合可能性
- バリデーション機能の不足

実装要件:
1. 名前空間プレフィックス（ir-form-）の適用
2. IDとクラス名の一意性確保
3. クライアントサイドバリデーション機能
4. 許可ドメイン設定の組み込み
5. エラーメッセージの表示機能

技術要件:
- TypeScript
- 動的HTML/CSS/JavaScript生成
- バリデーションロジック
- エラーハンドリング」
```

**期待される出力:**
```typescript
// src/shared/utils/dataManager.ts
export function generateFormScript(form: Form): string {
  const namespace = `ir-form-${form.id}`;
  const formId = `${namespace}-form`;
  const formElementId = `${namespace}-element`;

  return `
    <div id="${formElementId}"></div>
    <script>
    (function() {
      const form = document.getElementById('${formElementId}');
      if (!form) return;

      // バリデーション関数
      function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        if (isRequired && !value) {
          showFieldError(field.id, 'この項目は必須です');
          return false;
        }
        
        if (field.type === 'email' && value && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
          showFieldError(field.id, '有効なメールアドレスを入力してください');
          return false;
        }
        
        clearFieldError(field.id);
        return true;
      }

      function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        field.classList.add('ir-form-error');
        
        let errorElement = field.parentNode.querySelector('.ir-form-error-message');
        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.className = 'ir-form-error-message';
          field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
      }

      function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        field.classList.remove('ir-form-error');
        const errorElement = field.parentNode.querySelector('.ir-form-error-message');
        if (errorElement) {
          errorElement.remove();
        }
      }

      // 全フィールドのバリデーション
      function validateForm() {
        const fields = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        fields.forEach(field => {
          if (!validateField(field)) {
            isValid = false;
          }
        });
        
        // ドメイン設定のバリデーション
        const allowedDomains = ${JSON.stringify(form.settings.allowedDomains || [])};
        if (!allowedDomains || allowedDomains.length === 0 || allowedDomains.some(domain => !domain.trim())) {
          alert('エラー: 許可ドメインが設定されていません。フォーム管理者にお問い合わせください。');
          isValid = false;
        }
        
        return isValid;
      }

      // フォーム送信処理
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
          const firstError = form.querySelector('.ir-form-error');
          if (firstError) {
            firstError.focus();
          }
          return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
          const response = await fetch('/api/inquiries', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...data,
              formId: '${form.id}',
              allowedDomains: ${JSON.stringify(form.settings.allowedDomains || [])}
            })
          });

          if (response.ok) {
            alert('お問い合わせを受け付けました。ありがとうございます。');
            form.reset();
          } else {
            throw new Error('送信に失敗しました');
          }
        } catch (error) {
          alert('エラーが発生しました。しばらく時間をおいて再度お試しください。');
        }
      });

      // リアルタイムバリデーション
      form.addEventListener('input', function(e) {
        if (e.target.matches('input, textarea, select')) {
          validateField(e.target);
        }
      });

      form.addEventListener('blur', function(e) {
        if (e.target.matches('input, textarea, select')) {
          validateField(e.target);
        }
      }, true);
    })();
    </script>
    <style>
    /* 名前空間ベースのCSS（衝突を防ぐため） */
    .ir-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .ir-form {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .ir-form-field {
      margin-bottom: 20px;
    }
    
    .ir-form-label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: #374151;
    }
    
    .ir-form-input,
    .ir-form-textarea,
    .ir-form-select {
      width: 100%;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    }
    
    .ir-form-input:focus,
    .ir-form-textarea:focus,
    .ir-form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .ir-form-error {
      border-color: #dc3545 !important;
      box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
    }
    
    .ir-form-error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .ir-form-error-message::before {
      content: "⚠";
      font-size: 14px;
    }
    
    .ir-form-button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .ir-form-button:hover {
      background: #2563eb;
    }
    
    .ir-form-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
    </style>
  `;
}
```

**解決した問題:**
- 名前空間プレフィックスによる衝突回避
- クライアントサイドバリデーション機能
- 許可ドメイン設定の組み込み
- エラーメッセージの表示機能
- 埋め込みフォームの完全自己完結

## 実装例7: フォーム複製機能の実装

### フォーム複製機能の追加

**問題:** 既存フォームをベースに新しいフォームを効率的に作成する機能

**AIプロンプト:**
```
「form-editorにフォーム複製機能を実装してください：

現在の状況:
- 新規フォーム作成時に毎回一から設定が必要
- 類似フォームの作成が非効率
- フォームテンプレート機能の不足

実装要件:
1. 既存フォームの完全複製
2. 新しいIDの自動生成
3. フォーム名の自動変更（「(コピー)」追加）
4. 作成日時の更新
5. 複製ボタンのUI追加

技術要件:
- TypeScript
- React hooks
- フォームデータ管理
- UI/UX改善」
```

**期待される出力:**
```tsx
// src/components/FormList.tsx
import { Files } from 'lucide-react';

interface FormListProps {
  forms: Form[];
  onCreateForm: () => void;
  onEditForm: (form: Form) => void;
  onDeleteForm: (formId: string) => void;
  onDuplicateForm: (form: Form) => void; // 新規追加
}

export default function FormList({ 
  forms, 
  onCreateForm, 
  onEditForm, 
  onDeleteForm, 
  onDuplicateForm 
}: FormListProps) {
  return (
    <div className="space-y-4">
      {forms.map((form) => (
        <Card key={form.id} className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 px-4 py-4 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-3">
              {/* フォーム名 */}
              <div className="w-full">
                <CardTitle className="text-base sm:text-lg font-semibold break-words leading-tight">
                  {form.name}
                </CardTitle>
              </div>

              {/* アクションボタン */}
              <div className="flex justify-end">
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditForm(form)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                    title="編集"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDuplicateForm(form)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-purple-100 hover:text-purple-600"
                    title="フォームを複製"
                  >
                    <Files className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(form.id)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="削除"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
```

```tsx
// src/app/page.tsx
const handleDuplicateForm = (originalForm: Form) => {
  const duplicatedForm: Form = {
    ...originalForm,
    id: generateId(),
    name: `${originalForm.name} (コピー)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  setSelectedForm(duplicatedForm);
  setIsEditing(true);
  setShowPreview(false);
};
```

**解決した問題:**
- フォーム作成の効率化
- テンプレート機能の実現
- ユーザビリティの向上
- アイコンの視覚的区別（Copy vs Files）

## 実装例8: shadcn/ui Tabsコンポーネントの正しい実装

### Tabsコンポーネントの実装改善

**問題:** shadcn/uiのTabsコンポーネントの正しい使用方法の理解と実装

**AIプロンプト:**
```
「form-editorのTabsコンポーネントをshadcn/uiの正しい使用方法に修正してください：

現在の実装:
<TabsList className="w-full bg-gray-100 p-1 h-10">
  <TabsTrigger className="text-sm data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-200 transition-colors px-4 py-2 h-8 flex items-center justify-center flex-1 mr-0.5">

問題点:
- 過度なカスタマイズでデフォルトの動作を上書き
- レイアウトの競合（カスタムクラスがデフォルトと競合）
- 複雑性（不要なクラスが多数）

修正要件:
1. shadcn/uiのデフォルト動作を活用
2. 必要最小限のカスタマイズのみ
3. 適切な余白とレイアウトの確保
4. アクティブ状態とホバー効果の実装

技術要件:
- shadcn/ui Tabs
- TypeScript
- Tailwind CSS
- モノトーンデザイン」
```

**期待される出力:**
```tsx
// 修正後の正しい実装
<TabsList className="w-full">
  <TabsTrigger
    value="hp"
    className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-200 transition-colors"
  >
    HP問合せシステム ({hpInboxMessages.length})
  </TabsTrigger>
  <TabsTrigger
    value="emidas"
    className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-200 transition-colors"
  >
    エミダスシステム ({emidasInboxMessages.length})
  </TabsTrigger>
</TabsList>
```

**解決した問題:**
- shadcn/uiのデフォルト動作の活用
- 適切な余白とレイアウトの確保
- シンプルで保守しやすいコード
- モノトーンデザインの統一

**重要なポイント:**
- TabsList: デフォルトのクラスのみ使用（`w-full`のみ）
- TabsTrigger: 必要最小限のカスタマイズ（アクティブ状態とホバー効果のみ）
- デフォルトのレイアウト機能を活用
- カスタムクラスによる競合を回避

## 実装例9: AlertDialogコンポーネントの統一実装

### AlertDialogの統一とバックドロップ透明度の調整

**問題:** 署名管理・メール削除とフォーム管理のAlertDialogでバックドロップの透明度が異なる

**AIプロンプト:**
```
「form-editorのAlertDialogコンポーネントのバックドロップ透明度を統一してください：

現在の状況:
- 署名管理・メール削除: bg-black/50
- フォーム管理: bg-black/80 backdrop-blur-sm

統一要件:
1. UXの観点から適切な透明度を選択
2. システム全体で統一
3. アクセシビリティの向上
4. 視覚的な一貫性の確保

技術要件:
- shadcn/ui AlertDialog
- バックドロップ透明度の統一
- フォーカス管理の改善」
```

**期待される出力:**
```tsx
// src/components/ui/alert-dialog.tsx
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
```

**解決した問題:**
- バックドロップ透明度の統一（bg-black/80 backdrop-blur-sm）
- 視覚的な一貫性の確保
- アクセシビリティの向上
- フォーカス管理の改善

### メール削除と署名管理でのAlertDialog実装

**AIプロンプト:**
```
「form-editorのメール削除と署名管理でAlertDialogを実装してください：

実装要件:
1. 標準のconfirm()からAlertDialogに移行
2. 統一されたデザインの適用
3. 適切なテキストコントラストの確保
4. ホバーインタラクションの追加
5. アクセシビリティの向上

技術要件:
- shadcn/ui AlertDialog
- モノトーンデザイン
- 赤色の削除ボタン
- 白文字でのコントラスト改善」
```

**期待される出力:**
```tsx
// メール削除のAlertDialog実装
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button
      variant="ghost"
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent className="bg-white border border-gray-200 shadow-lg">
    <AlertDialogHeader>
      <AlertDialogTitle>メールを削除</AlertDialogTitle>
      <AlertDialogDescription>
        このメールを削除しますか？この操作は取り消せません。
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="hover:bg-gray-100 transition-colors">
        キャンセル
      </AlertDialogCancel>
      <AlertDialogAction 
        className="bg-red-600 hover:bg-red-700 text-white"
        onClick={handleDelete}
      >
        削除
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**解決した問題:**
- 標準confirm()からの移行
- 統一されたデザインの適用
- 適切なテキストコントラスト（白文字）
- ホバーインタラクションの追加
- アクセシビリティの向上

## 実装例10: システム全体のホバーインタラクション統一

### ホバーインタラクションのシステム全体適用

**問題:** 一部のボタンにホバーインタラクションが不足し、クリッカビリティが伝わりにくい

**AIプロンプト:**
```
「form-editorのシステム全体でホバーインタラクションを統一してください：

現在の状況:
- 一部のボタンにホバー効果が不足
- クリッカビリティが伝わりにくい
- インタラクションの一貫性が不足

統一要件:
1. 既存のホバー効果は保持
2. 未適用のボタンにホバー効果を追加
3. システム全体で一貫したインタラクション
4. アクセシビリティの向上
5. ユーザビリティの改善

技術要件:
- Tailwind CSS transition-colors
- 適切な色変化
- スムーズなアニメーション
- モノトーンデザインの維持」
```

**期待される出力:**
```tsx
// フィルターボタンのホバー効果
<Button
  variant="outline"
  size="sm"
  className="hover:bg-gray-50 transition-colors"
>
  フィルター
</Button>

// 詳細オプションボタンのホバー効果
<Button
  variant="ghost"
  size="sm"
  className="hover:bg-gray-100 transition-colors"
>
  <MoreHorizontal className="h-4 w-4" />
</Button>

// フォーム作成ボタンのホバー効果
<Button
  className="bg-black hover:bg-gray-800 text-white shadow-sm hover:shadow-xl transition-all duration-200"
>
  新規フォーム作成
</Button>

// 返信ボタンのホバー効果
<Button
  className={`transition-colors ${isReplying 
    ? "bg-gray-100 hover:bg-gray-200" 
    : "hover:bg-gray-50"
  }`}
>
  {isReplying ? "返信をキャンセル" : "返信"}
</Button>

// 削除ボタンのホバー効果
<Button
  variant="ghost"
  size="sm"
  className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
>
  <Trash2 className="h-4 w-4" />
</Button>
```

**解決した問題:**
- システム全体のホバーインタラクション統一
- クリッカビリティの向上
- ユーザビリティの改善
- アクセシビリティの向上
- 視覚的フィードバックの一貫性

### タブボタンのホバーインタラクション

**AIプロンプト:**
```
「form-editorのタブボタンにホバーインタラクションを追加してください：

実装要件:
1. タブボタンのホバー効果
2. アクティブ状態との区別
3. スムーズなトランジション
4. モノトーンデザインの維持

技術要件:
- shadcn/ui Tabs
- Tailwind CSS
- モノトーンデザイン」
```

**期待される出力:**
```tsx
<TabsTrigger
  value="hp"
  className="data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-200 transition-colors"
>
  HP問合せシステム ({hpInboxMessages.length})
</TabsTrigger>
```

**解決した問題:**
- タブボタンのホバー効果追加
- アクティブ状態との明確な区別
- スムーズなトランジション
- モノトーンデザインの統一

## 実装例11: アクセシビリティの強化

### キーボードナビゲーションの実装

**AIプロンプト:**
```
「form-editorのキーボードナビゲーションを実装してください：

実装要件:
1. Tab順序の最適化
2. フォーカス管理
3. キーボードショートカット
4. スキップリンク
5. フォーカストラップ

対象コンポーネント:
- 全コンポーネント
- モーダル
- ドロップダウンメニュー
- フォーム

技術要件:
- ARIA attributes
- キーボードイベント処理
- フォーカス管理
- アクセシビリティテスト」
```

**期待される出力:**

```tsx
// src/components/accessibility/SkipLink.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function SkipLink() {
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        skipLinkRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <a
      ref={skipLinkRef}
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
    >
      メインコンテンツにスキップ
    </a>
  );
}
```

```tsx
// src/hooks/useKeyboardNavigation.ts
'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardNavigationOptions {
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        if (e.ctrlKey || e.metaKey) {
          options.onEnter?.();
        }
        break;
      case 'Escape':
        options.onEscape?.();
        break;
      case 'ArrowUp':
        e.preventDefault();
        options.onArrowUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        options.onArrowDown?.();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        options.onArrowLeft?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        options.onArrowRight?.();
        break;
      case 'Tab':
        if (e.shiftKey) {
          options.onShiftTab?.();
        } else {
          options.onTab?.();
        }
        break;
    }
  }, [options]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
```

```tsx
// src/components/accessibility/FocusTrap.tsx
'use client';

import { useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
}

export default function FocusTrap({ children, active }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return (
    <div ref={containerRef} className={active ? 'focus-trap' : ''}>
      {children}
    </div>
  );
}
```

## まとめ

これらの実装例を参考に、AIを活用してform-editorアプリケーションのデザインを段階的に改善できます。重要なポイントは：

1. **段階的なアプローチ**: 一度にすべてを変更せず、小さなステップで進める
2. **品質保証**: 各段階でテストと検証を行う
3. **パフォーマンス考慮**: 最適化を常に意識する
4. **アクセシビリティ**: すべてのユーザーが利用できるようにする
5. **ドキュメント化**: 変更内容を適切にドキュメント化する

これらの例を基に、AIプロンプトを調整して、あなたの具体的な要件に合わせた実装を行ってください。
