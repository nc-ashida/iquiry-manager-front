# フォーム設定機能

フォームの詳細設定（自動返信、ファイルアップロード、許可ドメイン等）を管理する機能です。

## 📋 機能概要

フォームの送信設定、自動返信設定、ファイルアップロード設定、許可ドメイン設定等の詳細設定を行います。

## 🔧 実装詳細

### ファイル位置
- **メインファイル**: `src/components/SettingsEditor.tsx`
- **統合場所**: `src/components/FormEditor.tsx` (設定部分)

### コンポーネント構成
```typescript
interface SettingsEditorProps {
  settings: FormSettings;
  signatures: Signature[];
  onSettingsChange: (settings: FormSettings) => void;
}
```

## 🎯 主要機能

### 1. 自動返信設定
```typescript
{/* 自動返信設定 */}
<div className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
  <div className="space-y-2 flex-1 pr-4">
    <Label
      htmlFor="autoReply"
      className="text-base font-semibold cursor-pointer text-gray-900"
    >
      自動返信
    </Label>
    <p className="text-sm text-gray-600 leading-relaxed">
      フォーム送信時に自動返信メールを送信します
    </p>
  </div>
  <div className="flex-shrink-0">
    <Switch
      id="autoReply"
      checked={currentForm.settings.autoReply}
      onCheckedChange={(checked: boolean) =>
        handleFormChange({
          settings: { ...currentForm.settings, autoReply: checked }
        })
      }
    />
  </div>
</div>
```

### 2. ファイルアップロード設定
```typescript
{/* 添付ファイル設定 */}
<div className="space-y-4">
  <div className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
    <div className="space-y-2 flex-1 pr-4">
      <Label
        htmlFor="fileUpload"
        className="text-base font-semibold cursor-pointer text-gray-900"
      >
        添付ファイル
      </Label>
      <p className="text-sm text-gray-600 leading-relaxed">
        このフォームで添付ファイルの送信を許可します
      </p>
    </div>
    <div className="flex-shrink-0">
      <Switch
        id="fileUpload"
        checked={currentForm.settings.fileUpload?.enabled || false}
        onCheckedChange={(checked: boolean) => {
          const currentFileUpload = currentForm.settings.fileUpload || {
            enabled: false,
            maxFiles: 1,
            maxFileSize: 10
          };
          handleFormChange({
            settings: {
              ...currentForm.settings,
              fileUpload: {
                ...currentFileUpload,
                enabled: checked
              }
            }
          });
        }}
      />
    </div>
  </div>

  {/* 添付ファイルの詳細設定 */}
  {currentForm.settings.fileUpload?.enabled && (
    <div className="space-y-6 pl-8 border-l-2 border-black bg-gray-50/50 p-6 rounded-r-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="maxFiles" className="text-sm font-semibold text-gray-900">
            最大ファイル数
          </Label>
          <Input
            id="maxFiles"
            type="number"
            min="1"
            max="5"
            value={currentForm.settings.fileUpload?.maxFiles || 1}
            onChange={(e) => {
              const value = Math.min(5, Math.max(1, parseInt(e.target.value) || 1));
              handleFormChange({
                settings: {
                  ...currentForm.settings,
                  fileUpload: {
                    ...currentForm.settings.fileUpload!,
                    maxFiles: value
                  }
                }
              });
            }}
            className="h-10"
          />
          <p className="text-sm text-gray-600">1〜5ファイルまで</p>
        </div>
        <div className="space-y-3">
          <Label htmlFor="maxFileSize" className="text-sm font-semibold text-gray-900">
            1ファイルあたりの最大容量 (MB)
          </Label>
          <Input
            id="maxFileSize"
            type="number"
            min="1"
            max="20"
            value={currentForm.settings.fileUpload?.maxFileSize || 10}
            onChange={(e) => {
              const value = Math.min(20, Math.max(1, parseInt(e.target.value) || 1));
              handleFormChange({
                settings: {
                  ...currentForm.settings,
                  fileUpload: {
                    ...currentForm.settings.fileUpload!,
                    maxFileSize: value
                  }
                }
              });
            }}
            className="h-10"
          />
          <p className="text-sm text-gray-600">1〜20MBまで</p>
        </div>
      </div>
      <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-lg border border-gray-200">
        💡 添付ファイルは自動的にフォームの最後に表示されます
      </div>
    </div>
  )}
</div>
```

