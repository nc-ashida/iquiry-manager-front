# 署名CRUD操作

署名の作成・読み取り・更新・削除機能です。

## 📋 機能概要

メール返信時に使用する署名の管理機能を提供します。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/components/SignatureEditor.tsx` (306行)

### 署名データ構造
```typescript
interface Signature {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
}

interface CreateSignatureRequest {
  name: string;
  content: string;
  isDefault?: boolean;
}

interface UpdateSignatureRequest extends Partial<CreateSignatureRequest> {
  id: string;
}
```

## 🎯 主要機能

### 1. 署名一覧表示
```typescript
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
```

### 2. 署名作成・編集ダイアログ
```typescript
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
      {/* 署名名入力 */}
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
      
      {/* 署名内容入力 */}
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
      
      {/* デフォルト署名設定 */}
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
      
      {/* ボタン */}
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
```

### 3. 署名保存処理
```typescript
const handleSave = async () => {
  if (!formData.name.trim() || !formData.content.trim()) {
    alert('署名名と内容は必須です。');
    return;
  }

  try {
    if (editingSignature) {
      // 更新処理
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
      // 新規作成処理
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
```

### 4. 署名削除処理
```typescript
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
```

### 5. 署名編集処理
```typescript
const handleEdit = (signature: Signature) => {
  setEditingSignature(signature);
  setFormData({
    name: signature.name,
    content: signature.content,
    isDefault: signature.isDefault
  });
  setIsDialogOpen(true);
};
```

## 🔄 状態管理

### 署名状態
```typescript
const [signatures, setSignatures] = useState<Signature[]>([]);
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [editingSignature, setEditingSignature] = useState<Signature | null>(null);
const [formData, setFormData] = useState({
  name: '',
  content: '',
  isDefault: false
});
```

### データ読み込み
```typescript
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
```

### フォームリセット
```typescript
const resetForm = () => {
  setFormData({ name: '', content: '', isDefault: false });
  setEditingSignature(null);
};

const handleDialogClose = () => {
  resetForm();
  setIsDialogOpen(false);
};
```

## 🎨 署名カードのUI要素

### 署名カード
```typescript
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDelete(signature.id)}
          className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
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
```

### 空状態の表示
```typescript
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
```

## 🎨 レスポンシブ対応

### ダイアログのレスポンシブ対応
```typescript
<DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 shadow-2xl">
  <DialogHeader>
    <DialogTitle className="text-xl font-semibold text-gray-900">
      {editingSignature ? '署名を編集' : '新規署名を作成'}
    </DialogTitle>
  </DialogHeader>
  <div className="space-y-6 py-4 bg-white dark:bg-gray-900">
    {/* 署名内容 */}
  </div>
</DialogContent>
```

### ボタンのレスポンシブ対応
```typescript
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
```

## ⚠️ リファクタリング時の注意点

1. **署名データ構造**: 現在の署名データ構造を維持
2. **CRUD操作**: 作成・読み取り・更新・削除の機能を維持
3. **デフォルト署名**: デフォルト署名の管理機能を維持
4. **フォールバック**: API失敗時のローカルデータフォールバックを維持
5. **UI/UX**: 現在のカード形式UIを維持

## 📁 関連ファイル

- `src/components/SignatureEditor.tsx` - メイン実装
- `src/app/signatures/page.tsx` - 署名管理ページ
- `src/data/signatures.ts` - デフォルト署名データ
- `src/shared/types/index.ts` - 型定義

## 🔗 関連機能

- **署名統合**: フォーム設定での署名選択
- **メール返信**: 返信時の署名使用
- **データ管理**: 署名データの永続化
- **API統合**: 署名データのAPI連携

## 📝 テストケース

### 正常系
1. 署名一覧の表示
2. 新規署名の作成
3. 署名の編集
4. 署名の削除
5. デフォルト署名の設定
6. 署名の検索・フィルタ

### 異常系
1. 必須項目の未入力
2. API通信の失敗
3. デフォルト署名の重複
4. 署名内容の長さ制限

## 🚀 改善提案

1. **署名テンプレート**: よく使われる署名のテンプレート
2. **署名プレビュー**: リアルタイムプレビュー機能
3. **署名検索**: 署名の検索・フィルタ機能
4. **署名統計**: 署名使用統計の表示
5. **署名インポート/エクスポート**: 署名データの移行機能
6. **署名バージョン管理**: 署名の履歴管理
