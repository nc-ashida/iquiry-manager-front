# APIフレームワーク設計

## 概要

form-editorアプリケーションのAPIフレームワークを設計し、型安全で保守性の高いAPI通信アーキテクチャを構築します。

## 🏗️ API設計原則

### 1. 型安全性
TypeScriptによる完全な型安全性

### 2. 一貫性
統一されたAPI設計パターン

### 3. エラーハンドリング
適切なエラー処理とユーザーフィードバック

### 4. キャッシュ戦略
効率的なデータキャッシュ

### 5. セキュリティ
適切な認証と認可

## 📁 API階層設計

```
src/api/
├── client/                      # APIクライアント
│   ├── index.ts                 # クライアント設定
│   ├── types.ts                 # API型定義
│   ├── interceptors.ts          # インターセプター
│   └── utils.ts                 # ユーティリティ
├── endpoints/                   # APIエンドポイント
│   ├── forms/                   # フォーム関連
│   │   ├── formsApi.ts
│   │   ├── formsTypes.ts
│   │   └── formsQueries.ts
│   ├── auth/                    # 認証関連
│   │   ├── authApi.ts
│   │   ├── authTypes.ts
│   │   └── authQueries.ts
│   ├── inquiries/               # 問合せ関連
│   │   ├── inquiriesApi.ts
│   │   ├── inquiriesTypes.ts
│   │   └── inquiriesQueries.ts
│   └── ...
├── hooks/                       # APIフック
│   ├── useForms.ts
│   ├── useAuth.ts
│   ├── useInquiries.ts
│   └── ...
├── mutations/                   # ミューテーション
│   ├── useFormMutations.ts
│   ├── useAuthMutations.ts
│   └── ...
└── utils/                       # APIユーティリティ
    ├── errorHandler.ts
    ├── responseParser.ts
    └── ...
```

## 🌐 APIクライアント設計

### 1. 基本クライアント

#### 実装
```typescript
// api/client/index.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError, ApiResponse } from './types';
import { authInterceptor } from './interceptors';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || '/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // リクエストインターセプター
    this.client.interceptors.request.use(
      authInterceptor.onRequest,
      authInterceptor.onRequestError
    );

    // レスポンスインターセプター
    this.client.interceptors.response.use(
      this.onResponse,
      this.onResponseError
    );
  }

  private onResponse = (response: AxiosResponse) => {
    return response;
  };

  private onResponseError = (error: any): Promise<never> => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Unknown error',
      status: error.response?.status || 500,
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      details: error.response?.data?.details || null,
    };

    return Promise.reject(apiError);
  };

  // GET リクエスト
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  // POST リクエスト
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // PUT リクエスト
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // PATCH リクエスト
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // DELETE リクエスト
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // ファイルアップロード
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
```

### 2. 型定義

#### 実装
```typescript
// api/client/types.ts
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ApiError {
  message: string;
  status: number;
  code: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
```

### 3. インターセプター

#### 実装
```typescript
// api/client/interceptors.ts
import { AxiosRequestConfig, AxiosError } from 'axios';
import { store } from '@/state/store';
import { logout } from '@/state/store/slices/auth/authSlice';

export const authInterceptor = {
  onRequest: (config: AxiosRequestConfig): AxiosRequestConfig => {
    const state = store.getState();
    const token = state.auth.user?.token;

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },

  onRequestError: (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  },

  onResponse: (response: any) => {
    return response;
  },

  onResponseError: (error: AxiosError): Promise<AxiosError> => {
    if (error.response?.status === 401) {
      // 認証エラーの場合、ログアウト
      store.dispatch(logout());
    }

    return Promise.reject(error);
  },
};
```

## 🎯 エンドポイント設計

### 1. フォームAPI

#### 実装
```typescript
// api/endpoints/forms/formsTypes.ts
import { Form, FormField } from '@/shared/types';

export interface CreateFormRequest {
  name: string;
  description?: string;
  fields: Omit<FormField, 'id'>[];
  settings?: Form['settings'];
}

export interface UpdateFormRequest {
  name?: string;
  description?: string;
  fields?: FormField[];
  settings?: Form['settings'];
}

export interface FormListResponse {
  forms: Form[];
  total: number;
}

export interface FormResponse {
  form: Form;
}

export interface FormFieldRequest {
  type: FormField['type'];
  label: string;
  required?: boolean;
  options?: string[];
  validation?: FormField['validation'];
  order?: number;
}

export interface FormFieldResponse {
  field: FormField;
}
```

