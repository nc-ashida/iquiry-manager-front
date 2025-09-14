# 状態管理フレームワーク設計

## 概要

form-editorアプリケーションの状態管理フレームワークを設計し、予測可能で保守性の高い状態管理アーキテクチャを構築します。

## 🏗️ 状態管理設計原則

### 1. 単一の真実の源
各状態は一箇所で管理される

### 2. 予測可能性
状態の変更は予測可能で追跡可能

### 3. 型安全性
TypeScriptによる完全な型安全性

### 4. パフォーマンス
不要な再レンダリングを防ぐ

### 5. デバッグ可能性
状態の変更を追跡・デバッグできる

## 📁 状態管理階層設計

```
src/state/
├── store/                       # グローバル状態管理
│   ├── index.ts                 # ストア設定
│   ├── types.ts                 # 状態の型定義
│   ├── slices/                  # 状態スライス
│   │   ├── forms/               # フォーム状態
│   │   │   ├── formsSlice.ts
│   │   │   ├── formsSelectors.ts
│   │   │   └── formsThunks.ts
│   │   ├── ui/                  # UI状態
│   │   │   ├── uiSlice.ts
│   │   │   └── uiSelectors.ts
│   │   ├── auth/                # 認証状態
│   │   │   ├── authSlice.ts
│   │   │   └── authSelectors.ts
│   │   └── ...
│   └── middleware/              # ミドルウェア
│       ├── logger.ts
│       ├── persist.ts
│       └── api.ts
├── hooks/                       # カスタムフック
│   ├── useAppDispatch.ts
│   ├── useAppSelector.ts
│   ├── useForms.ts
│   ├── useUI.ts
│   └── ...
├── services/                    # APIサービス
│   ├── api.ts
│   ├── formsApi.ts
│   ├── authApi.ts
│   └── ...
└── utils/                       # 状態管理ユーティリティ
    ├── storeUtils.ts
    ├── selectors.ts
    └── ...
```

## 🏪 Redux Toolkit ストア設計

### 1. ストア設定

#### 実装
```typescript
// state/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import { formsSlice } from './slices/forms/formsSlice';
import { uiSlice } from './slices/ui/uiSlice';
import { authSlice } from './slices/auth/authSlice';
import { loggerMiddleware } from './middleware/logger';
import { apiMiddleware } from './middleware/api';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui']
};

const rootReducer = combineReducers({
  forms: formsSlice.reducer,
  ui: uiSlice.reducer,
  auth: authSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
    .concat(loggerMiddleware)
    .concat(apiMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 2. 型定義

#### 実装
```typescript
// state/store/types.ts
import { Form, FormField, User, Inquiry } from '@/shared/types';

// フォーム状態
export interface FormsState {
  forms: Form[];
  currentForm: Form | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// UI状態
export interface UIState {
  sidebarOpen: boolean;
  currentView: 'forms' | 'inquiries' | 'settings';
  modals: {
    [key: string]: {
      isOpen: boolean;
      data?: any;
    };
  };
  notifications: Notification[];
  theme: 'light' | 'dark';
}

// 認証状態
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 通知
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  autoClose?: boolean;
}

// API状態
export interface ApiState {
  [endpoint: string]: {
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
  };
}
```

## 🍰 状態スライス設計

### 1. フォーム状態スライス

#### 実装
```typescript
// state/store/slices/forms/formsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Form, FormField } from '@/shared/types';
import { FormsState } from '../../types';

