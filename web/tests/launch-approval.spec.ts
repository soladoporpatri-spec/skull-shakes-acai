import { expect, test } from '@playwright/test';

test('aprovação exige pedido realmente enviado em celular e desktop', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Ver cardápio' }).click();
    await page.getByRole('button', { name: 'Adicionar' }).first().click();
    await page.getByRole('button', { name: /Carrinho de compras com 1 item/ }).click();
    await expect(page.getByLabel('CEP'), 'O checkout só aparece quando todas as condições de lançamento foram atendidas').toBeVisible();
    await page.getByLabel('CEP').fill('75090-465');
    await page.getByLabel('Rua / Avenida').fill('Rua de teste');
    await page.getByLabel('Número').fill('25');
    await page.getByLabel('Bairro').fill('Bairro de teste');
    await page.getByLabel('Cidade').fill('Anápolis');
    await page.getByLabel('Estado').fill('GO');
    await page.getByLabel('Nome do Recebedor').fill('Cliente de teste');
    await page.getByLabel('Telefone do Recebedor').fill('62999999999');
    await expect(page.getByRole('button', { name: 'Confirmar pedido' })).toBeEnabled();
    const [response] = await Promise.all([
        page.waitForResponse((candidate) => /\/pedidos$/.test(new URL(candidate.url()).pathname) && candidate.request().method() === 'POST'),
        page.getByRole('button', { name: 'Confirmar pedido' }).click(),
    ]);
    expect(response.ok()).toBeTruthy();
    const order = await response.json();
    expect(order.id).toBeTruthy();
    await expect(page.getByText(`Pedido #${order.id} confirmado`)).toBeVisible();
});
