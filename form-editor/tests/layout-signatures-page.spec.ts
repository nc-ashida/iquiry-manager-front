import { test, expect } from '@playwright/test';

test.describe('署名管理ページのレイアウトテスト', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/signatures');
    });

    test('ページが正しく読み込まれる', async ({ page }) => {
        await expect(page).toHaveTitle(/Create Next App/);
    });

    test('ヘッダーセクションが正しく表示される', async ({ page }) => {
        // ページタイトルが表示される
        await expect(page.locator('h1:has-text("署名管理")')).toBeVisible();

        // 説明文が表示される
        await expect(page.locator('text=メール署名の作成・編集・管理を行います')).toBeVisible();
    });

    test('署名エディターが正しく表示される', async ({ page }) => {
        // 署名エディターコンポーネントが表示される
        await expect(page.locator('[data-testid="signature-editor"]')).toBeVisible();

        // 署名一覧エリアが表示される
        await expect(page.locator('[data-testid="signature-list"]')).toBeVisible();

        // 署名作成ボタンが表示される
        await expect(page.locator('button:has-text("新しい署名を作成")')).toBeVisible();
    });

    test('署名一覧が正しく表示される', async ({ page }) => {
        // 署名アイテムが表示される
        const signatureItems = page.locator('[data-testid="signature-item"]');
        await expect(signatureItems).toHaveCount(3); // サンプルデータの件数

        // 署名名が表示される
        await expect(page.locator('text=デフォルト署名')).toBeVisible();
        await expect(page.locator('text=営業部署名')).toBeVisible();
        await expect(page.locator('text=カスタム署名')).toBeVisible();
    });

    test('署名アイテムの詳細が正しく表示される', async ({ page }) => {
        const firstSignature = page.locator('[data-testid="signature-item"]').first();

        // 署名名が表示される
        await expect(firstSignature.locator('[data-testid="signature-name"]')).toBeVisible();

        // 署名内容のプレビューが表示される
        await expect(firstSignature.locator('[data-testid="signature-preview"]')).toBeVisible();

        // 作成日時が表示される
        await expect(firstSignature.locator('[data-testid="signature-created-at"]')).toBeVisible();

        // デフォルト署名のバッジが表示される
        await expect(firstSignature.locator('text=デフォルト')).toBeVisible();
    });

    test('署名アイテムのアクションボタンが正しく表示される', async ({ page }) => {
        const firstSignature = page.locator('[data-testid="signature-item"]').first();

        // 編集ボタンが表示される
        await expect(firstSignature.locator('button:has-text("編集")')).toBeVisible();

        // 削除ボタンが表示される
        await expect(firstSignature.locator('button:has-text("削除")')).toBeVisible();

        // 複製ボタンが表示される
        await expect(firstSignature.locator('button:has-text("複製")')).toBeVisible();
    });

    test('署名作成ボタンが正しく動作する', async ({ page }) => {
        // 署名作成ボタンをクリック
        await page.click('button:has-text("新しい署名を作成")');

        // 署名作成フォームが表示される
        await expect(page.locator('[data-testid="signature-form"]')).toBeVisible();

        // フォームフィールドが表示される
        await expect(page.locator('input[placeholder*="署名名"]')).toBeVisible();
        await expect(page.locator('textarea[placeholder*="署名内容"]')).toBeVisible();
    });

    test('署名編集フォームが正しく表示される', async ({ page }) => {
        // 最初の署名の編集ボタンをクリック
        await page.click('[data-testid="signature-item"] button:has-text("編集")').first();

        // 編集フォームが表示される
        await expect(page.locator('[data-testid="signature-edit-form"]')).toBeVisible();

        // フォームフィールドに既存の値が入力される
        const nameInput = page.locator('input[placeholder*="署名名"]');
        await expect(nameInput).toHaveValue('デフォルト署名');
    });

    test('署名プレビューが正しく表示される', async ({ page }) => {
        // 署名プレビューエリアが表示される
        await expect(page.locator('[data-testid="signature-preview-area"]')).toBeVisible();

        // プレビューの内容が表示される
        await expect(page.locator('[data-testid="signature-preview-content"]')).toBeVisible();
    });

    test('署名の検索機能が正しく表示される', async ({ page }) => {
        // 検索ボックスが表示される
        const searchInput = page.locator('input[placeholder*="署名を検索"]');
        await expect(searchInput).toBeVisible();

        // 検索アイコンが表示される
        await expect(page.locator('[data-testid="search-icon"]')).toBeVisible();
    });

    test('署名のフィルター機能が正しく表示される', async ({ page }) => {
        // フィルターボタンが表示される
        await expect(page.locator('button:has-text("フィルター")')).toBeVisible();

        // フィルターボタンをクリック
        await page.click('button:has-text("フィルター")');

        // フィルターメニューが表示される
        await expect(page.locator('[data-testid="filter-dropdown"]')).toBeVisible();

        // フィルター項目が表示される
        await expect(page.locator('text=デフォルト署名のみ')).toBeVisible();
        await expect(page.locator('text=最近作成')).toBeVisible();
    });

    test('レスポンシブデザインが正しく適用される（デスクトップ）', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        // レイアウトが適切に表示される
        await expect(page.locator('[data-testid="signatures-layout"]')).toBeVisible();

        // 署名一覧が適切な幅で表示される
        const signatureList = page.locator('[data-testid="signature-list"]');
        await expect(signatureList).toBeVisible();
    });

    test('レスポンシブデザインが正しく適用される（モバイル）', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // 署名アイテムが適切に表示される
        const signatureItems = page.locator('[data-testid="signature-item"]');
        await expect(signatureItems.first()).toBeVisible();

        // アクションボタンが適切に表示される
        const actionButtons = page.locator('[data-testid="signature-item"] button');
        await expect(actionButtons.first()).toBeVisible();
    });

    test('署名の並び替え機能が正しく表示される', async ({ page }) => {
        // 並び替えボタンが表示される
        await expect(page.locator('button:has-text("並び替え")')).toBeVisible();

        // 並び替えボタンをクリック
        await page.click('button:has-text("並び替え")');

        // 並び替えメニューが表示される
        await expect(page.locator('[data-testid="sort-dropdown"]')).toBeVisible();

        // 並び替え項目が表示される
        await expect(page.locator('text=作成日時順')).toBeVisible();
        await expect(page.locator('text=名前順')).toBeVisible();
        await expect(page.locator('text=更新日時順')).toBeVisible();
    });

    test('署名の一括操作機能が正しく表示される', async ({ page }) => {
        // 一括選択チェックボックスが表示される
        await expect(page.locator('[data-testid="bulk-select-checkbox"]')).toBeVisible();

        // 一括操作ボタンが表示される
        await expect(page.locator('button:has-text("一括削除")')).toBeVisible();
        await expect(page.locator('button:has-text("一括複製")')).toBeVisible();
    });

    test('署名の統計情報が正しく表示される', async ({ page }) => {
        // 署名総数が表示される
        await expect(page.locator('text=署名総数: 3件')).toBeVisible();

        // デフォルト署名数が表示される
        await expect(page.locator('text=デフォルト署名: 1件')).toBeVisible();
    });

    test('アニメーションが正しく動作する', async ({ page }) => {
        // FadeInアニメーションが適用された要素が表示される
        await expect(page.locator('[data-testid="fade-in-header"]')).toBeVisible();
        await expect(page.locator('[data-testid="fade-in-signature-editor"]')).toBeVisible();
    });

    test('テーマが正しく適用される', async ({ page }) => {
        // ライトテーマが適用されている
        const body = page.locator('body');
        await expect(body).toHaveClass(/antialiased/);

        // カラーパレットが正しく適用されている
        const header = page.locator('h1:has-text("署名管理")');
        await expect(header).toHaveClass(/text-gray-900/);
    });
});
