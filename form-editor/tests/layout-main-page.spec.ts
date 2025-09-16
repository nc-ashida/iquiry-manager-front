import { test, expect } from '@playwright/test';

test.describe('メインページ（フォーム管理）のレイアウトテスト', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('ページタイトルが正しく表示される', async ({ page }) => {
        await expect(page).toHaveTitle(/Create Next App/);
    });

    test('サイドバーが正しく表示される', async ({ page }) => {
        // サイドバーのヘッダーが表示される
        await expect(page.locator('[data-testid="sidebar-header"]')).toBeVisible();

        // フォームエディタのロゴとタイトルが表示される
        await expect(page.locator('text=フォームエディタ')).toBeVisible();
        await expect(page.locator('text=v1.0.0')).toBeVisible();

        // メニュー項目が表示される
        await expect(page.locator('text=フォーム管理')).toBeVisible();
        await expect(page.locator('text=署名管理')).toBeVisible();
        await expect(page.locator('text=受信')).toBeVisible();
        await expect(page.locator('text=送信')).toBeVisible();
    });

    test('メインコンテンツエリアが正しく表示される', async ({ page }) => {
        // ヘッダーが表示される
        await expect(page.locator('h1:has-text("フォーム管理")')).toBeVisible();
        await expect(page.locator('text=問合せフォームの作成・編集・管理を行います')).toBeVisible();

        // フォーム作成ボタンが表示される
        await expect(page.locator('button:has-text("新しいフォームを作成")')).toBeVisible();

        // フォームリストエリアが表示される
        await expect(page.locator('[data-testid="form-list"]')).toBeVisible();
    });

    test('レスポンシブデザインが正しく適用される（デスクトップ）', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        // サイドバーが表示される
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

        // メインコンテンツが適切な幅で表示される
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();

        // フォーム作成ボタンが適切なサイズで表示される
        const createButton = page.locator('button:has-text("新しいフォームを作成")');
        await expect(createButton).toBeVisible();
    });

    test('レスポンシブデザインが正しく適用される（モバイル）', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // サイドバーが表示される（モバイルでは折りたたまれる可能性）
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

        // メインコンテンツが表示される
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();

        // フォーム作成ボタンのテキストが短縮される
        await expect(page.locator('button:has-text("フォーム作成")')).toBeVisible();
    });

    test('フォーム作成ボタンをクリックするとフォームエディターが表示される', async ({ page }) => {
        // フォーム作成ボタンをクリック
        await page.click('button:has-text("新しいフォームを作成")');

        // フォームエディターが表示される
        await expect(page.locator('[data-testid="form-editor"]')).toBeVisible();

        // フォームの基本情報入力フィールドが表示される
        await expect(page.locator('input[placeholder*="フォーム名"]')).toBeVisible();
    });

    test('フォームリストが空の場合の表示が正しい', async ({ page }) => {
        // フォームリストが空の場合のメッセージが表示される
        await expect(page.locator('text=フォームがありません')).toBeVisible();
        await expect(page.locator('text=新しいフォームを作成してください')).toBeVisible();
    });

    test('アニメーションが正しく動作する', async ({ page }) => {
        // FadeInアニメーションが適用された要素が表示される
        await expect(page.locator('[data-testid="fade-in-header"]')).toBeVisible();
        await expect(page.locator('[data-testid="fade-in-form-list"]')).toBeVisible();
    });

    test('テーマが正しく適用される', async ({ page }) => {
        // ライトテーマが適用されている
        const body = page.locator('body');
        await expect(body).toHaveClass(/antialiased/);

        // カラーパレットが正しく適用されている
        const header = page.locator('h1:has-text("フォーム管理")');
        await expect(header).toHaveClass(/text-gray-900/);
    });
});
