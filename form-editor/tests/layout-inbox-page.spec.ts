import { test, expect } from '@playwright/test';

test.describe('受信メールページのレイアウトテスト', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/mail/inbox');
    });

    test('ページが正しく読み込まれる', async ({ page }) => {
        await expect(page).toHaveTitle(/Create Next App/);
    });

    test('ヘッダーセクションが正しく表示される', async ({ page }) => {
        // ページタイトルが表示される
        await expect(page.locator('h1:has-text("受信メール")')).toBeVisible();

        // アイコンが表示される
        await expect(page.locator('[data-testid="inbox-icon"]')).toBeVisible();

        // メール件数の統計が表示される
        await expect(page.locator('text=HP問合せ: 5件 / エミダス: 5件')).toBeVisible();

        // 未読件数のバッジが表示される
        await expect(page.locator('text=HP問合せ: 2件未読')).toBeVisible();
        await expect(page.locator('text=エミダス: 2件未読')).toBeVisible();
    });

    test('検索・フィルターセクションが正しく表示される', async ({ page }) => {
        // 検索ボックスが表示される
        const searchInput = page.locator('input[placeholder="メールを検索..."]');
        await expect(searchInput).toBeVisible();

        // 検索アイコンが表示される
        await expect(page.locator('[data-testid="search-icon"]')).toBeVisible();

        // フィルターボタンが表示される
        await expect(page.locator('button:has-text("フィルター")')).toBeVisible();
    });

    test('タブ機能が正しく表示される', async ({ page }) => {
        // タブリストが表示される
        await expect(page.locator('[data-testid="tabs-list"]')).toBeVisible();

        // HP問合せシステムタブが表示される
        await expect(page.locator('text=HP問合せシステム')).toBeVisible();
        await expect(page.locator('text=(5)')).toBeVisible();

        // エミダスシステムタブが表示される
        await expect(page.locator('text=エミダスシステム')).toBeVisible();
        await expect(page.locator('text=(5)')).toBeVisible();
    });

    test('HP問合せシステムタブのメールリストが正しく表示される', async ({ page }) => {
        // HP問合せシステムタブをクリック
        await page.click('[data-testid="tabs-trigger-hp"]');

        // メールリストが表示される
        await expect(page.locator('[data-testid="mail-list-hp"]')).toBeVisible();

        // メールアイテムが表示される
        const mailItems = page.locator('[data-testid="mail-item"]');
        await expect(mailItems).toHaveCount(5);

        // 最初のメールアイテムの内容を確認
        const firstMail = mailItems.first();
        await expect(firstMail.locator('text=田中太郎')).toBeVisible();
        await expect(firstMail.locator('text=お問い合わせフォームについて')).toBeVisible();
        await expect(firstMail.locator('text=2024-01-15 14:30')).toBeVisible();
    });

    test('エミダスシステムタブのメールリストが正しく表示される', async ({ page }) => {
        // エミダスシステムタブをクリック
        await page.click('[data-testid="tabs-trigger-emidas"]');

        // メールリストが表示される
        await expect(page.locator('[data-testid="mail-list-emidas"]')).toBeVisible();

        // メールアイテムが表示される
        const mailItems = page.locator('[data-testid="mail-item"]');
        await expect(mailItems).toHaveCount(5);

        // 最初のメールアイテムの内容を確認
        const firstMail = mailItems.first();
        await expect(firstMail.locator('text=エミダス太郎')).toBeVisible();
        await expect(firstMail.locator('text=エミダスシステムからのお問い合わせ')).toBeVisible();
    });

    test('メールアイテムの優先度バッジが正しく表示される', async ({ page }) => {
        const mailItems = page.locator('[data-testid="mail-item"]');

        // 高優先度のバッジが表示される
        await expect(mailItems.locator('text=高').first()).toBeVisible();

        // 中優先度のバッジが表示される
        await expect(mailItems.locator('text=中')).toBeVisible();

        // 低優先度のバッジが表示される
        await expect(mailItems.locator('text=低')).toBeVisible();
    });

    test('メールアイテムのカテゴリバッジが正しく表示される', async ({ page }) => {
        const mailItems = page.locator('[data-testid="mail-item"]');

        // カテゴリバッジが表示される
        await expect(mailItems.locator('text=お問い合わせ')).toBeVisible();
        await expect(mailItems.locator('text=修正依頼')).toBeVisible();
        await expect(mailItems.locator('text=ご相談')).toBeVisible();
        await expect(mailItems.locator('text=エラー報告')).toBeVisible();
    });

    test('未読メールのスタイルが正しく適用される', async ({ page }) => {
        const unreadMails = page.locator('[data-testid="mail-item-unread"]');

        // 未読メールが存在する
        await expect(unreadMails).toHaveCount(4); // 2件ずつ

        // 未読バッジが表示される
        await expect(unreadMails.locator('text=未読')).toBeVisible();
    });

    test('メールアイテムのドロップダウンメニューが正しく動作する', async ({ page }) => {
        // 最初のメールアイテムのメニューボタンをクリック
        await page.click('[data-testid="mail-item"] [data-testid="mail-menu-button"]').first();

        // ドロップダウンメニューが表示される
        await expect(page.locator('[data-testid="mail-dropdown-menu"]')).toBeVisible();

        // メニュー項目が表示される
        await expect(page.locator('text=返信')).toBeVisible();
        await expect(page.locator('text=アーカイブ')).toBeVisible();
        await expect(page.locator('text=転送')).toBeVisible();
        await expect(page.locator('text=削除')).toBeVisible();
    });

    test('レスポンシブデザインが正しく適用される（デスクトップ）', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        // レイアウトが適切に表示される
        await expect(page.locator('[data-testid="inbox-layout"]')).toBeVisible();

        // メールアイテムが適切な幅で表示される
        const mailItems = page.locator('[data-testid="mail-item"]');
        await expect(mailItems.first()).toBeVisible();
    });

    test('レスポンシブデザインが正しく適用される（モバイル）', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // タブのテキストが短縮される
        await expect(page.locator('text=HP問合せ')).toBeVisible();
        await expect(page.locator('text=エミダス')).toBeVisible();

        // フィルターボタンのテキストが短縮される
        await expect(page.locator('button:has-text("フィルター")')).toBeVisible();
    });

    test('メール検索機能のレイアウトが正しい', async ({ page }) => {
        const searchInput = page.locator('input[placeholder="メールを検索..."]');

        // 検索ボックスにテキストを入力
        await searchInput.fill('お問い合わせ');

        // 検索結果が表示される（実際の検索機能は実装されていないため、レイアウトのみ確認）
        await expect(searchInput).toHaveValue('お問い合わせ');
    });

    test('フィルター機能のレイアウトが正しい', async ({ page }) => {
        // フィルターボタンをクリック
        await page.click('button:has-text("フィルター")');

        // フィルターメニューが表示される
        await expect(page.locator('[data-testid="filter-dropdown"]')).toBeVisible();

        // フィルター項目が表示される
        await expect(page.locator('text=未読のみ')).toBeVisible();
        await expect(page.locator('text=優先度: 高')).toBeVisible();
        await expect(page.locator('text=今日')).toBeVisible();
        await expect(page.locator('text=今週')).toBeVisible();
    });
});
