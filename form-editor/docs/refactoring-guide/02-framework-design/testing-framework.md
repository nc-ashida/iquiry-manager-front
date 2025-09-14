# テストフレームワーク設計

## 概要

form-editorアプリケーションのテストフレームワークを設計し、信頼性が高く保守性の高いテストアーキテクチャを構築します。

## 🏗️ テスト設計原則

### 1. テストピラミッド
- 単体テスト（70%）
- 統合テスト（20%）
- E2Eテスト（10%）

### 2. テストの独立性
各テストは独立して実行可能

### 3. 再現可能性
同じ結果が常に得られる

### 4. 高速実行
開発サイクルを阻害しない

### 5. 保守性
テストコードの保守が容易

## 📁 テスト階層設計

```
src/
├── __tests__/                   # テストファイル
│   ├── components/              # コンポーネントテスト
│   │   ├── ui/                  # UIコンポーネント
│   │   │   ├── Button.test.tsx
│   │   │   ├── Input.test.tsx
│   │   │   └── Modal.test.tsx
│   │   ├── forms/               # フォームコンポーネント
│   │   │   ├── FormEditor.test.tsx
│   │   │   ├── FieldEditor.test.tsx
│   │   │   └── FormPreview.test.tsx
│   │   └── ...
│   ├── hooks/                   # フックテスト
│   │   ├── useForms.test.ts
│   │   ├── useUI.test.ts
│   │   └── ...
│   ├── utils/                   # ユーティリティテスト
│   │   ├── dataManager.test.ts
│   │   ├── validation.test.ts
│   │   └── ...
│   ├── api/                     # APIテスト
│   │   ├── formsApi.test.ts
│   │   ├── authApi.test.ts
│   │   └── ...
│   └── integration/             # 統合テスト
│       ├── form-creation.test.ts
│       ├── form-submission.test.ts
│       └── ...
├── __mocks__/                   # モックファイル
│   ├── api/                     # APIモック
│   │   ├── formsApi.ts
│   │   └── authApi.ts
│   ├── components/              # コンポーネントモック
│   │   └── ...
│   └── ...
├── test-utils/                  # テストユーティリティ
│   ├── render.tsx               # カスタムレンダラー
│   ├── mocks.ts                 # モックデータ
│   ├── fixtures.ts              # テストフィクスチャ
│   └── ...
└── e2e/                         # E2Eテスト
    ├── specs/                   # テスト仕様
    │   ├── form-creation.spec.ts
    │   ├── form-submission.spec.ts
    │   └── ...
    ├── fixtures/                # E2Eテストデータ
    └── ...
```

## 🧪 単体テスト設計

### 1. コンポーネントテスト

#### 実装
```typescript
// __tests__/components/ui/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Click me');
  });

  it('applies correct variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white', 'text-gray-900', 'border', 'border-gray-300');
  });

  it('applies correct size styles', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-12', 'px-6', 'text-base');
  });

  it('renders with left icon', () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>;
    render(<Button leftIcon={<LeftIcon />}>With Icon</Button>);
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('With Icon');
  });

  it('renders with right icon', () => {
    const RightIcon = () => <span data-testid="right-icon">→</span>;
    render(<Button rightIcon={<RightIcon />}>With Icon</Button>);
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('With Icon');
  });

  it('applies full width when specified', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent('Ref Button');
  });
});
```

### 2. フックテスト

#### 実装
```typescript
// __tests__/hooks/useForms.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForms } from '@/api/hooks/useForms';
import { formsApi } from '@/api/endpoints/forms/formsApi';

// モック
jest.mock('@/api/endpoints/forms/formsApi');
const mockFormsApi = formsApi as jest.Mocked<typeof formsApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useForms', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch forms successfully', async () => {
    const mockForms = [
      { id: '1', name: 'Test Form 1', fields: [] },
      { id: '2', name: 'Test Form 2', fields: [] },
    ];
    
    mockFormsApi.getForms.mockResolvedValue({
      forms: mockForms,
      total: 2,
    });

    const { result } = renderHook(() => useForms(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.forms).toEqual(mockForms);
    expect(result.current.data?.total).toBe(2);
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch forms';
    mockFormsApi.getForms.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useForms(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  it('should create form successfully', async () => {
    const newForm = { name: 'New Form', fields: [] };
    const createdForm = { id: '3', ...newForm, createdAt: '2023-01-01', updatedAt: '2023-01-01' };
    
    mockFormsApi.createForm.mockResolvedValue({ form: createdForm });

    const { result } = renderHook(() => useForms(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.createForm.mutateAsync(newForm);
    });

    expect(mockFormsApi.createForm).toHaveBeenCalledWith(newForm);
    expect(result.current.createForm.isSuccess).toBe(true);
  });
});
```