const initialState: FormsState = {
  forms: [],
  currentForm: null,
  loading: false,
  error: null,
  lastUpdated: null
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    // フォーム一覧の設定
    setForms: (state, action: PayloadAction<Form[]>) => {
      state.forms = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    // 現在のフォームの設定
    setCurrentForm: (state, action: PayloadAction<Form | null>) => {
      state.currentForm = action.payload;
    },
    
    // フォームの追加
    addForm: (state, action: PayloadAction<Form>) => {
      state.forms.push(action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    
    // フォームの更新
    updateForm: (state, action: PayloadAction<Form>) => {
      const index = state.forms.findIndex(form => form.id === action.payload.id);
      if (index !== -1) {
        state.forms[index] = action.payload;
        state.lastUpdated = new Date().toISOString();
      }
      
      if (state.currentForm?.id === action.payload.id) {
        state.currentForm = action.payload;
      }
    },
    
    // フォームの削除
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter(form => form.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
      
      if (state.currentForm?.id === action.payload) {
        state.currentForm = null;
      }
    },
    
    // フィールドの追加
    addField: (state, action: PayloadAction<{ formId: string; field: FormField }>) => {
      const { formId, field } = action.payload;
      const form = state.forms.find(f => f.id === formId);
      if (form) {
        form.fields.push(field);
        form.updatedAt = new Date().toISOString();
        state.lastUpdated = new Date().toISOString();
      }
      
      if (state.currentForm?.id === formId) {
        state.currentForm.fields.push(field);
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    
    // フィールドの更新
    updateField: (state, action: PayloadAction<{ formId: string; fieldId: string; updates: Partial<FormField> }>) => {
      const { formId, fieldId, updates } = action.payload;
      const form = state.forms.find(f => f.id === formId);
      if (form) {
        const fieldIndex = form.fields.findIndex(f => f.id === fieldId);
        if (fieldIndex !== -1) {
          form.fields[fieldIndex] = { ...form.fields[fieldIndex], ...updates };
          form.updatedAt = new Date().toISOString();
          state.lastUpdated = new Date().toISOString();
        }
      }
      
      if (state.currentForm?.id === formId) {
        const fieldIndex = state.currentForm.fields.findIndex(f => f.id === fieldId);
        if (fieldIndex !== -1) {
          state.currentForm.fields[fieldIndex] = { ...state.currentForm.fields[fieldIndex], ...updates };
          state.currentForm.updatedAt = new Date().toISOString();
        }
      }
    },
    
    // フィールドの削除
    deleteField: (state, action: PayloadAction<{ formId: string; fieldId: string }>) => {
      const { formId, fieldId } = action.payload;
      const form = state.forms.find(f => f.id === formId);
      if (form) {
        form.fields = form.fields.filter(f => f.id !== fieldId);
        form.updatedAt = new Date().toISOString();
        state.lastUpdated = new Date().toISOString();
      }
      
      if (state.currentForm?.id === formId) {
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== fieldId);
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },
    
    // ローディング状態の設定
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // エラー状態の設定
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // 状態のリセット
    resetFormsState: () => initialState
  }
});

export const {
  setForms,
  setCurrentForm,
  addForm,
  updateForm,
  deleteForm,
  addField,
  updateField,
  deleteField,
  setLoading,
  setError,
  resetFormsState
} = formsSlice.actions;

export default formsSlice.reducer;
```

### 2. UI状態スライス

#### 実装
```typescript
// state/store/slices/ui/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Notification } from '../../types';

const initialState: UIState = {
  sidebarOpen: true,
  currentView: 'forms',
  modals: {},
  notifications: [],
  theme: 'light'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // サイドバーの開閉
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    
    // 現在のビューの設定
    setCurrentView: (state, action: PayloadAction<UIState['currentView']>) => {
      state.currentView = action.payload;
    },
    
    // モーダルの開閉
    openModal: (state, action: PayloadAction<{ key: string; data?: any }>) => {
      const { key, data } = action.payload;
      state.modals[key] = { isOpen: true, data };
    },
    
    closeModal: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (state.modals[key]) {
        state.modals[key].isOpen = false;
        state.modals[key].data = undefined;
      }
    },
    
    // 通知の管理
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now()
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // テーマの設定
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
    },
    
    // 状態のリセット
    resetUIState: () => initialState
  }
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setCurrentView,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
  resetUIState
} = uiSlice.actions;

