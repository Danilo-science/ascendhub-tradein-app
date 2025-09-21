# Guía de Testing - AscendHub Trade-in Flow

## 🧪 Introducción

Esta guía detalla la estrategia de testing implementada en AscendHub Trade-in Flow, incluyendo configuración, mejores prácticas y coverage reports.

## 🛠️ Stack de Testing

### Herramientas Principales

- **Vitest** - Test runner moderno y rápido
- **@testing-library/react** - Testing utilities para React
- **@testing-library/jest-dom** - Matchers adicionales
- **@vitest/coverage-v8** - Coverage reports con V8
- **jsdom** - DOM environment para tests

### Configuración

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});
```

## 📁 Estructura de Tests

```
src/test/
├── setup.ts                    # Configuración global
├── utils.tsx                   # Utilidades de testing
├── components/                 # Tests de componentes
│   ├── Navigation.test.tsx
│   └── PWAInstallBanner.test.tsx
├── contexts/                   # Tests de contextos
├── lib/                       # Tests de utilidades
│   └── pwa.test.ts
├── pages/                     # Tests de páginas
└── utils/                     # Utilidades específicas
```

## 🎯 Tipos de Tests Implementados

### 1. Component Tests

**Ejemplo: Navigation.test.tsx**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Navigation', () => {
  it('renders navigation items correctly', () => {
    render(<Navigation />, { wrapper: NavigationWrapper });
    
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Electrónicos')).toBeInTheDocument();
  });

  it('handles mobile menu toggle', () => {
    render(<Navigation />, { wrapper: NavigationWrapper });
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    expect(screen.getByRole('navigation')).toHaveClass('mobile-open');
  });
});
```

### 2. PWA Tests

**Ejemplo: pwa.test.ts**

```typescript
import { pwaManager } from '@/lib/pwa';

// Mocks
const mockServiceWorker = {
  register: vi.fn(),
  ready: Promise.resolve({
    update: vi.fn(),
    unregister: vi.fn()
  })
};

Object.defineProperty(navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true
});

describe('PWA Manager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('detects PWA installation capability', () => {
    const isInstallable = pwaManager.isInstallable();
    expect(typeof isInstallable).toBe('boolean');
  });

  it('handles install prompt correctly', async () => {
    const mockPrompt = {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };
    
    // Simular evento beforeinstallprompt
    window.dispatchEvent(
      new CustomEvent('beforeinstallprompt', { detail: mockPrompt })
    );
    
    await pwaManager.promptInstall();
    expect(mockPrompt.prompt).toHaveBeenCalled();
  });
});
```

### 3. Integration Tests

**Ejemplo: Shopping Flow**

```typescript
describe('Shopping Flow Integration', () => {
  it('completes full shopping journey', async () => {
    render(<App />);
    
    // Navegar a productos
    fireEvent.click(screen.getByText('Electrónicos'));
    
    // Agregar producto al carrito
    const addButton = await screen.findByText('Agregar al Carrito');
    fireEvent.click(addButton);
    
    // Verificar carrito
    expect(screen.getByText('1')).toBeInTheDocument(); // Cart counter
    
    // Proceder al checkout
    fireEvent.click(screen.getByText('Ver Carrito'));
    fireEvent.click(screen.getByText('Proceder al Pago'));
    
    // Verificar redirección
    expect(window.location.pathname).toBe('/cart');
  });
});
```

## 📊 Coverage Reports

### Configuración de Thresholds

```typescript
coverage: {
  thresholds: {
    global: {
      branches: 80,    // Cobertura de ramas
      functions: 80,   // Cobertura de funciones
      lines: 80,       // Cobertura de líneas
      statements: 80   // Cobertura de declaraciones
    },
    // Thresholds específicos por archivo
    './src/lib/pwa.ts': {
      branches: 90,
      functions: 95,
      lines: 90,
      statements: 90
    }
  }
}
```

### Reportes Generados

1. **Console Report** - Resumen en terminal
2. **HTML Report** - Interfaz web interactiva
3. **JSON Report** - Datos para CI/CD
4. **LCOV Report** - Compatible con herramientas externas

### Comandos de Coverage

```bash
# Coverage completo
npm run test:coverage

# Coverage específico
npm run test:coverage -- src/components/

# Coverage con threshold específico
npm run test:coverage -- --coverage.thresholds.global.lines=90

# Generar solo reporte HTML
npm run test:coverage -- --coverage.reporter=html
```