```typescript
// api/endpoints/forms/formsApi.ts
import { apiClient } from '../../client';
import {
  CreateFormRequest,
  UpdateFormRequest,
  FormListResponse,
  FormResponse,
  FormFieldRequest,
  FormFieldResponse,
} from './formsTypes';
import { Form, FormField } from '@/shared/types';

export const formsApi = {
  // フォーム一覧の取得
  getForms: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<FormListResponse> => {
    const response = await apiClient.get<FormListResponse>('/forms', { params });
    return response.data;
  },

  // フォームの詳細取得
  getForm: async (id: string): Promise<FormResponse> => {
    const response = await apiClient.get<FormResponse>(`/forms/${id}`);
    return response.data;
  },

  // フォームの作成
  createForm: async (data: CreateFormRequest): Promise<FormResponse> => {
    const response = await apiClient.post<FormResponse>('/forms', data);
    return response.data;
  },

  // フォームの更新
  updateForm: async (id: string, data: UpdateFormRequest): Promise<FormResponse> => {
    const response = await apiClient.put<FormResponse>(`/forms/${id}`, data);
    return response.data;
  },

  // フォームの削除
  deleteForm: async (id: string): Promise<void> => {
    await apiClient.delete(`/forms/${id}`);
  },

  // フォームの複製
  duplicateForm: async (id: string, name?: string): Promise<FormResponse> => {
    const response = await apiClient.post<FormResponse>(`/forms/${id}/duplicate`, { name });
    return response.data;
  },

  // フォームの公開
  publishForm: async (id: string): Promise<FormResponse> => {
    const response = await apiClient.post<FormResponse>(`/forms/${id}/publish`);
    return response.data;
  },

  // フォームの非公開
  unpublishForm: async (id: string): Promise<FormResponse> => {
    const response = await apiClient.post<FormResponse>(`/forms/${id}/unpublish`);
    return response.data;
  },

  // フィールドの追加
  addField: async (formId: string, data: FormFieldRequest): Promise<FormFieldResponse> => {
    const response = await apiClient.post<FormFieldResponse>(`/forms/${formId}/fields`, data);
    return response.data;
  },

  // フィールドの更新
  updateField: async (formId: string, fieldId: string, data: Partial<FormFieldRequest>): Promise<FormFieldResponse> => {
    const response = await apiClient.put<FormFieldResponse>(`/forms/${formId}/fields/${fieldId}`, data);
    return response.data;
  },

  // フィールドの削除
  deleteField: async (formId: string, fieldId: string): Promise<void> => {
    await apiClient.delete(`/forms/${formId}/fields/${fieldId}`);
  },

  // フィールドの並び替え
  reorderFields: async (formId: string, fieldIds: string[]): Promise<void> => {
    await apiClient.patch(`/forms/${formId}/fields/reorder`, { fieldIds });
  },

  // フォームの検索
  searchForms: async (query: string): Promise<FormListResponse> => {
    const response = await apiClient.get<FormListResponse>('/forms/search', { params: { q: query } });
    return response.data;
  },

  // フォームの統計情報
  getFormStats: async (id: string): Promise<{
    totalSubmissions: number;
    lastSubmission: string | null;
    conversionRate: number;
  }> => {
    const response = await apiClient.get(`/forms/${id}/stats`);
    return response.data;
  },
};
```

### 2. 認証API

#### 実装
```typescript
// api/endpoints/auth/authTypes.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
```

```typescript
// api/endpoints/auth/authApi.ts
import { apiClient } from '../../client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from './authTypes';

export const authApi = {
  // ログイン
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  // ログアウト
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // ユーザー登録
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  // トークンリフレッシュ
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
    return response.data;
  },

  // パスワードリセット要求
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post('/auth/forgot-password', data);
  },

  // パスワードリセット
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post('/auth/reset-password', data);
  },

  // 現在のユーザー情報取得
  getCurrentUser: async (): Promise<{ user: LoginResponse['user'] }> => {
    const response = await apiClient.get<{ user: LoginResponse['user'] }>('/auth/me');
    return response.data;
  },

  // ユーザー情報更新
  updateProfile: async (data: Partial<LoginResponse['user']>): Promise<{ user: LoginResponse['user'] }> => {
    const response = await apiClient.put<{ user: LoginResponse['user'] }>('/auth/profile', data);
    return response.data;
  },

  // パスワード変更
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> => {
    await apiClient.put('/auth/change-password', data);
  },
};
```