### 3. ユーティリティテスト

#### 実装
```typescript
// __tests__/utils/dataManager.test.ts
import { dataManager } from '@/shared/utils/dataManager';

describe('dataManager', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = dataManager.generateId();
      const id2 = dataManager.generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });

    it('should generate IDs with correct format', () => {
      const id = dataManager.generateId();
      expect(id).toMatch(/^[a-zA-Z0-9-_]+$/);
    });
  });

  describe('validateForm', () => {
    it('should validate valid form', () => {
      const validForm = {
        id: '1',
        name: 'Test Form',
        fields: [
          { id: 'f1', type: 'text', label: 'Name', required: true }
        ],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      };

      const result = dataManager.validateForm(validForm);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid form', () => {
      const invalidForm = {
        id: '1',
        name: '', // 空の名前
        fields: [], // 空のフィールド
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      };

      const result = dataManager.validateForm(invalidForm);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Form name is required');
      expect(result.errors).toContain('Form must have at least one field');
    });
  });

  describe('sortForms', () => {
    it('should sort forms by name', () => {
      const forms = [
        { id: '1', name: 'Z Form', fields: [], createdAt: '2023-01-01', updatedAt: '2023-01-01' },
        { id: '2', name: 'A Form', fields: [], createdAt: '2023-01-01', updatedAt: '2023-01-01' },
        { id: '3', name: 'M Form', fields: [], createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      ];

      const sorted = dataManager.sortForms(forms, 'name', 'asc');
      expect(sorted[0].name).toBe('A Form');
      expect(sorted[1].name).toBe('M Form');
      expect(sorted[2].name).toBe('Z Form');
    });

    it('should sort forms by date', () => {
      const forms = [
        { id: '1', name: 'Form 1', fields: [], createdAt: '2023-01-03', updatedAt: '2023-01-03' },
        { id: '2', name: 'Form 2', fields: [], createdAt: '2023-01-01', updatedAt: '2023-01-01' },
        { id: '3', name: 'Form 3', fields: [], createdAt: '2023-01-02', updatedAt: '2023-01-02' },
      ];

      const sorted = dataManager.sortForms(forms, 'createdAt', 'desc');
      expect(sorted[0].createdAt).toBe('2023-01-03');
      expect(sorted[1].createdAt).toBe('2023-01-02');
      expect(sorted[2].createdAt).toBe('2023-01-01');
    });
  });
});
```

## 🔗 統合テスト設計

### 1. フォーム作成フロー

