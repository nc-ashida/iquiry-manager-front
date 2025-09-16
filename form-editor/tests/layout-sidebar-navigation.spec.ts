import { test, expect } from '@playwright/test';

test.describe('サイドバーナビゲーションのレイアウトテスト', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('サイドバーが正しく表示される', async ({ page }) => {
        // サイドバーコンテナが表示される
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

        // サイドバーの幅が適切に設定されている
        const sidebar = page.locator('[data-testid="sidebar"]');
        await expect(sidebar).toBeVisible();
    });

    test('サイドバーヘッダーが正しく表示される', async ({ page }) => {
        // ヘッダーセクションが表示される
        await expect(page.locator('[data-testid="sidebar-header"]')).toBeVisible();

        // ロゴアイコンが表示される
        await expect(page.locator('[data-testid="sidebar-logo"]')).toBeVisible();

        // アプリケーション名が表示される
        await expect(page.locator('text=フォームエディタ')).toBeVisible();

        // バージョン情報が表示される
        await expect(page.locator('text=v1.0.0')).toBeVisible();
    });

    test('FORMメニューグループが正しく表示される', async ({ page }) => {
        // グループラベルが表示される
        await expect(page.locator('text=FORM')).toBeVisible();

        // フォーム管理メニューが表示される
        await expect(page.locator('[data-testid="menu-item-forms"]')).toBeVisible();
        await expect(page.locator('text=フォーム管理')).toBeVisible();

        // 署名管理メニューが表示される
        await expect(page.locator('[data-testid="menu-item-signatures"]')).toBeVisible();
        await expect(page.locator('text=署名管理')).toBeVisible();
    });

    test('MAILメニューグループが正しく表示される', async ({ page }) => {
        // グループラベルが表示される
        await expect(page.locator('text=MAIL')).toBeVisible();

        // 受信メニューが表示される
        await expect(page.locator('[data-testid="menu-item-inbox"]')).toBeVisible();
        await expect(page.locator('text=受信')).toBeVisible();

        // 送信メニューが表示される
        await expect(page.locator('[data-testid="menu-item-sent"]')).toBeVisible();
        await expect(page.locator('text=送信')).toBeVisible();
    });

    test('Settingsメニューグループが正しく表示される', async ({ page }) => {
        // グループラベルが表示される
        await expect(page.locator('text=Settings')).toBeVisible();

        // ヘルプメニューが表示される
        await expect(page.locator('[data-testid="menu-item-help"]')).toBeVisible();
        await expect(page.locator('text=ヘルプ')).toBeVisible();
    });

    test('メニューアイコンが正しく表示される', async ({ page }) => {
        // フォーム管理のアイコンが表示される
        await expect(page.locator('[data-testid="menu-item-forms"] svg')).toBeVisible();

        // 署名管理のアイコンが表示される
        await expect(page.locator('[data-testid="menu-item-signatures"] svg')).toBeVisible();

        // 受信のアイコンが表示される
        await expect(page.locator('[data-testid="menu-item-inbox"] svg')).toBeVisible();

        // 送信のアイコンが表示される
        await expect(page.locator('[data-testid="menu-item-sent"] svg')).toBeVisible();

        // ヘルプのアイコンが表示される
        await expect(page.locator('[data-testid="menu-item-help"] svg')).toBeVisible();
    });

    test('現在のページのメニューがアクティブ状態で表示される', async ({ page }) => {
        // フォーム管理ページでは、フォーム管理メニューがアクティブ
        const formsMenuItem = page.locator('[data-testid="menu-item-forms"]');
        await expect(formsMenuItem).toHaveClass(/data-state-active/);
    });

    test('メニューアイテムのホバー効果が正しく動作する', async ({ page }) => {
        // 署名管理メニューにホバー
        const signaturesMenuItem = page.locator('[data-testid="menu-item-signatures"]');
        await signaturesMenuItem.hover();

        // ホバー効果が適用される
        await expect(signaturesMenuItem).toHaveClass(/hover:bg-gray-100/);
    });

    test('メニューアイテムのクリックでページ遷移が正しく動作する', async ({ page }) => {
        // 署名管理メニューをクリック
        await page.click('[data-testid="menu-item-signatures"]');

        // 署名管理ページに遷移する
        await expect(page).toHaveURL('/signatures');

        // 署名管理ページのコンテンツが表示される
        await expect(page.locator('h1:has-text("署名管理")')).toBeVisible();
    });

    test('受信メニューのクリックでページ遷移が正しく動作する', async ({ page }) => {
        // 受信メニューをクリック
        await page.click('[data-testid="menu-item-inbox"]');

        // 受信メールページに遷移する
        await expect(page).toHaveURL('/mail/inbox');

        // 受信メールページのコンテンツが表示される
        await expect(page.locator('h1:has-text("受信メール")')).toBeVisible();
    });

    test('送信メニューのクリックでページ遷移が正しく動作する', async ({ page }) => {
        // 送信メニューをクリック
        await page.click('[data-testid="menu-item-sent"]');

        // 送信メールページに遷移する
        await expect(page).toHaveURL('/mail/sent');
    });

    test('サイドバーフッターが正しく表示される', async ({ page }) => {
        // フッターセクションが表示される
        await expect(page.locator('[data-testid="sidebar-footer"]')).toBeVisible();

        // コピーライトが表示される
        await expect(page.locator('text=© 2024 Form Editor')).toBeVisible();
    });

    test('レスポンシブデザインが正しく適用される（デスクトップ）', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        // サイドバーが適切な幅で表示される
        const sidebar = page.locator('[data-testid="sidebar"]');
        await expect(sidebar).toBeVisible();

        // メニューアイテムが適切に表示される
        const menuItems = page.locator('[data-testid^="menu-item-"]');
        await expect(menuItems).toHaveCount(5);
    });

    test('レスポンシブデザインが正しく適用される（モバイル）', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // サイドバーが表示される（モバイルでは折りたたまれる可能性）
        const sidebar = page.locator('[data-testid="sidebar"]');
        await expect(sidebar).toBeVisible();

        // メニューアイテムが表示される
        const menuItems = page.locator('[data-testid^="menu-item-"]');
        await expect(menuItems).toHaveCount(5);
    });

    test('サイドバーの折りたたみ機能が正しく動作する', async ({ page }) => {
        // 折りたたみボタンが表示される
        await expect(page.locator('[data-testid="sidebar-toggle"]')).toBeVisible();

        // 折りたたみボタンをクリック
        await page.click('[data-testid="sidebar-toggle"]');

        // サイドバーが折りたたまれる
        const sidebar = page.locator('[data-testid="sidebar"]');
        await expect(sidebar).toHaveClass(/collapsed/);

        // 再度クリックで展開される
        await page.click('[data-testid="sidebar-toggle"]');
        await expect(sidebar).not.toHaveClass(/collapsed/);
    });

    test('メニューグループの展開・折りたたみが正しく動作する', async ({ page }) => {
        // メニューグループの展開ボタンが表示される
        await expect(page.locator('[data-testid="menu-group-toggle-form"]')).toBeVisible();

        // 展開ボタンをクリック
        await page.click('[data-testid="menu-group-toggle-form"]');

        // メニューグループが折りたたまれる
        const formGroup = page.locator('[data-testid="menu-group-form"]');
        await expect(formGroup).toHaveClass(/collapsed/);

        // 再度クリックで展開される
        await page.click('[data-testid="menu-group-toggle-form"]');
        await expect(formGroup).not.toHaveClass(/collapsed/);
    });

    test('メニューアイテムのツールチップが正しく表示される', async ({ page }) => {
        // 署名管理メニューにホバー
        const signaturesMenuItem = page.locator('[data-testid="menu-item-signatures"]');
        await signaturesMenuItem.hover();

        // ツールチップが表示される
        await expect(page.locator('[data-testid="tooltip-signatures"]')).toBeVisible();
        await expect(page.locator('text=署名管理')).toBeVisible();
    });

    test('サイドバーのスクロール機能が正しく動作する', async ({ page }) => {
        // サイドバーのコンテンツエリアが表示される
        const sidebarContent = page.locator('[data-testid="sidebar-content"]');
        await expect(sidebarContent).toBeVisible();

        // スクロール可能であることを確認
        await expect(sidebarContent).toHaveCSS('overflow-y', 'auto');
    });

    test('サイドバーのテーマが正しく適用される', async ({ page }) => {
        // ライトテーマが適用されている
        const sidebar = page.locator('[data-testid="sidebar"]');
        await expect(sidebar).toHaveClass(/bg-white/);

        // メニューアイテムのテキストカラーが正しい
        const menuItems = page.locator('[data-testid^="menu-item-"]');
        await expect(menuItems.first()).toHaveClass(/text-gray-900/);
    });

    test('サイドバーのアクセシビリティが正しく実装されている', async ({ page }) => {
        // メニューアイテムに適切なrole属性が設定されている
        const menuItems = page.locator('[data-testid^="menu-item-"]');
        await expect(menuItems.first()).toHaveAttribute('role', 'menuitem');

        // キーボードナビゲーションが可能であることを確認
        await page.keyboard.press('Tab');
        await expect(page.locator(':focus')).toBeVisible();
    });
});
