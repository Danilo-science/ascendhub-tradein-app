import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add product to cart and complete checkout', async ({ page }) => {
    // Browse products
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    
    // Click on first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();
    
    // Add to cart
    await page.click('button:has-text("Agregar al carrito")');
    
    // Verify cart notification
    await expect(page.locator('text=agregado al carrito')).toBeVisible();
    
    // Open cart
    await page.click('[data-testid="cart-button"]');
    await expect(page.locator('[data-testid="cart-sidebar"]')).toBeVisible();
    
    // Verify product in cart
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
    
    // Proceed to checkout
    await page.click('button:has-text("Proceder al pago")');
    
    // Fill checkout form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="name-input"]', 'Juan Pérez');
    await page.fill('[data-testid="address-input"]', 'Av. Corrientes 1234');
    await page.fill('[data-testid="city-input"]', 'Buenos Aires');
    await page.fill('[data-testid="phone-input"]', '+54 11 1234-5678');
    
    // Select payment method
    await page.click('[data-testid="payment-mercadopago"]');
    
    // Complete purchase
    await page.click('button:has-text("Finalizar compra")');
    
    // Verify success page
    await expect(page.locator('text=¡Compra realizada con éxito!')).toBeVisible();
  });

  test('should update cart quantities', async ({ page }) => {
    // Add product to cart
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();
    await page.click('button:has-text("Agregar al carrito")');
    
    // Open cart
    await page.click('[data-testid="cart-button"]');
    
    // Increase quantity
    await page.click('[data-testid="increase-quantity"]');
    
    // Verify quantity updated
    await expect(page.locator('[data-testid="item-quantity"]')).toHaveText('2');
    
    // Verify total updated
    const total = await page.locator('[data-testid="cart-total"]').textContent();
    expect(total).toContain('$');
  });

  test('should remove items from cart', async ({ page }) => {
    // Add product to cart
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();
    await page.click('button:has-text("Agregar al carrito")');
    
    // Open cart
    await page.click('[data-testid="cart-button"]');
    
    // Remove item
    await page.click('[data-testid="remove-item"]');
    
    // Verify cart is empty
    await expect(page.locator('text=Tu carrito está vacío')).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    // Click on Apple category
    await page.click('text=Apple');
    
    // Verify URL contains category filter
    await expect(page).toHaveURL(/.*category=apple/);
    
    // Verify only Apple products are shown
    const productCards = page.locator('[data-testid="product-card"]');
    const count = await productCards.count();
    
    for (let i = 0; i < count; i++) {
      const productCard = productCards.nth(i);
      await expect(productCard.locator('text=Apple')).toBeVisible();
    }
  });

  test('should search for products', async ({ page }) => {
    // Use search functionality
    await page.fill('[data-testid="search-input"]', 'iPhone');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // Verify search results
    const productCards = page.locator('[data-testid="product-card"]');
    const productCount = await productCards.count();
    expect(productCount).toBeGreaterThan(0);
    
    // Verify all results contain search term
    const productTitles = page.locator('[data-testid="product-title"]');
    const count = await productTitles.count();
    
    for (let i = 0; i < count; i++) {
      const title = await productTitles.nth(i).textContent();
      expect(title?.toLowerCase()).toContain('iphone');
    }
  });
});