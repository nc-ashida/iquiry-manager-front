'use client';

import { useState } from 'react';
import { FormStyling } from '@/shared/types';

interface StylingEditorProps {
  styling: FormStyling;
  onStylingChange: (styling: FormStyling) => void;
}

export default function StylingEditor({ styling, onStylingChange }: StylingEditorProps) {
  const [activeTab, setActiveTab] = useState<'css' | 'theme'>('css');

  const themes = [
    {
      id: 'default',
      name: 'デフォルト',
      css: `
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.required {
  color: red;
}
      `
    },
    {
      id: 'modern',
      name: 'モダン',
      css: `
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.field {
  margin-bottom: 24px;
}

.field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background-color: #f9fafb;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

button[type="submit"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s ease;
}

button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.required {
  color: #ef4444;
}
      `
    },
    {
      id: 'minimal',
      name: 'ミニマル',
      css: `
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 8px 0;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  background: transparent;
  transition: border-color 0.2s ease;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  border-bottom-color: #000;
}

button[type="submit"] {
  background-color: #000;
  color: white;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

button[type="submit"]:hover {
  background-color: #333;
}

.required {
  color: #000;
}
      `
    }
  ];

  const handleThemeSelect = (theme: typeof themes[0]) => {
    onStylingChange({
      ...styling,
      theme: theme.id,
      css: theme.css
    });
  };

  const handleCssChange = (css: string) => {
    onStylingChange({
      ...styling,
      css
    });
  };

  return (
    <div className="p-6">
      <div className="flex space-x-3 sm:space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('theme')}
          className={`px-4 py-2 rounded-none font-medium border border-black hover:scale-105 transition-all duration-300 ease-in-out ${activeTab === 'theme'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          🎨 テーマ
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 rounded-none font-medium border border-black hover:scale-105 transition-all duration-300 ease-in-out ${activeTab === 'css'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          💻 CSS編集
        </button>
      </div>

      {activeTab === 'theme' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">テーマ選択</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`border-2 rounded-none p-4 cursor-pointer transition-all ${styling.theme === theme.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => handleThemeSelect(theme)}
              >
                <h4 className="font-medium text-gray-900 mb-2">{theme.name}</h4>
                <div className="text-base text-gray-600 mb-3">
                  プレビュー:
                </div>
                <div
                  className="text-sm bg-white p-2 rounded-none border"
                  style={{
                    maxHeight: '100px',
                    overflow: 'hidden',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {theme.css.substring(0, 200)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'css' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">CSS編集</h3>
            <div className="text-base text-gray-500">
              現在のテーマ: {themes.find(t => t.id === styling.theme)?.name || 'カスタム'}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                CSSコード
              </label>
              <textarea
                value={styling.css}
                onChange={(e) => handleCssChange(e.target.value)}
                className="w-full h-96 px-3 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-base"
                placeholder="CSSコードを入力してください..."
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-none p-4">
              <h4 className="font-medium text-yellow-800 mb-2">💡 CSS編集のヒント</h4>
              <ul className="text-base text-yellow-700 space-y-1">
                <li>• <code>.form-container</code> - フォーム全体のコンテナ</li>
                <li>• <code>.field</code> - 各入力項目のコンテナ</li>
                <li>• <code>.field label</code> - ラベル要素</li>
                <li>• <code>.field input, .field textarea, .field select</code> - 入力要素</li>
                <li>• <code>button[type=&quot;submit&quot;]</code> - 送信ボタン</li>
                <li>• <code>.required</code> - 必須項目のマーク</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
