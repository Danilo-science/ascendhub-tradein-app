import { test, expect } from '@playwright/test';

test.describe('Trade-in Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full trade-in flow', async ({ page }) => {
    // Navigate to trade-in page
    await page.click('text=Trade-in');
    await expect(page).toHaveURL(/.*trade-in/);
    
    // Fill trade-in form
    await page.selectOption('[data-testid="category-select"]', 'smartphone');
    await page.selectOption('[data-testid="brand-select"]', 'Apple');
    await page.selectOption('[data-testid="model-select"]', 'iPhone 14');
    await page.selectOption('[data-testid="condition-select"]', 'excelente');
    
    // Upload images (mock file upload)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'device-photo.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data')
    });
    
    // Submit form
    await page.click('button:has-text("Obtener cotización")');
    
    // Verify success message
    await expect(page.locator('text=Cotización enviada exitosamente')).toBeVisible();
    
    // Verify estimated value is displayed
    await expect(page.locator('[data-testid="estimated-value"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/trade-in');
    
    // Try to submit empty form
    await page.click('button:has-text("Obtener cotización")');
    
    // Check for validation errors
    await expect(page.locator('text=Por favor completa todos los campos')).toBeVisible();
  });

  test('should update models based on selected brand', async ({ page }) => {
    await page.goto('/trade-in');
    
    // Select Apple brand
    await page.selectOption('[data-testid="brand-select"]', 'Apple');
    
    // Verify iPhone models are available
    const modelSelect = page.locator('[data-testid="model-select"]');
    await expect(modelSelect.locator('option:has-text("iPhone 14")')).toBeVisible();
    await expect(modelSelect.locator('option:has-text("iPhone 13")')).toBeVisible();
    
    // Select Samsung brand
    await page.selectOption('[data-testid="brand-select"]', 'Samsung');
    
    // Verify Samsung models are available
    await expect(modelSelect.locator('option:has-text("Galaxy S23")')).toBeVisible();
  });
});