#### 実装
```typescript
// __tests__/integration/form-creation.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import { FormEditor } from '@/components/forms/FormEditor';
import { formsApi } from '@/api/endpoints/forms/formsApi';

// モック
jest.mock('@/api/endpoints/forms/formsApi');
const mockFormsApi = formsApi as jest.Mocked<typeof formsApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
};

describe('Form Creation Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new form with fields', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    const onCancel = jest.fn();

    mockFormsApi.createForm.mockResolvedValue({
      form: {
        id: '1',
        name: 'Test Form',
        fields: [],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      }
    });

    render(
      <FormEditor form={null} onSave={onSave} onCancel={onCancel} mode="create" />,
      { wrapper: createWrapper() }
    );

    // フォーム名を入力
    const nameInput = screen.getByLabelText(/フォーム名/i);
    await user.type(nameInput, 'Test Form');

    // フィールドを追加
    const addFieldButton = screen.getByText(/フィールドを追加/i);
    await user.click(addFieldButton);

    // フィールドタイプを選択
    const fieldTypeSelect = screen.getByLabelText(/フィールドタイプ/i);
    await user.selectOptions(fieldTypeSelect, 'text');

    // フィールドラベルを入力
    const fieldLabelInput = screen.getByLabelText(/ラベル/i);
    await user.type(fieldLabelInput, 'Name');

    // 保存ボタンをクリック
    const saveButton = screen.getByText(/保存/i);
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockFormsApi.createForm).toHaveBeenCalledWith({
        name: 'Test Form',
        fields: expect.arrayContaining([
          expect.objectContaining({
            type: 'text',
            label: 'Name'
          })
        ])
      });
    });

    expect(onSave).toHaveBeenCalled();
  });

  it('should validate form before saving', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    const onCancel = jest.fn();

    render(
      <FormEditor form={null} onSave={onSave} onCancel={onCancel} mode="create" />,
      { wrapper: createWrapper() }
    );

    // フォーム名を入力せずに保存を試行
    const saveButton = screen.getByText(/保存/i);
    await user.click(saveButton);

    // バリデーションエラーが表示される
    expect(screen.getByText(/フォーム名は必須です/i)).toBeInTheDocument();
    expect(mockFormsApi.createForm).not.toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('should handle save error', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    const onCancel = jest.fn();

    mockFormsApi.createForm.mockRejectedValue(new Error('Save failed'));

    render(
      <FormEditor form={null} onSave={onSave} onCancel={onCancel} mode="create" />,
      { wrapper: createWrapper() }
    );

    // フォーム名を入力
    const nameInput = screen.getByLabelText(/フォーム名/i);
    await user.type(nameInput, 'Test Form');

    // フィールドを追加
    const addFieldButton = screen.getByText(/フィールドを追加/i);
    await user.click(addFieldButton);

    const fieldTypeSelect = screen.getByLabelText(/フィールドタイプ/i);
    await user.selectOptions(fieldTypeSelect, 'text');

    const fieldLabelInput = screen.getByLabelText(/ラベル/i);
    await user.type(fieldLabelInput, 'Name');

    // 保存ボタンをクリック
    const saveButton = screen.getByText(/保存/i);
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/保存に失敗しました/i)).toBeInTheDocument();
    });

    expect(onSave).not.toHaveBeenCalled();
  });
});
```

### 2. フォーム送信フロー

#### 実装
```typescript
// __tests__/integration/form-submission.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import { FormPreview } from '@/components/forms/FormPreview';
import { inquiriesApi } from '@/api/endpoints/inquiries/inquiriesApi';

// モック
jest.mock('@/api/endpoints/inquiries/inquiriesApi');
const mockInquiriesApi = inquiriesApi as jest.Mocked<typeof inquiriesApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
};

describe('Form Submission Flow', () => {
  const mockForm = {
    id: '1',
    name: 'Test Form',
    fields: [
      { id: 'f1', type: 'text', label: 'Name', required: true },
      { id: 'f2', type: 'email', label: 'Email', required: true },
      { id: 'f3', type: 'textarea', label: 'Message', required: false },
    ],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();

    mockInquiriesApi.createInquiry.mockResolvedValue({
      inquiry: {
        id: '1',
        formId: '1',
        data: { f1: 'John Doe', f2: 'john@example.com', f3: 'Hello' },
        status: 'pending',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      }
    });

    render(<FormPreview form={mockForm} />, { wrapper: createWrapper() });

    // フォームフィールドに入力
    const nameInput = screen.getByLabelText(/Name/i);
    await user.type(nameInput, 'John Doe');

    const emailInput = screen.getByLabelText(/Email/i);
    await user.type(emailInput, 'john@example.com');

    const messageInput = screen.getByLabelText(/Message/i);
    await user.type(messageInput, 'Hello');

    // 送信ボタンをクリック
    const submitButton = screen.getByText(/送信/i);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockInquiriesApi.createInquiry).toHaveBeenCalledWith({
        formId: '1',
        data: {
          f1: 'John Doe',
          f2: 'john@example.com',
          f3: 'Hello'
        }
      });
    });

    expect(screen.getByText(/送信完了/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();

    render(<FormPreview form={mockForm} />, { wrapper: createWrapper() });

    // 必須フィールドを空のまま送信を試行
    const submitButton = screen.getByText(/送信/i);
    await user.click(submitButton);

    // バリデーションエラーが表示される
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    expect(mockInquiriesApi.createInquiry).not.toHaveBeenCalled();
  });

  it('should handle submission error', async () => {
    const user = userEvent.setup();

    mockInquiriesApi.createInquiry.mockRejectedValue(new Error('Submission failed'));

    render(<FormPreview form={mockForm} />, { wrapper: createWrapper() });

    // フォームフィールドに入力
    const nameInput = screen.getByLabelText(/Name/i);
    await user.type(nameInput, 'John Doe');

    const emailInput = screen.getByLabelText(/Email/i);
    await user.type(emailInput, 'john@example.com');

    // 送信ボタンをクリック
    const submitButton = screen.getByText(/送信/i);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/送信に失敗しました/i)).toBeInTheDocument();
    });
  });
});
```

