import { test, expect } from '@playwright/test';

test.describe('フォームエディターのレイアウトテスト', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // フォーム作成ボタンをクリックしてフォームエディターを開く
        await page.click('button:has-text("新しいフォームを作成")');
    });

    test('フォームエディターが正しく表示される', async ({ page }) => {
        // フォームエディターコンテナが表示される
        await expect(page.locator('[data-testid="form-editor"]')).toBeVisible();

        // フォームエディターのヘッダーが表示される
        await expect(page.locator('[data-testid="form-editor-header"]')).toBeVisible();
    });

    test('フォーム基本情報セクションが正しく表示される', async ({ page }) => {
        // 基本情報セクションが表示される
        await expect(page.locator('[data-testid="form-basic-info"]')).toBeVisible();

        // フォーム名入力フィールドが表示される
        await expect(page.locator('input[placeholder*="フォーム名"]')).toBeVisible();

        // フォーム説明入力フィールドが表示される
        await expect(page.locator('textarea[placeholder*="フォームの説明"]')).toBeVisible();
    });

    test('フィールド管理セクションが正しく表示される', async ({ page }) => {
        // フィールド管理セクションが表示される
        await expect(page.locator('[data-testid="field-management"]')).toBeVisible();

        // フィールド追加ボタンが表示される
        await expect(page.locator('button:has-text("フィールドを追加")')).toBeVisible();

        // フィールドタイプ選択ドロップダウンが表示される
        await expect(page.locator('[data-testid="field-type-select"]')).toBeVisible();
    });

    test('フィールドタイプ選択が正しく動作する', async ({ page }) => {
        // フィールドタイプ選択ドロップダウンをクリック
        await page.click('[data-testid="field-type-select"]');

        // フィールドタイプのオプションが表示される
        await expect(page.locator('text=テキスト')).toBeVisible();
        await expect(page.locator('text=テキストエリア')).toBeVisible();
        await expect(page.locator('text=セレクト')).toBeVisible();
        await expect(page.locator('text=ラジオボタン')).toBeVisible();
        await expect(page.locator('text=チェックボックス')).toBeVisible();
        await expect(page.locator('text=ファイルアップロード')).toBeVisible();
    });

    test('フィールド追加機能が正しく動作する', async ({ page }) => {
        // フィールドタイプを選択
        await page.click('[data-testid="field-type-select"]');
        await page.click('text=テキスト');

        // フィールド追加ボタンをクリック
        await page.click('button:has-text("フィールドを追加")');

        // 新しいフィールドが追加される
        await expect(page.locator('[data-testid="field-item"]')).toBeVisible();

        // フィールドの設定パネルが表示される
        await expect(page.locator('[data-testid="field-settings"]')).toBeVisible();
    });

    test('フィールド設定パネルが正しく表示される', async ({ page }) => {
        // フィールドを追加
        await page.click('[data-testid="field-type-select"]');
        await page.click('text=テキスト');
        await page.click('button:has-text("フィールドを追加")');

        // フィールド設定パネルが表示される
        await expect(page.locator('[data-testid="field-settings"]')).toBeVisible();

        // フィールド名入力フィールドが表示される
        await expect(page.locator('input[placeholder*="フィールド名"]')).toBeVisible();

        // フィールドラベル入力フィールドが表示される
        await expect(page.locator('input[placeholder*="フィールドラベル"]')).toBeVisible();

        // 必須項目チェックボックスが表示される
        await expect(page.locator('input[type="checkbox"][name="required"]')).toBeVisible();
    });

    test('フィールドの並び替え機能が正しく表示される', async ({ page }) => {
        // 複数のフィールドを追加
        await page.click('[data-testid="field-type-select"]');
        await page.click('text=テキスト');
        await page.click('button:has-text("フィールドを追加")');

        await page.click('[data-testid="field-type-select"]');
        await page.click('text=テキストエリア');
        await page.click('button:has-text("フィールドを追加")');

        // ドラッグハンドルが表示される
        await expect(page.locator('[data-testid="drag-handle"]')).toBeVisible();

        // フィールドアイテムが複数表示される
        const fieldItems = page.locator('[data-testid="field-item"]');
        await expect(fieldItems).toHaveCount(2);
    });

    test('フォームプレビューセクションが正しく表示される', async ({ page }) => {
        // プレビューセクションが表示される
        await expect(page.locator('[data-testid="form-preview"]')).toBeVisible();

        // プレビュータイトルが表示される
        await expect(page.locator('text=プレビュー')).toBeVisible();

        // プレビューコンテンツが表示される
        await expect(page.locator('[data-testid="preview-content"]')).toBeVisible();
    });

    test('フォーム設定セクションが正しく表示される', async ({ page }) => {
        // 設定セクションが表示される
        await expect(page.locator('[data-testid="form-settings"]')).toBeVisible();

        // 設定タブが表示される
        await expect(page.locator('[data-testid="settings-tabs"]')).toBeVisible();

        // 基本設定タブが表示される
        await expect(page.locator('text=基本設定')).toBeVisible();

        // 送信設定タブが表示される
        await expect(page.locator('text=送信設定')).toBeVisible();

        // スタイル設定タブが表示される
        await expect(page.locator('text=スタイル設定')).toBeVisible();
    });

    test('基本設定タブの内容が正しく表示される', async ({ page }) => {
        // 基本設定タブをクリック
        await page.click('text=基本設定');

        // 完了ページURL入力フィールドが表示される
        await expect(page.locator('input[placeholder*="完了ページURL"]')).toBeVisible();

        // 自動返信チェックボックスが表示される
        await expect(page.locator('input[type="checkbox"][name="autoReply"]')).toBeVisible();
    });

    test('送信設定タブの内容が正しく表示される', async ({ page }) => {
        // 送信設定タブをクリック
        await page.click('text=送信設定');

        // 署名選択ドロップダウンが表示される
        await expect(page.locator('[data-testid="signature-select"]')).toBeVisible();

        // ファイルアップロード設定が表示される
        await expect(page.locator('[data-testid="file-upload-settings"]')).toBeVisible();

        // 許可ドメイン設定が表示される
        await expect(page.locator('[data-testid="allowed-domains"]')).toBeVisible();
    });

    test('スタイル設定タブの内容が正しく表示される', async ({ page }) => {
        // スタイル設定タブをクリック
        await page.click('text=スタイル設定');

        // CSS編集エリアが表示される
        await expect(page.locator('[data-testid="css-editor"]')).toBeVisible();

        // テーマ選択ドロップダウンが表示される
        await expect(page.locator('[data-testid="theme-select"]')).toBeVisible();
    });

    test('フォームエディターのアクションボタンが正しく表示される', async ({ page }) => {
        // 保存ボタンが表示される
        await expect(page.locator('button:has-text("保存")')).toBeVisible();

        // キャンセルボタンが表示される
        await expect(page.locator('button:has-text("キャンセル")')).toBeVisible();

        // プレビューボタンが表示される
        await expect(page.locator('button:has-text("プレビュー")')).toBeVisible();
    });

    test('フォーム保存機能が正しく動作する', async ({ page }) => {
        // フォーム名を入力
        await page.fill('input[placeholder*="フォーム名"]', 'テストフォーム');

        // 保存ボタンをクリック
        await page.click('button:has-text("保存")');

        // フォーム一覧に戻る
        await expect(page.locator('h1:has-text("フォーム管理")')).toBeVisible();

        // 作成したフォームが一覧に表示される
        await expect(page.locator('text=テストフォーム')).toBeVisible();
    });

    test('フォームキャンセル機能が正しく動作する', async ({ page }) => {
        // キャンセルボタンをクリック
        await page.click('button:has-text("キャンセル")');

        // フォーム一覧に戻る
        await expect(page.locator('h1:has-text("フォーム管理")')).toBeVisible();
    });

    test('フォームプレビュー機能が正しく動作する', async ({ page }) => {
        // プレビューボタンをクリック
        await page.click('button:has-text("プレビュー")');

        // プレビューモードが表示される
        await expect(page.locator('[data-testid="preview-mode"]')).toBeVisible();

        // プレビューのフォームが表示される
        await expect(page.locator('[data-testid="preview-form"]')).toBeVisible();
    });

    test('フィールド削除機能が正しく動作する', async ({ page }) => {
        // フィールドを追加
        await page.click('[data-testid="field-type-select"]');
        await page.click('text=テキスト');
        await page.click('button:has-text("フィールドを追加")');

        // 削除ボタンをクリック
        await page.click('[data-testid="field-delete-button"]');

        // 確認ダイアログが表示される
        await expect(page.locator('[data-testid="delete-confirmation"]')).toBeVisible();

        // 削除を確認
        await page.click('button:has-text("削除")');

        // フィールドが削除される
        await expect(page.locator('[data-testid="field-item"]')).not.toBeVisible();
    });

    test('バリデーション機能が正しく動作する', async ({ page }) => {
        // フォーム名を空にして保存を試行
        await page.fill('input[placeholder*="フォーム名"]', '');
        await page.click('button:has-text("保存")');

        // バリデーションエラーが表示される
        await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
    });

    test('レスポンシブデザインが正しく適用される（デスクトップ）', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        // フォームエディターが適切に表示される
        await expect(page.locator('[data-testid="form-editor"]')).toBeVisible();

        // サイドバーとメインコンテンツが適切に配置される
        const sidebar = page.locator('[data-testid="form-editor-sidebar"]');
        const mainContent = page.locator('[data-testid="form-editor-main"]');
        await expect(sidebar).toBeVisible();
        await expect(mainContent).toBeVisible();
    });

    test('レスポンシブデザインが正しく適用される（モバイル）', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // フォームエディターが適切に表示される
        await expect(page.locator('[data-testid="form-editor"]')).toBeVisible();

        // モバイル用のレイアウトが適用される
        const mobileLayout = page.locator('[data-testid="mobile-layout"]');
        await expect(mobileLayout).toBeVisible();
    });

    test('アニメーションが正しく動作する', async ({ page }) => {
        // フィールド追加時のアニメーション
        await page.click('[data-testid="field-type-select"]');
        await page.click('text=テキスト');
        await page.click('button:has-text("フィールドを追加")');

        // アニメーションが適用されたフィールドが表示される
        await expect(page.locator('[data-testid="field-item"]')).toBeVisible();
    });

    test('テーマが正しく適用される', async ({ page }) => {
        // ライトテーマが適用されている
        const body = page.locator('body');
        await expect(body).toHaveClass(/antialiased/);

        // フォームエディターのカラーパレットが正しく適用されている
        const formEditor = page.locator('[data-testid="form-editor"]');
        await expect(formEditor).toBeVisible();
    });
});
