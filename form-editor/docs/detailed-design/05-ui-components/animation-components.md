# アニメーションコンポーネント

アプリケーション全体で使用されるアニメーション効果を提供するコンポーネントです。

## 📋 コンポーネント一覧

### 1. AnimatedCard コンポーネント
- **ファイル**: `src/components/animations/AnimatedCard.tsx`
- **機能**: カードのアニメーション効果

### 2. FadeIn コンポーネント
- **ファイル**: `src/components/animations/FadeIn.tsx`
- **機能**: フェードインアニメーション

### 3. StaggerContainer コンポーネント
- **ファイル**: `src/components/animations/StaggerContainer.tsx`
- **機能**: 段階的なアニメーション効果

## 🔧 主要コンポーネント詳細

### 1. AnimatedCard コンポーネント
```typescript
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  hover?: boolean;
  click?: boolean;
}

export default function AnimatedCard({
  children,
  className = '',
  delay = 0,
  duration = 0.3,
  hover = true,
  click = true
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
      whileHover={hover ? {
        scale: 1.02,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={click ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**特徴:**
- フェードイン・スライドアップアニメーション
- ホバー時のスケール・シャドウ効果
- クリック時のスケール効果
- カスタマイズ可能な遅延・継続時間

### 2. FadeIn コンポーネント
```typescript
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className = ''
}: FadeInProps) {
  const directionVariants = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
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
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**特徴:**
- フェードインアニメーション
- 4方向のスライドアニメーション
- カスタマイズ可能な遅延・継続時間
- 再利用可能なコンポーネント

### 3. StaggerContainer コンポーネント
```typescript
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
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**特徴:**
- 子要素の段階的なアニメーション
- カスタマイズ可能な遅延時間
- 再利用可能なコンテナコンポーネント

## 🎨 アニメーション効果の使用例

### 1. フォーム一覧での使用
```typescript
// フォーム一覧でのアニメーション
<div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
  {paginatedForms.map((form, index) => (
    <AnimatedCard
      key={form.id}
      delay={index * 0.1}
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-fit"
    >
      <Card>
        <CardHeader className="pb-3 px-4 py-4 sm:px-6 sm:py-4">
          {/* フォーム内容 */}
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4 sm:px-6 sm:pb-6">
          {/* フォーム情報 */}
        </CardContent>
      </Card>
    </AnimatedCard>
  ))}
</div>
```

### 2. フィールドエディターでの使用
```typescript
// フィールドエディターでのアニメーション
{isExpanded && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.2 }}
    className="overflow-hidden"
  >
    <Card className="mt-2 border-l-4 border-l-primary bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Icon className="h-4 w-4" />
          <span>項目設定</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 設定内容 */}
      </CardContent>
    </Card>
  </motion.div>
)}
```

### 3. 返信フォームでの使用
```typescript
// 返信フォームでのアニメーション
{isReplying && (
  <div className="mb-6 p-4 bg-gray-50 rounded-lg border animate-in slide-in-from-top-2 duration-200">
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
        <Reply className="h-4 w-4 mr-2" />
        返信
      </h4>
      {/* 返信フォーム内容 */}
    </div>
  </div>
)}
```

### 4. ページ遷移での使用
```typescript
// ページ遷移でのアニメーション
<FadeIn direction="up" delay={0.2}>
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">ページタイトル</h1>
    <p className="text-gray-600">ページの説明</p>
  </div>
</FadeIn>
```

## 🔄 アニメーションの状態管理

### アニメーション状態
```typescript
// アニメーションの状態管理
const [isAnimating, setIsAnimating] = useState(false);
const [animationDelay, setAnimationDelay] = useState(0);

// アニメーション開始
const startAnimation = () => {
  setIsAnimating(true);
  setAnimationDelay(0);
};

// アニメーション終了
const endAnimation = () => {
  setIsAnimating(false);
};
```

### アニメーション制御
```typescript
// アニメーション制御
const animationControls = useAnimation();

const startCustomAnimation = async () => {
  await animationControls.start({
    x: 100,
    transition: { duration: 0.5 }
  });
};
```

## 🎨 カスタムアニメーション

### カスタムアニメーション定義
```typescript
// カスタムアニメーション定義
const customVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotate: -10
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    rotate: 10,
    transition: {
      duration: 0.3
    }
  }
};

// カスタムアニメーションの使用
<motion.div
  variants={customVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  {/* コンテンツ */}
</motion.div>
```

### 複雑なアニメーション
```typescript
// 複雑なアニメーション
const complexVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1
    }
  }
};

const childVariants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4
    }
  }
};
```

## 🎨 レスポンシブ対応

### レスポンシブアニメーション
```typescript
// レスポンシブアニメーション
const responsiveVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

// モバイルでのアニメーション調整
const mobileVariants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};
```

### デバイス別アニメーション
```typescript
// デバイス別アニメーション
const getAnimationVariants = (isMobile: boolean) => {
  if (isMobile) {
    return mobileVariants;
  }
  return responsiveVariants;
};
```

## ⚠️ リファクタリング時の注意点

1. **framer-motion**: 現在のframer-motionの機能を維持
2. **アニメーション効果**: 現在のアニメーション効果を維持
3. **パフォーマンス**: アニメーションのパフォーマンスを維持
4. **レスポンシブ対応**: 現在のレスポンシブ対応を維持
5. **アクセシビリティ**: アニメーションのアクセシビリティを維持

## 📁 関連ファイル

- `src/components/animations/AnimatedCard.tsx` - アニメーションカード
- `src/components/animations/FadeIn.tsx` - フェードインアニメーション
- `src/components/animations/StaggerContainer.tsx` - 段階的アニメーション
- `package.json` - framer-motion依存関係

## 🔗 関連機能

- **フォーム管理**: フォーム一覧のアニメーション
- **フィールド管理**: フィールドエディターのアニメーション
- **メール管理**: メール一覧のアニメーション
- **ページ遷移**: ページ遷移のアニメーション

## 📝 テストケース

### 正常系
1. アニメーションカードの表示
2. フェードインアニメーション
3. 段階的アニメーション
4. カスタムアニメーション
5. レスポンシブアニメーション

### 異常系
1. アニメーションの失敗
2. パフォーマンスの問題
3. アクセシビリティの問題

## 🚀 改善提案

1. **アニメーションの最適化**: パフォーマンスの向上
2. **アクセシビリティの向上**: アニメーションのアクセシビリティ
3. **アニメーションの拡張**: より多くのアニメーション効果
4. **アニメーションの制御**: より細かいアニメーション制御
5. **アニメーションのテーマ**: テーマに応じたアニメーション
6. **アニメーションの統計**: アニメーション使用統計