## 🎭 E2Eテスト設計

### 1. Playwright設定

#### 実装
```typescript
// e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 2. フォーム作成E2Eテスト

#### 実装
```typescript
// e2e/specs/form-creation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Form Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // ログイン処理
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should create a new form', async ({ page }) => {
    // 新規フォーム作成ボタンをクリック
    await page.click('[data-testid="create-form-button"]');
    await page.waitForURL('/forms/new');

    // フォーム名を入力
    await page.fill('[data-testid="form-name-input"]', 'E2E Test Form');

    // フィールドを追加
    await page.click('[data-testid="add-field-button"]');
    
    // フィールドタイプを選択
    await page.selectOption('[data-testid="field-type-select"]', 'text');
    
    // フィールドラベルを入力
    await page.fill('[data-testid="field-label-input"]', 'Name');
    
    // 必須フィールドにチェック
    await page.check('[data-testid="field-required-checkbox"]');

    // もう一つのフィールドを追加
    await page.click('[data-testid="add-field-button"]');
    await page.selectOption('[data-testid="field-type-select"]', 'email');
    await page.fill('[data-testid="field-label-input"]', 'Email');
    await page.check('[data-testid="field-required-checkbox"]');

    // 保存ボタンをクリック
    await page.click('[data-testid="save-form-button"]');

    // 成功メッセージが表示されることを確認
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('フォームが保存されました');

    // フォーム一覧に戻る
    await page.click('[data-testid="back-to-forms-button"]');
    await page.waitForURL('/forms');

    // 作成したフォームが一覧に表示されることを確認
    await expect(page.locator('[data-testid="form-list"]')).toContainText('E2E Test Form');
  });

  test('should validate form before saving', async ({ page }) => {
    await page.click('[data-testid="create-form-button"]');
    await page.waitForURL('/forms/new');

    // フォーム名を入力せずに保存を試行
    await page.click('[data-testid="save-form-button"]');

    // バリデーションエラーが表示されることを確認
    await expect(page.locator('[data-testid="form-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="form-name-error"]')).toContainText('フォーム名は必須です');

    // フィールドが追加されていない場合のエラー
    await expect(page.locator('[data-testid="fields-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="fields-error"]')).toContainText('少なくとも1つのフィールドが必要です');
  });

  test('should preview form', async ({ page }) => {
    await page.click('[data-testid="create-form-button"]');
    await page.waitForURL('/forms/new');

    // フォーム名を入力
    await page.fill('[data-testid="form-name-input"]', 'Preview Test Form');

    // フィールドを追加
    await page.click('[data-testid="add-field-button"]');
    await page.selectOption('[data-testid="field-type-select"]', 'text');
    await page.fill('[data-testid="field-label-input"]', 'Name');

    // プレビュータブをクリック
    await page.click('[data-testid="preview-tab"]');

    // プレビューが表示されることを確認
    await expect(page.locator('[data-testid="form-preview"]')).toBeVisible();
    await expect(page.locator('[data-testid="form-preview"]')).toContainText('Preview Test Form');
    await expect(page.locator('[data-testid="form-preview"]')).toContainText('Name');
  });
});
```

### 3. フォーム送信E2Eテスト

#### 実装
```typescript
// e2e/specs/form-submission.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Form Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // ログイン処理
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should submit form successfully', async ({ page }) => {
    // フォーム一覧からテストフォームを選択
    await page.click('[data-testid="form-item"]:first-child');
    await page.waitForURL('/forms/*/preview');

    // フォームフィールドに入力
    await page.fill('[data-testid="field-name"]', 'John Doe');
    await page.fill('[data-testid="field-email"]', 'john@example.com');
    await page.fill('[data-testid="field-message"]', 'This is a test message');

    // 送信ボタンをクリック
    await page.click('[data-testid="submit-button"]');

    // 成功メッセージが表示されることを確認
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('送信完了');

    // フォームがリセットされることを確認
    await expect(page.locator('[data-testid="field-name"]')).toHaveValue('');
    await expect(page.locator('[data-testid="field-email"]')).toHaveValue('');
    await expect(page.locator('[data-testid="field-message"]')).toHaveValue('');
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('[data-testid="form-item"]:first-child');
    await page.waitForURL('/forms/*/preview');

    // 必須フィールドを空のまま送信を試行
    await page.click('[data-testid="submit-button"]');

    // バリデーションエラーが表示されることを確認
    await expect(page.locator('[data-testid="field-name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="field-name-error"]')).toContainText('必須項目です');

    await expect(page.locator('[data-testid="field-email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="field-email-error"]')).toContainText('必須項目です');
  });

  test('should validate email format', async ({ page }) => {
    await page.click('[data-testid="form-item"]:first-child');
    await page.waitForURL('/forms/*/preview');

    // 無効なメールアドレスを入力
    await page.fill('[data-testid="field-email"]', 'invalid-email');
    await page.click('[data-testid="submit-button"]');

    // メール形式エラーが表示されることを確認
    await expect(page.locator('[data-testid="field-email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="field-email-error"]')).toContainText('有効なメールアドレスを入力してください');
  });
});
```

## 🛠️ テストユーティリティ

### 1. カスタムレンダラー

#### 実装
```typescript
// test-utils/render.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### 2. モックデータ