### 3. 問合せAPI

#### 実装
```typescript
// api/endpoints/inquiries/inquiriesTypes.ts
import { Inquiry } from '@/shared/types';

export interface CreateInquiryRequest {
  formId: string;
  data: Record<string, any>;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  };
}

export interface InquiryListResponse {
  inquiries: Inquiry[];
  total: number;
}

export interface InquiryResponse {
  inquiry: Inquiry;
}

export interface InquirySearchParams {
  formId?: string;
  status?: Inquiry['status'];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

```typescript
// api/endpoints/inquiries/inquiriesApi.ts
import { apiClient } from '../../client';
import {
  CreateInquiryRequest,
  InquiryListResponse,
  InquiryResponse,
  InquirySearchParams,
} from './inquiriesTypes';
import { Inquiry } from '@/shared/types';

export const inquiriesApi = {
  // 問合せ一覧の取得
  getInquiries: async (params?: InquirySearchParams): Promise<InquiryListResponse> => {
    const response = await apiClient.get<InquiryListResponse>('/inquiries', { params });
    return response.data;
  },

  // 問合せの詳細取得
  getInquiry: async (id: string): Promise<InquiryResponse> => {
    const response = await apiClient.get<InquiryResponse>(`/inquiries/${id}`);
    return response.data;
  },

  // 問合せの作成
  createInquiry: async (data: CreateInquiryRequest): Promise<InquiryResponse> => {
    const response = await apiClient.post<InquiryResponse>('/inquiries', data);
    return response.data;
  },

  // 問合せの更新
  updateInquiry: async (id: string, data: Partial<Inquiry>): Promise<InquiryResponse> => {
    const response = await apiClient.put<InquiryResponse>(`/inquiries/${id}`, data);
    return response.data;
  },

  // 問合せの削除
  deleteInquiry: async (id: string): Promise<void> => {
    await apiClient.delete(`/inquiries/${id}`);
  },

  // 問合せのステータス更新
  updateInquiryStatus: async (id: string, status: Inquiry['status']): Promise<InquiryResponse> => {
    const response = await apiClient.patch<InquiryResponse>(`/inquiries/${id}/status`, { status });
    return response.data;
  },

  // 問合せの検索
  searchInquiries: async (query: string): Promise<InquiryListResponse> => {
    const response = await apiClient.get<InquiryListResponse>('/inquiries/search', { params: { q: query } });
    return response.data;
  },

  // 問合せの統計情報
  getInquiryStats: async (params?: {
    formId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    total: number;
    byStatus: Record<Inquiry['status'], number>;
    byForm: Array<{ formId: string; formName: string; count: number }>;
    byDate: Array<{ date: string; count: number }>;
  }> => {
    const response = await apiClient.get('/inquiries/stats', { params });
    return response.data;
  },

  // 問合せのエクスポート
  exportInquiries: async (params?: InquirySearchParams): Promise<Blob> => {
    const response = await apiClient.get('/inquiries/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
```

## 🎣 APIフック設計

### 1. React Query統合

#### 実装
```typescript
// api/hooks/useForms.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formsApi } from '../endpoints/forms/formsApi';
import { Form } from '@/shared/types';

export function useForms(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['forms', params],
    queryFn: () => formsApi.getForms(params),
    staleTime: 5 * 60 * 1000, // 5分
    cacheTime: 10 * 60 * 1000, // 10分
  });
}

export function useForm(id: string) {
  return useQuery({
    queryKey: ['form', id],
    queryFn: () => formsApi.getForm(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formsApi.createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
}

export function useUpdateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => formsApi.updateForm(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['form', id] });
    },
  });
}

export function useDeleteForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: formsApi.deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
}
```

### 2. 認証フック

#### 実装
```typescript
// api/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../endpoints/auth/authApi';
import { useAppDispatch } from '@/state/hooks/useAppDispatch';
import { loginSuccess, logout } from '@/state/store/slices/auth/authSlice';

