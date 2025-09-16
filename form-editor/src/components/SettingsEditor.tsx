'use client';

import { FormSettings, Signature, Form } from '@/shared/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SettingsEditorProps {
  form: Form;
  settings: FormSettings;
  signatures: Signature[];
  onFormChange: (form: Partial<Form>) => void;
  onSettingsChange: (settings: FormSettings) => void;
}

export default function SettingsEditor({ form, settings, signatures, onFormChange, onSettingsChange }: SettingsEditorProps) {
  const handleFormNameChange = (name: string) => {
    onFormChange({ name });
  };

  const handleFormDescriptionChange = (description: string) => {
    onFormChange({ description });
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

  const handleFileUploadChange = (enabled: boolean) => {
    const currentFileUpload = settings.fileUpload || {
      enabled: false,
      maxFiles: 1,
      maxFileSize: 10
    };
    onSettingsChange({
      ...settings,
      fileUpload: {
        ...currentFileUpload,
        enabled
      }
    });
  };

  const handleMaxFilesChange = (maxFiles: number) => {
    const value = Math.min(5, Math.max(1, maxFiles));
    onSettingsChange({
      ...settings,
      fileUpload: {
        ...settings.fileUpload!,
        maxFiles: value
      }
    });
  };

  const handleMaxFileSizeChange = (maxFileSize: number) => {
    const value = Math.min(20, Math.max(1, maxFileSize));
    onSettingsChange({
      ...settings,
      fileUpload: {
        ...settings.fileUpload!,
        maxFileSize: value
      }
    });
  };

  const handleAllowedDomainsChange = (allowedDomains: string[]) => {
    onSettingsChange({ ...settings, allowedDomains });
  };

  const addDomain = () => {
    const currentDomains = settings.allowedDomains || [];
    if (currentDomains.some(domain => !domain.trim())) {
      return;
    }
    const newDomains = [...currentDomains, ''];
    handleAllowedDomainsChange(newDomains);
  };

  const removeDomain = (index: number) => {
    const currentDomains = settings.allowedDomains || [];
    if (currentDomains.length <= 1) {
      return;
    }
    const newDomains = [...currentDomains];
    newDomains.splice(index, 1);
    handleAllowedDomainsChange(newDomains);
  };

  const updateDomain = (index: number, value: string) => {
    const newDomains = [...(settings.allowedDomains || [])];
    newDomains[index] = value;
    handleAllowedDomainsChange(newDomains);
  };

  const handleRecipientEmailsChange = (recipientEmails: string[]) => {
    onSettingsChange({ ...settings, recipientEmails });
  };

  const addRecipientEmail = () => {
    const currentEmails = settings.recipientEmails || [];
    if (currentEmails.some(email => !email.trim())) {
      return;
    }
    if (currentEmails.length >= 10) {
      return;
    }
    const newEmails = [...currentEmails, ''];
    handleRecipientEmailsChange(newEmails);
  };

  const removeRecipientEmail = (index: number) => {
    const currentEmails = settings.recipientEmails || [];
    if (currentEmails.length <= 1) {
      return;
    }
    const newEmails = [...currentEmails];
    newEmails.splice(index, 1);
    handleRecipientEmailsChange(newEmails);
  };

  const updateRecipientEmail = (index: number, value: string) => {
    const newEmails = [...(settings.recipientEmails || [])];
    newEmails[index] = value;
    handleRecipientEmailsChange(newEmails);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">フォーム設定</h3>

      <div className="space-y-6">
        {/* フォーム基本情報 */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="formName" className="text-base font-semibold text-gray-900">
                  フォーム名称
                </Label>
                <Input
                  id="formName"
                  value={form.name}
                  onChange={(e) => handleFormNameChange(e.target.value)}
                  placeholder="フォームの名称を入力してください"
                  className="text-base"
                />
                <p className="text-xs text-gray-500">
                  フォームの識別に使用される名称です
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formDescription" className="text-base font-semibold text-gray-900">
                  フォーム説明
                </Label>
                <Input
                  id="formDescription"
                  value={form.description || ''}
                  onChange={(e) => handleFormDescriptionChange(e.target.value)}
                  placeholder="フォームの説明を入力してください（任意）"
                  className="text-base"
                />
                <p className="text-xs text-gray-500">
                  フォームの用途や内容を説明します（任意項目）
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* 添付ファイル設定 */}
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
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
                checked={settings.fileUpload?.enabled || false}
                onCheckedChange={handleFileUploadChange}
              />
            </div>
          </div>

          {/* 添付ファイルの詳細設定 */}
          {settings.fileUpload?.enabled && (
            <div className="space-y-6 pl-8 border-l-2 border-black bg-gray-50/50 p-4 sm:p-6 rounded-r-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFiles" className="text-sm font-semibold text-gray-900">
                    最大ファイル数
                  </Label>
                  <Input
                    id="maxFiles"
                    type="number"
                    min="1"
                    max="5"
                    value={settings.fileUpload?.maxFiles || 1}
                    onChange={(e) => handleMaxFilesChange(parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">
                    1回の送信でアップロードできる最大ファイル数（最大5ファイル）
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize" className="text-sm font-semibold text-gray-900">
                    最大ファイルサイズ（MB）
                  </Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    min="1"
                    max="20"
                    value={settings.fileUpload?.maxFileSize || 10}
                    onChange={(e) => handleMaxFileSizeChange(parseInt(e.target.value) || 10)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-600">
                    1ファイルあたりの最大サイズ（最大20MB）
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 自動返信設定 */}
        <div className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
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
              checked={settings.autoReply}
              onCheckedChange={handleAutoReplyChange}
            />
          </div>
        </div>

        {/* 許可ドメイン設定 */}
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
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
          <div className="space-y-4 pl-8 border-l-2 border-blue-200 bg-blue-50/30 p-4 sm:p-6 rounded-r-xl">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">
                許可ドメイン一覧
              </Label>
              <p className="text-xs text-gray-600">
                例: example.com, subdomain.example.com, localhost:3000
              </p>

              {/* ドメイン入力エリア */}
              <div className="space-y-2">
                {(settings.allowedDomains || ['localhost:3000']).map((domain, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={domain}
                      onChange={(e) => updateDomain(index, e.target.value)}
                      placeholder="example.com"
                      className={`flex-1 ${!domain.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDomain(index)}
                      disabled={(settings.allowedDomains || []).length <= 1}
                      className={`text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 ${(settings.allowedDomains || []).length <= 1
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                        }`}
                    >
                      削除
                    </Button>
                  </div>
                ))}

                {/* ドメイン追加ボタン */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDomain}
                  disabled={(settings.allowedDomains || []).some(domain => !domain.trim())}
                  className={`w-full border-dashed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 ${(settings.allowedDomains || []).some(domain => !domain.trim())
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                    }`}
                >
                  + ドメインを追加
                </Button>
              </div>

              {/* バリデーションエラー表示 */}
              {(!settings.allowedDomains ||
                settings.allowedDomains.length === 0 ||
                settings.allowedDomains.some(domain => !domain.trim())) && (
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

        {/* 送信先メールアドレス設定 */}
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
            <div className="space-y-2 flex-1 pr-4">
              <Label
                htmlFor="recipientEmails"
                className="text-base font-semibold cursor-pointer text-gray-900"
              >
                送信先メールアドレス
              </Label>
              <p className="text-sm text-gray-600 leading-relaxed">
                問合せフォームの送信先メールアドレスを指定します
              </p>
            </div>
          </div>

          {/* メールアドレス一覧 */}
          <div className="space-y-4 pl-8 border-l-2 border-green-200 bg-green-50/30 p-4 sm:p-6 rounded-r-xl">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900">
                送信先メールアドレス一覧
              </Label>
              <p className="text-xs text-gray-600">
                例: admin@example.com, support@example.com
              </p>

              {/* メールアドレス入力エリア */}
              <div className="space-y-2">
                {(settings.recipientEmails || ['admin@example.com']).map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => updateRecipientEmail(index, e.target.value)}
                      placeholder="example@domain.com"
                      className={`flex-1 ${!email.trim() || !isValidEmail(email) ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRecipientEmail(index)}
                      disabled={(settings.recipientEmails || []).length <= 1}
                      className={`text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 ${(settings.recipientEmails || []).length <= 1
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                        }`}
                    >
                      削除
                    </Button>
                  </div>
                ))}

                {/* メールアドレス追加ボタン */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRecipientEmail}
                  disabled={
                    (settings.recipientEmails || []).some(email => !email.trim() || !isValidEmail(email)) ||
                    (settings.recipientEmails || []).length >= 10
                  }
                  className={`w-full border-dashed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 ${(settings.recipientEmails || []).some(email => !email.trim() || !isValidEmail(email)) ||
                    (settings.recipientEmails || []).length >= 10
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                    }`}
                >
                  + メールアドレスを追加
                </Button>
              </div>

              {/* バリデーションエラー表示 */}
              {(!settings.recipientEmails ||
                settings.recipientEmails.length === 0 ||
                settings.recipientEmails.some(email => !email.trim() || !isValidEmail(email))) && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <div className="text-red-600 text-sm">❌</div>
                      <div className="text-xs text-red-800">
                        <p className="font-medium mb-1">必須設定エラー:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• 最低1つ以上のメールアドレスを登録してください</li>
                          <li>• 有効なメールアドレス形式で入力してください</li>
                          <li>• 空のメールアドレスは登録できません</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

              {/* 注意事項 */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="text-blue-600 text-sm">ℹ️</div>
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">設定時の注意事項:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>最低1つ以上のメールアドレス登録が必須です</strong></li>
                      <li>• 最大10個までメールアドレスを登録できます</li>
                      <li>• 有効なメールアドレス形式で入力してください</li>
                      <li>• 複数のメールアドレスには、すべてのアドレスに問合せが送信されます</li>
                      <li>• メールアドレスは「@」を含む完全な形式で入力してください</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 完了ページURL */}
        <div className="rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-700">
              完了ページURL
            </Label>
            <Input
              type="url"
              value={settings.completionUrl}
              onChange={(e) => handleCompletionUrlChange(e.target.value)}
              placeholder="https://example.com/thank-you"
              className="h-10"
            />
            <p className="text-sm text-gray-500">
              フォーム送信完了後にリダイレクトするURLを指定してください。空の場合はアラートで完了を通知します。
            </p>
          </div>
        </div>

        {/* 署名選択 */}
        <div className="rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
          <div className="space-y-3">
            <Label className="text-base font-medium text-gray-700">
              送信控えメールの署名
            </Label>
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
            <p className="text-sm text-gray-500">
              送信控えメールに使用する署名を選択してください。
            </p>
          </div>
        </div>

        {/* 選択された署名のプレビュー */}
        {settings.signatureId && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">署名プレビュー</h4>
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {signatures.find(s => s.id === settings.signatureId)?.content}
            </div>
          </div>
        )}

        {/* 設定の説明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">📧 送信控えメールについて</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 送信控えメールには、フォームの回答内容と選択された署名が含まれます</li>
            <li>• 送信者のメールアドレスが正しく入力されている必要があります</li>
            <li>• 署名は事前に「署名管理」で登録されたものから選択できます</li>
            <li>• 完了ページURLが設定されている場合、送信完了後にそのページにリダイレクトされます</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