### 3. 許可ドメイン設定
```typescript
{/* 許可ドメイン設定 */}
<div className="space-y-4">
  <div className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
    <div className="space-y-2 flex-1 pr-4">
      <Label
        htmlFor="allowedDomains"
        className="text-base font-semibold cursor-pointer text-gray-900"
      >
        許可ドメイン設定
      </Label>
      <p className="text-sm text-gray-600 leading-relaxed">
        問合せ受付を許可するドメインを指定します（CORS設定用）
      </p>
    </div>
  </div>

  {/* ドメイン一覧 */}
  <div className="space-y-4 pl-8 border-l-2 border-blue-200 bg-blue-50/30 p-6 rounded-r-xl">
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-gray-900">
        許可ドメイン一覧
      </Label>
      <p className="text-xs text-gray-600">
        例: example.com, subdomain.example.com, localhost:3000
      </p>

      {/* ドメイン入力エリア */}
      <div className="space-y-2">
        {currentForm.settings.allowedDomains?.map((domain, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              type="text"
              value={domain}
              onChange={(e) => {
                const newDomains = [...(currentForm.settings.allowedDomains || [])];
                newDomains[index] = e.target.value;
                handleFormChange({
                  settings: {
                    ...currentForm.settings,
                    allowedDomains: newDomains
                  }
                });
              }}
              placeholder="example.com"
              className={`flex-1 ${!domain.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const currentDomains = currentForm.settings.allowedDomains || [];
                // 最低1つは残す必要がある
                if (currentDomains.length <= 1) {
                  return; // 削除を無効化
                }
                const newDomains = [...currentDomains];
                newDomains.splice(index, 1);
                handleFormChange({
                  settings: {
                    ...currentForm.settings,
                    allowedDomains: newDomains
                  }
                });
              }}
              disabled={(currentForm.settings.allowedDomains || []).length <= 1}
              className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${(currentForm.settings.allowedDomains || []).length <= 1
                ? 'opacity-50 cursor-not-allowed'
                : ''
                }`}
            >
              削除
            </Button>
          </div>
        )) || []}

        {/* ドメイン追加ボタン */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const currentDomains = currentForm.settings.allowedDomains || [];
            // 空のドメインがある場合は追加しない
            if (currentDomains.some(domain => !domain.trim())) {
              return;
            }
            const newDomains = [...currentDomains, ''];
            handleFormChange({
              settings: {
                ...currentForm.settings,
                allowedDomains: newDomains
              }
            });
          }}
          disabled={(currentForm.settings.allowedDomains || []).some(domain => !domain.trim())}
          className={`w-full border-dashed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 ${(currentForm.settings.allowedDomains || []).some(domain => !domain.trim())
            ? 'opacity-50 cursor-not-allowed'
            : ''
            }`}
        >
          + ドメインを追加
        </Button>
      </div>

      {/* バリデーションエラー表示 */}
      {(!currentForm.settings.allowedDomains ||
        currentForm.settings.allowedDomains.length === 0 ||
        currentForm.settings.allowedDomains.some(domain => !domain.trim())) && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="text-red-600 text-sm">❌</div>
              <div className="text-xs text-red-800">
                <p className="font-medium mb-1">必須設定エラー:</p>
                <ul className="space-y-1 text-xs">
                  <li>• 最低1つ以上のドメインを登録してください</li>
                  <li>• 空のドメインは登録できません</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      {/* 注意事項 */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="text-yellow-600 text-sm">⚠️</div>
          <div className="text-xs text-yellow-800">
            <p className="font-medium mb-1">設定時の注意事項:</p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>最低1つ以上のドメイン登録が必須です</strong></li>
              <li>• プロトコル（http://, https://）は不要です</li>
              <li>• ポート番号を含める場合は「:」で区切ってください</li>
              <li>• ワイルドカード（*）は使用できません</li>
              <li>• 開発環境では「localhost:3000」などを追加してください</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 4. 送信設定（SettingsEditor）
```typescript
{/* 送信設定 */}
<div className="space-y-3">
  <Label className="text-sm font-medium">送信設定</Label>
  <SettingsEditor
    settings={currentForm.settings}
    signatures={signatures}
    onSettingsChange={(settings) => handleFormChange({ settings })}
  />