#### 実装
```typescript
// test-utils/mocks.ts
import { Form, FormField, Inquiry, User } from '@/shared/types';

export const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01'
};

export const mockFormField: FormField = {
  id: 'f1',
  type: 'text',
  label: 'Name',
  required: true,
  order: 0,
  validation: {
    minLength: 1,
    maxLength: 100
  }
};

export const mockForm: Form = {
  id: '1',
  name: 'Test Form',
  description: 'A test form',
  fields: [mockFormField],
  settings: {
    allowMultipleSubmissions: false,
    requireAuthentication: false,
    showProgressBar: true
  },
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01'
};

export const mockInquiry: Inquiry = {
  id: '1',
  formId: '1',
  data: { f1: 'John Doe' },
  status: 'pending',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01'
};

export const mockForms = [mockForm];
export const mockInquiries = [mockInquiry];
```

### 3. テストフィクスチャ

#### 実装
```typescript
// test-utils/fixtures.ts
import { Form, FormField } from '@/shared/types';

export const createMockForm = (overrides: Partial<Form> = {}): Form => ({
  id: '1',
  name: 'Test Form',
  description: 'A test form',
  fields: [],
  settings: {
    allowMultipleSubmissions: false,
    requireAuthentication: false,
    showProgressBar: true
  },
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
  ...overrides
});

export const createMockFormField = (overrides: Partial<FormField> = {}): FormField => ({
  id: 'f1',
  type: 'text',
  label: 'Name',
  required: true,
  order: 0,
  validation: {
    minLength: 1,
    maxLength: 100
  },
  ...overrides
});

export const createMockFormWithFields = (fieldCount: number = 3): Form => {
  const fields: FormField[] = [];
  
  for (let i = 0; i < fieldCount; i++) {
    fields.push(createMockFormField({
      id: `f${i + 1}`,
      label: `Field ${i + 1}`,
      order: i
    }));
  }
  
  return createMockForm({ fields });
};
```

## 📊 テスト設計メトリクス

### 現在の状況
- **テストカバレッジ**: 20%
- **単体テスト**: 10%
- **統合テスト**: 5%
- **E2Eテスト**: 5%

### 目標
- **テストカバレッジ**: 80%以上
- **単体テスト**: 70%
- **統合テスト**: 20%
- **E2Eテスト**: 10%

## 🧪 テスト実行戦略

### 1. 開発時
```bash
# 単体テストのみ実行
npm run test:unit

# ウォッチモード
npm run test:watch

# カバレッジ付き
npm run test:coverage
```

### 2. CI/CD
```bash
# 全テスト実行
npm run test:ci

# E2Eテスト実行
npm run test:e2e

# カバレッジレポート生成
npm run test:coverage:ci
```

### 3. テスト設定

#### 実装
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/src/test-utils/setup.ts"],
    "moduleNameMapping": {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/*.stories.tsx",
      "!src/**/*.test.{ts,tsx}"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 📚 参考資料

### 設計原則
- [Testing Library](https://testing-library.com/docs/guiding-principles)
- [Jest Best Practices](https://jestjs.io/docs/getting-started)
- [Playwright Testing](https://playwright.dev/docs/intro)

### 技術ドキュメント
- [React Testing](https://reactjs.org/docs/testing.html)
- [TypeScript Testing](https://www.typescriptlang.org/docs/handbook/testing.html)
- [E2E Testing Patterns](https://playwright.dev/docs/best-practices)

---

**注意**: テストフレームワークの実装時は、既存の機能を壊さないよう段階的に進め、各段階でテストを実装してください。
