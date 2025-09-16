// フォーム項目の種別
export type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file';

// バリデーション種別
export type ValidationType = 'email' | 'phone' | 'number' | 'text';

// 問合せステータス
export type InquiryStatus = 'unread' | 'read' | 'in-progress' | 'completed';

// フォーム項目のバリデーション設定
export interface FieldValidation {
    type?: ValidationType;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    required?: boolean;
}

// フォーム項目の定義
export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    required: boolean;
    validation?: FieldValidation;
    options?: string[]; // select, radio, checkbox用
    order: number;
    allowOther?: boolean; // 「その他」オプションを追加
    multiple?: boolean; // 複数選択を許可（select用）
}

// フォームのスタイリング設定
export interface FormStyling {
    css: string;
    theme: string;
}

// 添付ファイル設定
export interface FileUploadSettings {
    enabled: boolean;
    maxFiles: number; // 最大5ファイル
    maxFileSize: number; // 1ファイルあたりの最大容量（MB）、最大20MB
    allowedTypes?: string[]; // 許可するファイル形式
}

// フォームの送信設定
export interface FormSettings {
    completionUrl: string;
    signatureId: string;
    autoReply: boolean;
    fileUpload: FileUploadSettings;
    allowMultipleSubmissions?: boolean; // 複数回送信を許可
    showProgress?: boolean; // 進捗表示
    successMessage?: string; // 送信完了メッセージ
    notificationEmail?: string; // 通知先メールアドレス
    showFieldNumbers?: boolean; // 項目番号を表示
    requireAllFields?: boolean; // 全項目を必須にする
    allowedDomains?: string[]; // 問合せ受付許可対象ドメイン
    recipientEmails?: string[]; // 問合せ送信先メールアドレス一覧
}

// フォーム定義
export interface Form {
    id: string;
    name: string;
    description?: string;
    fields: FormField[];
    styling: FormStyling;
    settings: FormSettings;
    createdAt: string;
    updatedAt: string;
}

// 送信者情報
export interface SenderInfo {
    name: string;
    email: string;
    phone?: string;
}

// 返信情報
export interface Reply {
    id: string;
    content: string;
    sentAt: string;
    sentBy: string;
}

// 問合せデータ
export interface Inquiry {
    id: string;
    formId: string;
    responses: Record<string, string | string[]>;
    senderInfo: SenderInfo;
    status: InquiryStatus;
    assignedTo?: string;
    replies: Reply[];
    submittedAt: string;
}

// 署名データ
export interface Signature {
    id: string;
    name: string;
    content: string;
    isDefault: boolean;
    createdAt: string;
}

// システム設定
export interface SystemSettings {
    defaultSignature: string;
    autoReplyEnabled: boolean;
    maxFormsPerUser: number;
}

// API レスポンス型
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// フォーム作成・更新用の型
export interface CreateFormRequest {
    name: string;
    description?: string;
    fields: Omit<FormField, 'id'>[];
    styling: FormStyling;
    settings: FormSettings;
}

export interface UpdateFormRequest extends Partial<CreateFormRequest> {
    id: string;
}

// 問合せ作成用の型
export interface CreateInquiryRequest {
    formId: string;
    responses: Record<string, string | string[]>;
    senderInfo: SenderInfo;
}

// 返信作成用の型
export interface CreateReplyRequest {
    inquiryId: string;
    content: string;
    sentBy: string;
}

// 署名作成・更新用の型
export interface CreateSignatureRequest {
    name: string;
    content: string;
    isDefault?: boolean;
}

export interface UpdateSignatureRequest extends Partial<CreateSignatureRequest> {
    id: string;
}
