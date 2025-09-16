import { test, expect } from '@playwright/test';

test.describe('レスポンシブデザインのレイアウトテスト', () => {
    test('デスクトップ（1200px以上）でのレイアウトが正しく表示される', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.goto('/');

        // サイドバーが表示される
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

        // メインコンテンツが適切な幅で表示される
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();

        // フォーム作成ボタンが適切なサイズで表示される
        const createButton = page.locator('button:has-text("新しいフォームを作成")');
        await expect(createButton).toBeVisible();

        // ヘッダーのレイアウトが適切に表示される
        const header = page.locator('h1:has-text("フォーム管理")');
        await expect(header).toHaveClass(/text-2xl/);
    });

    test('タブレット（768px-1199px）でのレイアウトが正しく表示される', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/');

        // サイドバーが表示される
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

        // メインコンテンツが表示される
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();

        // フォーム作成ボタンが表示される
        const createButton = page.locator('button:has-text("新しいフォームを作成")');
        await expect(createButton).toBeVisible();

        // ヘッダーのレイアウトが適切に表示される
        const header = page.locator('h1:has-text("フォーム管理")');
        await expect(header).toHaveClass(/text-xl/);
    });

    test('モバイル（375px-767px）でのレイアウトが正しく表示される', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // サイドバーが表示される（モバイルでは折りたたまれる可能性）
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

        // メインコンテンツが表示される
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();

        // フォーム作成ボタンのテキストが短縮される
        await expect(page.locator('button:has-text("フォーム作成")')).toBeVisible();

        // ヘッダーのレイアウトが適切に表示される
        const header = page.locator('h1:has-text("フォーム管理")');
        await expect(header).toHaveClass(/text-xl/);
    });

    test('受信メールページのレスポンシブレイアウトが正しく表示される', async ({ page }) => {
        await page.goto('/mail/inbox');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        await expect(page.locator('text=HP問合せシステム')).toBeVisible();
        await expect(page.locator('text=エミダスシステム')).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('text=HP問合せシステム')).toBeVisible();
        await expect(page.locator('text=エミダスシステム')).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('text=HP問合せ')).toBeVisible();
        await expect(page.locator('text=エミダス')).toBeVisible();
    });

    test('署名管理ページのレスポンシブレイアウトが正しく表示される', async ({ page }) => {
        await page.goto('/signatures');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        await expect(page.locator('h1:has-text("署名管理")')).toBeVisible();
        await expect(page.locator('[data-testid="signature-editor"]')).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('h1:has-text("署名管理")')).toBeVisible();
        await expect(page.locator('[data-testid="signature-editor"]')).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('h1:has-text("署名管理")')).toBeVisible();
        await expect(page.locator('[data-testid="signature-editor"]')).toBeVisible();
    });

    test('サイドバーのレスポンシブ動作が正しく機能する', async ({ page }) => {
        await page.goto('/');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    });

    test('フォームリストのレスポンシブレイアウトが正しく表示される', async ({ page }) => {
        await page.goto('/');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        await expect(page.locator('[data-testid="form-list"]')).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('[data-testid="form-list"]')).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('[data-testid="form-list"]')).toBeVisible();
    });

    test('メールアイテムのレスポンシブレイアウトが正しく表示される', async ({ page }) => {
        await page.goto('/mail/inbox');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        const mailItems = page.locator('[data-testid="mail-item"]');
        await expect(mailItems.first()).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(mailItems.first()).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(mailItems.first()).toBeVisible();
    });

    test('署名アイテムのレスポンシブレイアウトが正しく表示される', async ({ page }) => {
        await page.goto('/signatures');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        const signatureItems = page.locator('[data-testid="signature-item"]');
        await expect(signatureItems.first()).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(signatureItems.first()).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(signatureItems.first()).toBeVisible();
    });

    test('検索ボックスのレスポンシブレイアウトが正しく表示される', async ({ page }) => {
        await page.goto('/mail/inbox');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        const searchInput = page.locator('input[placeholder="メールを検索..."]');
        await expect(searchInput).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(searchInput).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(searchInput).toBeVisible();
    });

    test('フィルターボタンのレスポンシブレイアウトが正しく表示される', async ({ page }) => {
        await page.goto('/mail/inbox');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        await expect(page.locator('button:has-text("フィルター")')).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('button:has-text("フィルター")')).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('button:has-text("フィルター")')).toBeVisible();
    });

    test('ドロップダウンメニューのレスポンシブ動作が正しく機能する', async ({ page }) => {
        await page.goto('/mail/inbox');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.click('button:has-text("フィルター")');
        await expect(page.locator('[data-testid="filter-dropdown"]')).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.click('button:has-text("フィルター")');
        await expect(page.locator('[data-testid="filter-dropdown"]')).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await page.click('button:has-text("フィルター")');
        await expect(page.locator('[data-testid="filter-dropdown"]')).toBeVisible();
    });

    test('タブのレスポンシブレイアウトが正しく表示される', async ({ page }) => {
        await page.goto('/mail/inbox');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        await expect(page.locator('text=HP問合せシステム')).toBeVisible();
        await expect(page.locator('text=エミダスシステム')).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('text=HP問合せシステム')).toBeVisible();
        await expect(page.locator('text=エミダスシステム')).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('text=HP問合せ')).toBeVisible();
        await expect(page.locator('text=エミダス')).toBeVisible();
    });

    test('バッジのレスポンシブレイアウトが正しく表示される', async ({ page }) => {
        await page.goto('/mail/inbox');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        await expect(page.locator('text=HP問合せ: 2件未読')).toBeVisible();
        await expect(page.locator('text=エミダス: 2件未読')).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('text=HP問合せ: 2件未読')).toBeVisible();
        await expect(page.locator('text=エミダス: 2件未読')).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('text=HP問合せ: 2件未読')).toBeVisible();
        await expect(page.locator('text=エミダス: 2件未読')).toBeVisible();
    });

    test('アニメーションのレスポンシブ動作が正しく機能する', async ({ page }) => {
        await page.goto('/');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        await expect(page.locator('[data-testid="fade-in-header"]')).toBeVisible();

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('[data-testid="fade-in-header"]')).toBeVisible();

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('[data-testid="fade-in-header"]')).toBeVisible();
    });

    test('テーマのレスポンシブ適用が正しく機能する', async ({ page }) => {
        await page.goto('/');

        // デスクトップ表示
        await page.setViewportSize({ width: 1200, height: 800 });
        const body = page.locator('body');
        await expect(body).toHaveClass(/antialiased/);

        // タブレット表示
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(body).toHaveClass(/antialiased/);

        // モバイル表示
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(body).toHaveClass(/antialiased/);
    });

    test('極小画面（320px）でのレイアウトが正しく表示される', async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 568 });
        await page.goto('/');

        // サイドバーが表示される
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

        // メインコンテンツが表示される
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();

        // フォーム作成ボタンが表示される
        await expect(page.locator('button:has-text("フォーム作成")')).toBeVisible();
    });

    test('超大画面（1920px以上）でのレイアウトが正しく表示される', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('/');

        // サイドバーが表示される
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

        // メインコンテンツが表示される
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();

        // フォーム作成ボタンが表示される
        await expect(page.locator('button:has-text("新しいフォームを作成")')).toBeVisible();
    });
});
