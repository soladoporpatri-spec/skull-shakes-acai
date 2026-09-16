import { expect, test } from '@playwright/test';

test('a ação principal aparece na primeira tela e funciona pelo teclado', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('button', { name: 'Ver cardápio' });
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    await cta.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Cardápio.' })).toBeInViewport();
    await expect(page.getByText('Funcionamento: 13h às 22h')).toBeVisible();
    await expect(page.getByRole('link', { name: 'WhatsApp: 62 99883-2935' })).toHaveAttribute('href', 'https://wa.me/5562998832935');

    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).not.toMatch(/user-scalable=no|maximum-scale=1/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('o caminho de compra preserva o carrinho e não confirma um pedido inexistente', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Ver cardápio' }).click();
    await page.getByRole('button', { name: 'Montar' }).click();
    await page.getByRole('button', { name: /Banana/ }).click();
    await expect(page.getByRole('button', { name: 'Adicionar' }).first().locator('..')).toContainText('R$ 20,00');
    await page.getByRole('button', { name: 'Adicionar' }).first().click();
    await page.getByRole('button', { name: /Carrinho de compras com 1 item/ }).click();
    await expect(page.getByRole('heading', { name: 'Resumo do Pedido' })).toBeVisible();
    await expect(page.getByText('SS Tradicional 1', { exact: true }).last()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled();
    await expect(page.getByRole('status')).toContainText('O pedido ainda não pode ser enviado');
    await expect(page.getByText('PEDIDO PREPARADO!')).toHaveCount(0);
});

test('a segunda opção do tradicional acrescenta R$ 3 ao preço', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Ver cardápio' }).click();
    await page.getByRole('button', { name: 'Montar' }).click();
    await page.getByRole('button', { name: /Banana/ }).click();
    await page.locator('button[aria-pressed]').filter({ hasText: 'Morango' }).click();
    await expect(page.getByRole('button', { name: 'Adicionar' }).first().locator('..')).toContainText('R$ 23,00');
    await page.getByRole('button', { name: 'Adicionar' }).first().click();
    await page.getByRole('button', { name: /Carrinho de compras com 1 item/ }).click();
    await expect(page.getByText('Subtotal').locator('..')).toContainText('R$ 23,00');
});