export function useLogin() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(loginSuccess(data.user));
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      dispatch(logout());
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authApi.getCurrentUser,
    staleTime: 10 * 60 * 1000, // 10分
  });
}

export function useRegister() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      dispatch(loginSuccess(data.user));
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
  });
}
```

## 🔄 エラーハンドリング

### 1. エラーハンドラー

#### 実装
```typescript
// api/utils/errorHandler.ts
import { ApiError } from '../client/types';
import { showNotification } from '@/state/store/slices/ui/uiSlice';
import { store } from '@/state/store';

export class ApiErrorHandler {
  static handle(error: ApiError): void {
    console.error('API Error:', error);

    // エラータイプに応じた処理
    switch (error.status) {
      case 400:
        this.handleBadRequest(error);
        break;
      case 401:
        this.handleUnauthorized(error);
        break;
      case 403:
        this.handleForbidden(error);
        break;
      case 404:
        this.handleNotFound(error);
        break;
      case 422:
        this.handleValidationError(error);
        break;
      case 500:
        this.handleServerError(error);
        break;
      default:
        this.handleGenericError(error);
    }
  }

  private static handleBadRequest(error: ApiError): void {
    store.dispatch(showNotification({
      type: 'error',
      title: 'リクエストエラー',
      message: error.message,
    }));
  }

  private static handleUnauthorized(error: ApiError): void {
    store.dispatch(showNotification({
      type: 'error',
      title: '認証エラー',
      message: 'ログインが必要です',
    }));
  }

  private static handleForbidden(error: ApiError): void {
    store.dispatch(showNotification({
      type: 'error',
      title: 'アクセス拒否',
      message: 'この操作を実行する権限がありません',
    }));
  }

  private static handleNotFound(error: ApiError): void {
    store.dispatch(showNotification({
      type: 'error',
      title: '見つかりません',
      message: '要求されたリソースが見つかりません',
    }));
  }

  private static handleValidationError(error: ApiError): void {
    store.dispatch(showNotification({
      type: 'error',
      title: 'バリデーションエラー',
      message: error.message,
    }));
  }

  private static handleServerError(error: ApiError): void {
    store.dispatch(showNotification({
      type: 'error',
      title: 'サーバーエラー',
      message: 'サーバーでエラーが発生しました。しばらくしてから再試行してください。',
    }));
  }

  private static handleGenericError(error: ApiError): void {
    store.dispatch(showNotification({
      type: 'error',
      title: 'エラー',
      message: error.message,
    }));
  }
}
```

## 📊 API設計メトリクス

### 現在の状況
- **型安全性**: 40%
- **エラーハンドリング**: 30%
- **キャッシュ戦略**: なし
- **一貫性**: 低

### 目標
- **型安全性**: 95%以上
- **エラーハンドリング**: 90%以上
- **キャッシュ戦略**: 実装済み
- **一貫性**: 高

## 🧪 テスト戦略

### 1. APIテスト
```typescript
// api/endpoints/forms/formsApi.test.ts
import { formsApi } from './formsApi';
import { apiClient } from '../../client';

jest.mock('../../client');

describe('formsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch forms', async () => {
    const mockResponse = { data: { forms: [], total: 0 } };
    (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await formsApi.getForms();
    expect(result).toEqual(mockResponse.data);
    expect(apiClient.get).toHaveBeenCalledWith('/forms', { params: undefined });
  });

  it('should create form', async () => {
    const formData = { name: 'Test Form', fields: [] };
    const mockResponse = { data: { form: { id: '1', ...formData } } };
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await formsApi.createForm(formData);
    expect(result).toEqual(mockResponse.data);
    expect(apiClient.post).toHaveBeenCalledWith('/forms', formData);
  });
});
```

### 2. フックテスト
```typescript
// api/hooks/useForms.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useForms } from './useForms';

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
  it('should fetch forms', async () => {
    const { result } = renderHook(() => useForms(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
```

## 📚 参考資料

### 設計原則
- [RESTful API Design](https://restfulapi.net/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [API Design Guidelines](https://github.com/microsoft/api-guidelines)

### 技術ドキュメント
- [Axios](https://axios-http.com/docs/intro)
- [React Query](https://tanstack.com/query/latest)
- [TypeScript API Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)

---

**注意**: APIフレームワークの実装時は、既存のAPI呼び出しを段階的に移行し、各段階でテストを実装してください。