export default uiSlice.reducer;
```

### 3. 認証状態スライス

#### 実装
```typescript
// state/store/slices/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/shared/types';
import { AuthState } from '../../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ログイン
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    
    // ログアウト
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    
    // ユーザー情報の更新
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    // エラーのクリア
    clearError: (state) => {
      state.error = null;
    },
    
    // 状態のリセット
    resetAuthState: () => initialState
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
  resetAuthState
} = authSlice.actions;

export default authSlice.reducer;
```

## 🎣 カスタムフック設計

### 1. 基本フック

#### 実装
```typescript
// state/hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
```

```typescript
// state/hooks/useAppSelector.ts
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 2. フォーム関連フック

#### 実装
```typescript
// state/hooks/useForms.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import {
  setForms,
  setCurrentForm,
  addForm,
  updateForm,
  deleteForm,
  addField,
  updateField,
  deleteField,
  setLoading,
  setError
} from '../store/slices/forms/formsSlice';
import { Form, FormField } from '@/shared/types';

export function useForms() {
  const dispatch = useAppDispatch();
  const { forms, currentForm, loading, error } = useAppSelector(state => state.forms);

  const loadForms = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      // API呼び出し
      const response = await fetch('/api/forms');
      if (!response.ok) throw new Error('Failed to load forms');
      
      const formsData = await response.json();
      dispatch(setForms(formsData));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createForm = useCallback(async (form: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) throw new Error('Failed to create form');
      
      const newForm = await response.json();
      dispatch(addForm(newForm));
      return newForm;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Unknown error'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const saveForm = useCallback(async (form: Form) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const response = await fetch(`/api/forms/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) throw new Error('Failed to save form');
      
      const updatedForm = await response.json();
      dispatch(updateForm(updatedForm));
      return updatedForm;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Unknown error'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const removeForm = useCallback(async (formId: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete form');
      
      dispatch(deleteForm(formId));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Unknown error'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const selectForm = useCallback((form: Form | null) => {
    dispatch(setCurrentForm(form));
  }, [dispatch]);

  const addFormField = useCallback((formId: string, field: Omit<FormField, 'id'>) => {
    const newField: FormField = {
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    dispatch(addField({ formId, field: newField }));
  }, [dispatch]);

  const updateFormField = useCallback((formId: string, fieldId: string, updates: Partial<FormField>) => {
    dispatch(updateField({ formId, fieldId, updates }));
  }, [dispatch]);

  const removeFormField = useCallback((formId: string, fieldId: string) => {
    dispatch(deleteField({ formId, fieldId }));
  }, [dispatch]);

  return {
    // 状態
    forms,
    currentForm,
    loading,
    error,
    
    // アクション
    loadForms,
    createForm,
    saveForm,
    removeForm,
    selectForm,
    addFormField,
    updateFormField,
    removeFormField
  };
}
```

### 3. UI関連フック

#### 実装
```typescript
// state/hooks/useUI.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import {
  toggleSidebar,
  setSidebarOpen,
  setCurrentView,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme
} from '../store/slices/ui/uiSlice';
import { Notification } from '../store/types';

export function useUI() {
  const dispatch = useAppDispatch();
  const { sidebarOpen, currentView, modals, notifications, theme } = useAppSelector(state => state.ui);

  const toggleSidebarState = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const setSidebarState = useCallback((open: boolean) => {
    dispatch(setSidebarOpen(open));
  }, [dispatch]);

  const switchView = useCallback((view: 'forms' | 'inquiries' | 'settings') => {
    dispatch(setCurrentView(view));
  }, [dispatch]);

  const openModalState = useCallback((key: string, data?: any) => {
    dispatch(openModal({ key, data }));
  }, [dispatch]);

  const closeModalState = useCallback((key: string) => {
    dispatch(closeModal(key));
  }, [dispatch]);

  const showNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    dispatch(addNotification(notification));
  }, [dispatch]);

  const hideNotification = useCallback((id: string) => {
    dispatch(removeNotification(id));
  }, [dispatch]);

  const clearAllNotifications = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  const changeTheme = useCallback((newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme));
  }, [dispatch]);

  return {
    // 状態
    sidebarOpen,
    currentView,
    modals,
    notifications,
    theme,
    
    // アクション
    toggleSidebar: toggleSidebarState,
    setSidebarOpen: setSidebarState,
    switchView,
    openModal: openModalState,
    closeModal: closeModalState,
    showNotification,
    hideNotification,
    clearAllNotifications,
    changeTheme
  };
}
```

## 🔄 非同期処理設計

### 1. Redux Thunk

#### 実装
```typescript
// state/store/slices/forms/formsThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Form } from '@/shared/types';
import { RootState } from '../../index';

