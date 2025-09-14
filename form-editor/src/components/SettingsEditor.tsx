'use client';

import { FormSettings, Signature } from '@/shared/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SettingsEditorProps {
  settings: FormSettings;
  signatures: Signature[];
  onSettingsChange: (settings: FormSettings) => void;
}

export default function SettingsEditor({ settings, signatures, onSettingsChange }: SettingsEditorProps) {
  const handleCompletionUrlChange = (completionUrl: string) => {
    onSettingsChange({ ...settings, completionUrl });
  };

  const handleSignatureChange = (signatureId: string) => {
    onSettingsChange({ ...settings, signatureId });
  };

  const handleAutoReplyChange = (autoReply: boolean) => {
    onSettingsChange({ ...settings, autoReply });
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">送信設定</h3>

      <div className="space-y-6">
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

        {/* 選択された署名のプレビュー */}
        {settings.signatureId && (
          <div className="bg-gray-50 border border-gray-200 rounded-none p-4">
            <h4 className="font-medium text-gray-900 mb-2">署名プレビュー</h4>
            <div className="text-base text-gray-700 whitespace-pre-line">
              {signatures.find(s => s.id === settings.signatureId)?.content}
            </div>
          </div>
        )}

        {/* 自動返信設定 */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoReply}
              onChange={(e) => handleAutoReplyChange(e.target.checked)}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-base font-medium text-gray-700">
              送信控えメールを自動送信する
            </span>
          </label>
          <p className="mt-1 text-base text-gray-500">
            チェックを入れると、フォーム送信時に自動で送信控えメールが送信されます。
          </p>
        </div>

        {/* 設定の説明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-none p-4">
          <h4 className="font-medium text-blue-800 mb-2">📧 送信控えメールについて</h4>
          <ul className="text-base text-blue-700 space-y-1">
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
