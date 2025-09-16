import { FormField } from '@/shared/types';

export interface ValidationResult {
    isValid: boolean;
    message?: string;
}

export interface ValidationRule {
    validate: (value: string) => ValidationResult;
    message: string;
}

/**
 * フィールドバリデーションのルール定義
 */
export const validationRules = {
    required: {
        validate: (value: string) => ({
            isValid: value.trim().length > 0,
            message: 'この項目は必須です'
        }),
        message: 'この項目は必須です'
    },

    email: {
        validate: (value: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return {
                isValid: emailRegex.test(value),
                message: '正しいメールアドレスを入力してください'
            };
        },
        message: '正しいメールアドレスを入力してください'
    },

    phone: {
        validate: (value: string) => {
            const phoneRegex = /^[0-9-+()\s]+$/;
            return {
                isValid: phoneRegex.test(value),
                message: '正しい電話番号を入力してください'
            };
        },
        message: '正しい電話番号を入力してください'
    },

    number: {
        validate: (value: string) => {
            const numberRegex = /^\d+$/;
            return {
                isValid: numberRegex.test(value),
                message: '数字を入力してください'
            };
        },
        message: '数字を入力してください'
    },

    minLength: (min: number) => ({
        validate: (value: string) => ({
            isValid: value.length >= min,
            message: `最低${min}文字以上入力してください`
        }),
        message: `最低${min}文字以上入力してください`
    }),

    maxLength: (max: number) => ({
        validate: (value: string) => ({
            isValid: value.length <= max,
            message: `最大${max}文字まで入力してください`
        }),
        message: `最大${max}文字まで入力してください`
    }),

    pattern: (pattern: RegExp, message: string) => ({
        validate: (value: string) => ({
            isValid: pattern.test(value),
            message
        }),
        message
    })
};

/**
 * フィールドのバリデーションを実行
 */
export function validateField(field: FormField, value: string): ValidationResult {
    const rules: ValidationRule[] = [];

    // 必須チェック
    if (field.required) {
        rules.push(validationRules.required);
    }

    // フィールドタイプ別のバリデーション
    if (field.type === 'text' && field.validation?.type === 'email') {
        rules.push(validationRules.email);
    } else if (field.type === 'text' && field.validation?.type === 'phone') {
        rules.push(validationRules.phone);
    } else if (field.type === 'text' && field.validation?.type === 'number') {
        rules.push(validationRules.number);
    }

    // カスタムバリデーション
    if (field.validation) {
        const validation = field.validation;

        if (validation.minLength) {
            rules.push(validationRules.minLength(validation.minLength));
        }

        if (validation.maxLength) {
            rules.push(validationRules.maxLength(validation.maxLength));
        }

        if (validation.pattern) {
            try {
                const regex = new RegExp(validation.pattern);
                rules.push(validationRules.pattern(regex, '正しい形式で入力してください'));
            } catch (_error) {
                console.error('Invalid regex pattern:', validation.pattern);
            }
        }
    }

    // バリデーション実行
    for (const rule of rules) {
        const result = rule.validate(value);
        if (!result.isValid) {
            return result;
        }
    }

    return { isValid: true };
}

/**
 * フォーム全体のバリデーション
 */
export function validateForm(fields: FormField[], values: Record<string, string>): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const field of fields) {
        const value = values[field.id] || '';
        const validation = validateField(field, value);

        if (!validation.isValid && validation.message) {
            errors[field.id] = validation.message;
        }
    }

    return errors;
}

/**
 * フォームが有効かどうかをチェック
 */
export function isFormValid(fields: FormField[], values: Record<string, string>): boolean {
    const errors = validateForm(fields, values);
    return Object.keys(errors).length === 0;
}

/**
 * 埋め込みフォーム用のクライアントサイドバリデーション
 */
export function validateEmbeddedForm(formData: FormData, fields: FormField[]): Record<string, string> {
    const errors: Record<string, string> = {};

    for (const field of fields) {
        const value = formData.get(field.id) as string || '';
        const validation = validateField(field, value);

        if (!validation.isValid && validation.message) {
            errors[field.id] = validation.message;
        }
    }

    return errors;
}

/**
 * エラーメッセージを表示
 */
export function showFieldError(fieldId: string, message: string): void {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // 既存のエラーメッセージを削除
    const existingError = field.parentElement?.querySelector('.ir-form-error');
    if (existingError) {
        existingError.remove();
    }

    // エラーメッセージを追加
    const errorElement = document.createElement('div');
    errorElement.className = 'ir-form-error text-red-500 text-sm mt-1';
    errorElement.textContent = message;

    field.parentElement?.appendChild(errorElement);

    // フィールドにエラースタイルを適用
    field.classList.add('border-red-500');
}

/**
 * フィールドエラーをクリア
 */
export function clearFieldError(fieldId: string): void {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // エラーメッセージを削除
    const errorElement = field.parentElement?.querySelector('.ir-form-error');
    if (errorElement) {
        errorElement.remove();
    }

    // エラースタイルを削除
    field.classList.remove('border-red-500');
}