// フォーム一覧の取得
export const fetchForms = createAsyncThunk(
  'forms/fetchForms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/forms');
      if (!response.ok) {
        throw new Error('Failed to fetch forms');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// フォームの作成
export const createForm = createAsyncThunk(
  'forms/createForm',
  async (formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create form');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// フォームの更新
export const updateForm = createAsyncThunk(
  'forms/updateForm',
  async (form: Form, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update form');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// フォームの削除
export const deleteForm = createAsyncThunk(
  'forms/deleteForm',
  async (formId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete form');
      }
      
      return formId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);
```

### 2. ミドルウェア

#### 実装
```typescript
// state/store/middleware/logger.ts
import { Middleware } from '@reduxjs/toolkit';

export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`Redux Action: ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
    const result = next(action);
    console.log('Next State:', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};
```

```typescript
// state/store/middleware/api.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const apiMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  // API関連のアクションを処理
  if (action.type.startsWith('api/')) {
    // API呼び出しの前処理
    console.log('API call:', action.type);
  }
  
  return next(action);
};
```

## 📊 状態管理設計メトリクス

### 現在の状況
- **状態の分散度**: 高（各コンポーネントで独立管理）
- **型安全性**: 60%
- **予測可能性**: 低
- **デバッグ可能性**: 低

### 目標
- **状態の分散度**: 低（中央集権的管理）
- **型安全性**: 95%以上
- **予測可能性**: 高
- **デバッグ可能性**: 高

## 🧪 テスト戦略

### 1. スライステスト
```typescript
// state/store/slices/forms/formsSlice.test.ts
import formsReducer, { setForms, addForm, updateForm } from './formsSlice';
import { FormsState } from '../../types';

describe('formsSlice', () => {
  const initialState: FormsState = {
    forms: [],
    currentForm: null,
    loading: false,
    error: null,
    lastUpdated: null
  };

  it('should handle setForms', () => {
    const forms = [{ id: '1', name: 'Test Form', fields: [] }];
    const actual = formsReducer(initialState, setForms(forms));
    expect(actual.forms).toEqual(forms);
  });

  it('should handle addForm', () => {
    const newForm = { id: '1', name: 'New Form', fields: [] };
    const actual = formsReducer(initialState, addForm(newForm));
    expect(actual.forms).toHaveLength(1);
    expect(actual.forms[0]).toEqual(newForm);
  });
});
```

### 2. フックテスト
```typescript
// state/hooks/useForms.test.ts
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useForms } from './useForms';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useForms', () => {
  it('should return forms state and actions', () => {
    const { result } = renderHook(() => useForms(), { wrapper });
    
    expect(result.current.forms).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.loadForms).toBe('function');
  });
});
```

## 📚 参考資料

### 設計原則
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux Best Practices](https://redux.js.org/style-guide/style-guide)
- [State Management Patterns](https://kentcdodds.com/blog/application-state-management-with-react)

### 技術ドキュメント
- [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Persist](https://github.com/rt2zz/redux-persist)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)

---

**注意**: 状態管理フレームワークの実装時は、既存の状態を段階的に移行し、各段階でテストを実装してください。