</div>
```

## 🔧 SettingsEditor コンポーネント詳細

### 完了ページURL設定
```typescript
{/* 完了ページURL */}
<div>
  <label className="block text-base font-medium text-gray-700 mb-2">
    完了ページURL
  </label>
  <input
    type="url"
    value={settings.completionUrl}
    onChange={(e) => handleCompletionUrlChange(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="https://example.com/thank-you"
  />
  <p className="mt-1 text-base text-gray-500">
    フォーム送信完了後にリダイレクトするURLを指定してください。空の場合はアラートで完了を通知します。
  </p>
</div>
```

### 署名選択
```typescript
{/* 署名選択 */}
<div>
  <label className="block text-base font-medium text-gray-700 mb-2">
    送信控えメールの署名
  </label>
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
  <p className="mt-1 text-base text-gray-500">
    送信控えメールに使用する署名を選択してください。
  </p>
</div>
```

### 署名プレビュー
```typescript
{/* 選択された署名のプレビュー */}
{settings.signatureId && (
  <div className="bg-gray-50 border border-gray-200 rounded-none p-4">
    <h4 className="font-medium text-gray-900 mb-2">署名プレビュー</h4>
    <div className="text-base text-gray-700 whitespace-pre-line">
      {signatures.find(s => s.id === settings.signatureId)?.content}
    </div>
  </div>
)}
```

## 🎨 レスポンシブ対応

### 1. グリッドレイアウト
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div className="space-y-3">
    <Label htmlFor="maxFiles" className="text-sm font-semibold text-gray-900">
      最大ファイル数
    </Label>
    <Input
      id="maxFiles"
      type="number"
      min="1"
      max="5"
      value={currentForm.settings.fileUpload?.maxFiles || 1}
      onChange={(e) => {
        const value = Math.min(5, Math.max(1, parseInt(e.target.value) || 1));
        handleFormChange({
          settings: {
            ...currentForm.settings,
            fileUpload: {
              ...currentForm.settings.fileUpload!,
              maxFiles: value
            }
          }
        });
      }}
      className="h-10"
    />
    <p className="text-sm text-gray-600">1〜5ファイルまで</p>
  </div>
  {/* 2列目の設定 */}
</div>
```

### 2. ドメイン入力エリア
```typescript
<div className="flex items-center space-x-2">
  <Input
    type="text"
    value={domain}
    onChange={(e) => {
      const newDomains = [...(currentForm.settings.allowedDomains || [])];
      newDomains[index] = e.target.value;
      handleFormChange({
        settings: {
          ...currentForm.settings,
          allowedDomains: newDomains
        }
      });
    }}
    placeholder="example.com"
    className={`flex-1 ${!domain.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
  />
  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() => {
      // 削除処理
    }}
    disabled={(currentForm.settings.allowedDomains || []).length <= 1}
    className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${(currentForm.settings.allowedDomains || []).length <= 1
      ? 'opacity-50 cursor-not-allowed'
      : ''
      }`}
  >
    削除
  </Button>
</div>
```

## 🔄 状態管理

### 設定状態
```typescript
const [currentForm, setCurrentForm] = useState<Form | null>(form);
const [signatures, setSignatures] = useState<Signature[]>([]);
```

### 設定更新関数
```typescript
const handleFormChange = (updates: Partial<Form>) => {
  setCurrentForm({ ...currentForm, ...updates });
};

const handleCompletionUrlChange = (completionUrl: string) => {
  onSettingsChange({ ...settings, completionUrl });
};

const handleSignatureChange = (signatureId: string) => {
  onSettingsChange({ ...settings, signatureId });
};

const handleAutoReplyChange = (autoReply: boolean) => {
  onSettingsChange({ ...settings, autoReply });
};
```

## ⚠️ リファクタリング時の注意点

1. **設定項目**: 現在の設定項目を維持
2. **バリデーション**: 現在のバリデーション機能を維持
3. **レスポンシブ対応**: 現在のレスポンシブ対応を維持
4. **署名統合**: 署名選択機能を維持
5. **ドメイン設定**: 許可ドメイン設定の機能を維持

## 📁 関連ファイル

- `src/components/SettingsEditor.tsx` - 送信設定エディター
- `src/components/FormEditor.tsx` - フォーム設定統合
- `src/shared/types/index.ts` - 型定義
- `src/data/signatures.ts` - 署名データ

## 🔗 関連機能

- **フォーム管理**: フォーム設定の統合
- **署名管理**: 署名選択機能
- **バリデーション**: 設定値の検証
- **データ管理**: 設定データの永続化

## 📝 テストケース

### 正常系
1. 自動返信設定の切り替え
2. ファイルアップロード設定
3. 許可ドメイン設定
4. 署名選択
5. 完了ページURL設定

### 異常系
1. 無効なURLの入力
2. ドメイン設定のバリデーション
3. ファイルサイズ制限の超過
4. 必須設定の未入力

## 🚀 改善提案

1. **設定テンプレート**: よく使われる設定のテンプレート
2. **設定のインポート/エクスポート**: 設定データの移行
3. **設定のバージョン管理**: 設定の履歴管理
4. **設定の検証**: より詳細な設定値の検証
5. **設定のプレビュー**: 設定変更のプレビュー機能
6. **設定の一括操作**: 複数フォームの設定一括変更