## 🎭 Mocking Strategies

### 1. External Dependencies

```typescript
// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' })
}));

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon" />,
  Search: () => <div data-testid="search-icon" />,
  ShoppingCart: () => <div data-testid="cart-icon" />
}));
```

### 2. Browser APIs

```typescript
// Mock de Service Worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn(() => Promise.resolve()),
    ready: Promise.resolve({
      update: vi.fn(),
      unregister: vi.fn()
    })
  }
});

// Mock de Notification API
Object.defineProperty(window, 'Notification', {
  value: vi.fn().mockImplementation((title, options) => ({
    title,
    ...options,
    close: vi.fn()
  }))
});

// Mock de localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
});
```

### 3. Context Providers

```typescript
// Mock de CartContext
const mockCartContext = {
  items: [],
  addItem: vi.fn(),
  removeItem: vi.fn(),
  clearCart: vi.fn(),
  total: 0
};

vi.mock('@/contexts/CartContext', () => ({
  useCart: () => mockCartContext,
  CartProvider: ({ children }: { children: React.ReactNode }) => children
}));
```

## 🔧 Utilidades de Testing

### Custom Render

```typescript
// src/test/utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <CartProvider>
        {children}
      </CartProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Test Helpers

```typescript
// src/test/utils/helpers.ts
export const waitForLoadingToFinish = () => 
  waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
};

export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};
```

## 🚀 Mejores Prácticas

### 1. Naming Conventions

```typescript
// ✅ Descriptivo y específico
describe('Navigation Component', () => {
  describe('when user is authenticated', () => {
    it('should display user menu with logout option', () => {
      // test implementation
    });
  });
  
  describe('when user is not authenticated', () => {
    it('should display login and register links', () => {
      // test implementation
    });
  });
});

// ❌ Vago y genérico
describe('Navigation', () => {
  it('works', () => {
    // test implementation
  });
});
```

### 2. Test Structure (AAA Pattern)

```typescript
it('should update cart count when item is added', () => {
  // Arrange
  const mockProduct = { id: '1', name: 'iPhone', price: 999 };
  render(<ProductCard product={mockProduct} />);
  
  // Act
  fireEvent.click(screen.getByText('Add to Cart'));
  
  // Assert
  expect(screen.getByText('Added to Cart')).toBeInTheDocument();
});
```

### 3. Async Testing

```typescript
it('should load products from API', async () => {
  // Mock API response
  const mockProducts = [{ id: '1', name: 'iPhone' }];
  vi.mocked(fetchProducts).mockResolvedValue(mockProducts);
  
  render(<ProductGrid />);
  
  // Wait for async operation
  await waitFor(() => {
    expect(screen.getByText('iPhone')).toBeInTheDocument();
  });
  
  // Verify API was called
  expect(fetchProducts).toHaveBeenCalledTimes(1);
});
```

### 4. Error Boundary Testing

```typescript
it('should handle component errors gracefully', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };
  
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  
  consoleSpy.mockRestore();
});
```

## 📈 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Quality Gates

```typescript
// vitest.config.ts
coverage: {
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  // Fallar build si no se cumple threshold
  skipFull: false
}
```

## 🐛 Debugging Tests

### VS Code Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Vitest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debug Commands

```bash
# Debug test específico
npm run test -- --reporter=verbose src/components/Navigation.test.tsx

# Debug con breakpoints
npm run test:debug

# Watch mode para desarrollo
npm run test:watch

# UI mode para debugging visual
npm run test:ui
```

## 📋 Checklist de Testing

### Antes de Commit

- [ ] Todos los tests pasan
- [ ] Coverage mínimo del 80%
- [ ] No hay tests skipped sin justificación
- [ ] Mocks están correctamente configurados
- [ ] Tests son determinísticos (no flaky)

### Code Review

- [ ] Tests cubren casos edge
- [ ] Nombres de tests son descriptivos
- [ ] Setup y teardown correctos
- [ ] No hay código duplicado en tests
- [ ] Assertions son específicas y claras

### Performance

- [ ] Tests ejecutan en <30 segundos
- [ ] Mocks minimizan dependencias externas
- [ ] Parallel execution habilitado
- [ ] Cache de tests configurado

---

**Última actualización:** Septiembre 2024  
**Framework:** Vitest 1.0+  
**Coverage Target:** 80%+ global