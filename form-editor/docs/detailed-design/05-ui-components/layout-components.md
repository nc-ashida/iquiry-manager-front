# レイアウトコンポーネント

アプリケーションの基本レイアウトを構成するコンポーネントの詳細仕様です。

## 📋 コンポーネント一覧

### 1. Header コンポーネント
- **ファイル**: `src/components/Header.tsx`
- **機能**: アプリケーションのヘッダー表示

### 2. AppSidebar コンポーネント
- **ファイル**: `src/components/AppSidebar.tsx`
- **機能**: アプリケーションのサイドバー表示

## 🔧 Header コンポーネント詳細

### 基本構造
```typescript
interface HeaderProps {
  currentPage: string;
}

export default function Header({ currentPage }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* ロゴ・タイトル部分 */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:hidden">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-black">
                <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-base sm:text-lg font-bold text-foreground truncate">フォームエディタ</h1>
            </div>
          </div>
          
          {/* ナビゲーション部分 */}
          <div className="flex-1"></div>
          
          {/* ユーザーメニュー部分 */}
          <div className="flex items-center">
            {/* ユーザーアバター */}
          </div>
        </div>
      </div>
    </header>
  );
}
```

### レスポンシブ対応

#### デスクトップ表示 (md以上)
- **ロゴ表示**: 非表示 (`md:hidden`)
- **ナビゲーション**: サイドバーで表示
- **レイアウト**: 横並びレイアウト

#### モバイル表示 (md未満)
- **ロゴ表示**: 表示 (`md:hidden`)
- **アイコンサイズ**: 小さいサイズ (`h-6 w-6 sm:h-8 sm:w-8`)
- **テキストサイズ**: 小さいサイズ (`text-base sm:text-lg`)
- **スペーシング**: 狭いスペーシング (`space-x-2 sm:space-x-4`)

### モバイルメニュー
```typescript
{/* モバイルナビゲーション */}
<div className="md:hidden border-t">
  <nav className="flex items-center justify-between py-2 px-2">
    {allNavigationItems.map((item) => (
      <a
        key={item.id}
        href={item.url}
        className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-xs font-medium transition-colors flex-1 ${
          isActive ? 'text-white bg-black' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
      </a>
    ))}
  </nav>
</div>
```

## 🔧 AppSidebar コンポーネント詳細

### 基本構造
```typescript
export function AppSidebar() {
  const pathname = usePathname();
  
  return (
    <Sidebar>
      <SidebarHeader>
        {/* ロゴ・アプリ名 */}
        <div className="flex items-center space-x-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-900">フォームエディタ</span>
            <span className="text-xs text-gray-500">v1.0.0</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* ナビゲーションメニュー */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-gray-600">FORM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2 text-xs text-gray-500">
          © 2024 Form Editor
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
```

### メニュー構成
```typescript
// フォーム関連メニュー
const items = [
  {
    title: "フォーム管理",
    url: "/",
    icon: Home,
  },
  {
    title: "署名管理",
    url: "/signatures",
    icon: PenTool,
  },
];

// メール関連メニュー
const mailItems = [
  {
    title: "受信",
    url: "/mail/inbox",
    icon: Inbox,
  },
  {
    title: "送信",
    url: "/mail/sent",
    icon: Send,
  },
];

// 設定関連メニュー
const settingsItems = [
  {
    title: "ヘルプ",
    url: "/help",
    icon: HelpCircle,
  },
];
```

## 🎨 レスポンシブ対応の詳細

### 1. ヘッダーのレスポンシブ対応

#### デスクトップ (md以上)
```typescript
// ロゴ部分を非表示
<div className="flex items-center space-x-2 sm:space-x-4 md:hidden">
  {/* ロゴ・タイトル */}
</div>

// ナビゲーションはサイドバーで表示
<div className="flex-1"></div>
```

#### モバイル (md未満)
```typescript
// ロゴ部分を表示
<div className="flex items-center space-x-2 sm:space-x-4 md:hidden">
  <div className="flex items-center space-x-2">
    <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-black">
      <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
    </div>
    <h1 className="text-base sm:text-lg font-bold text-foreground truncate">フォームエディタ</h1>
  </div>
</div>

// モバイルナビゲーションを表示
<div className="md:hidden border-t">
  <nav className="flex items-center justify-between py-2 px-2">
    {/* ナビゲーションメニュー */}
  </nav>
</div>
```

### 2. サイドバーのレスポンシブ対応

#### デスクトップ
- **表示**: 常に表示
- **幅**: 固定幅
- **位置**: 左側固定

#### モバイル
- **表示**: 折りたたみ可能
- **幅**: 全幅
- **位置**: オーバーレイ表示

### 3. コンテンツエリアのレスポンシブ対応

#### デスクトップ
```typescript
<SidebarInset>
  <Header currentPage="forms" />
  <main className="flex-1 p-4 sm:p-6">
    {/* コンテンツ */}
  </main>
</SidebarInset>
```

#### モバイル
```typescript
<SidebarInset>
  <Header currentPage="forms" />
  <main className="flex-1 p-4 sm:p-6">
    {/* コンテンツ - パディング調整 */}
  </main>
</SidebarInset>
```

## 🔄 状態管理

### ヘッダーの状態
```typescript
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

### サイドバーの状態
```typescript
// SidebarProviderで管理
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    {/* コンテンツ */}
  </SidebarInset>
</SidebarProvider>
```

## ⚠️ リファクタリング時の注意点

1. **レスポンシブクラス**: 現在のTailwind CSSクラスを維持
2. **ブレークポイント**: `md:` ブレークポイントでの切り替えを維持
3. **モバイルメニュー**: モバイル専用ナビゲーションの機能を維持
4. **サイドバー**: shadcn/uiのSidebarコンポーネントの機能を維持
5. **アクセシビリティ**: キーボード操作とスクリーンリーダー対応を維持

## 📁 関連ファイル

- `src/components/Header.tsx` - ヘッダーコンポーネント
- `src/components/AppSidebar.tsx` - サイドバーコンポーネント
- `src/components/ui/sidebar.tsx` - サイドバーUIコンポーネント
- `src/hooks/use-mobile.ts` - モバイル判定フック

## 🔗 関連機能

- **ナビゲーション**: ページ間の遷移
- **認証**: ユーザー認証状態の表示
- **テーマ**: ダークモード/ライトモードの切り替え
- **通知**: 通知の表示

## 📝 テストケース

### 正常系
1. デスクトップ表示でのヘッダー表示
2. モバイル表示でのヘッダー表示
3. サイドバーの表示/非表示
4. ナビゲーションメニューの動作
5. レスポンシブ切り替え

### 異常系
1. 画面サイズ変更時の表示崩れ
2. モバイルメニューの開閉エラー
3. ナビゲーションのリンクエラー

## 🚀 改善提案

1. **パフォーマンス最適化**: 不要な再レンダリングの防止
2. **アクセシビリティ向上**: キーボード操作の改善
3. **アニメーション**: スムーズなトランジション効果
4. **テーマ対応**: ダークモードの完全対応
5. **国際化**: 多言語対応
