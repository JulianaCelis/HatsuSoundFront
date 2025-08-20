# Testing Structure and Guidelines

## Overview

This directory contains comprehensive unit tests for the checkout system, following best practices and ensuring >80% code coverage as required by the technical test.

## Directory Structure

```
src/tests/
├── __mocks__/                    # Mock files for static assets
│   └── fileMock.js              # Mock for CSS, images, etc.
├── components/                   # Component tests
│   └── checkout/
│       └── CheckoutModal.test.tsx
├── hooks/                       # Hook tests
│   └── useCheckout.test.ts
├── services/                    # Service tests
│   └── checkout.service.test.ts
├── utils/                       # Utility function tests
│   └── checkout.utils.test.ts
├── setup.ts                     # Jest setup and global mocks
├── index.ts                     # Test exports
└── README.md                    # This file
```

## Test Categories

### 1. Service Tests (`services/`)
- **checkout.service.test.ts**: Tests for the main checkout service
  - API integration tests
  - Error handling
  - Network failures
  - Response validation

### 2. Hook Tests (`hooks/`)
- **useCheckout.test.ts**: Tests for the useCheckout custom hook
  - State management
  - Form validation
  - Step navigation
  - Integration with services

### 3. Component Tests (`components/`)
- **CheckoutModal.test.tsx**: Tests for the main checkout modal
  - Rendering tests
  - User interactions
  - Props handling
  - Responsive behavior

### 4. Utility Tests (`utils/`)
- **checkout.utils.test.ts**: Tests for validation and calculation functions
  - Credit card validation (Luhn algorithm)
  - CVC validation
  - Expiry date validation
  - Price formatting
  - Summary calculations

## Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Running Specific Tests
```bash
# Run tests for a specific file
npm test -- checkout.service.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="Credit Card Validation"

# Run tests in a specific directory
npm test -- --testPathPattern="services"
```

## Test Coverage Requirements

The technical test requires **>80% code coverage** across:
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Current Coverage Targets
- **CheckoutService**: 95%+ (API methods, validation logic)
- **useCheckout Hook**: 90%+ (state management, form handling)
- **CheckoutModal Component**: 85%+ (UI rendering, user interactions)
- **Utility Functions**: 95%+ (validation algorithms, calculations)

## Testing Best Practices

### 1. Test Structure
```typescript
describe('ComponentName', () => {
  const defaultProps = { /* ... */ };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render correctly', () => {
      // Test implementation
    });
  });

  describe('User Interactions', () => {
    it('should handle user input', () => {
      // Test implementation
    });
  });
});
```

### 2. Mocking Strategy
- **Services**: Mock external API calls
- **Contexts**: Mock React contexts (Auth, Cart)
- **Browser APIs**: Mock localStorage, fetch, etc.
- **Static Assets**: Mock CSS, images, fonts

### 3. Assertion Patterns
```typescript
// Component rendering
expect(screen.getByText('Expected Text')).toBeInTheDocument();

// User interactions
expect(mockFunction).toHaveBeenCalledWith(expectedArgs);

// State changes
expect(result.current.state).toBe(expectedValue);

// Error handling
await expect(asyncFunction()).rejects.toThrow('Expected error');
```

## Mock Data

### Test Cart Data
```typescript
const mockCart = {
  items: [
    {
      product: {
        id: 'test_album_001',
        title: 'HatsuSound Vol. 1 - Test',
        artist: 'HatsuSound Collective',
        genre: 'electronic',
        format: 'mp3',
        price: 15.99,
        stock: 100
      },
      quantity: 1
    }
  ],
  total: 15.99
};
```

### Test User Data
```typescript
const mockUser = {
  id: 'user123',
  email: 'test@example.com',
  name: 'Test User'
};
```

### Test Credit Card Data
```typescript
const testCardData = {
  number: '4242424242424242', // Valid VISA test card
  cvc: '123',
  expMonth: '12',
  expYear: '2025',
  cardHolderName: 'Test User'
};
```

## Integration Testing

### API Integration Tests
- Mock fetch responses
- Test error scenarios
- Validate request payloads
- Test authentication headers

### Context Integration Tests
- Test hook integration with contexts
- Validate state synchronization
- Test error propagation

## Performance Testing

### Component Rendering
- Test render performance
- Validate memory usage
- Test large data sets

### Hook Performance
- Test state update performance
- Validate effect dependencies
- Test memory leaks

## Accessibility Testing

### Screen Reader Support
- Test ARIA labels
- Validate keyboard navigation
- Test focus management

### Mobile Responsiveness
- Test touch interactions
- Validate responsive breakpoints
- Test mobile-specific features

## Continuous Integration

### GitHub Actions
```yaml
- name: Run Tests
  run: npm run test:ci

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### Coverage Reports
- HTML coverage reports in `coverage/` directory
- LCOV format for CI integration
- Coverage thresholds enforcement

## Troubleshooting

### Common Issues

#### 1. Mock Import Errors
```typescript
// Ensure mocks are properly configured
jest.mock('../../services/checkout.service');
```

#### 2. Context Mocking Issues
```typescript
// Mock React contexts properly
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn()
}));
```

#### 3. Async Test Failures
```typescript
// Use proper async/await patterns
await act(async () => {
  await result.current.processCheckout();
});
```

#### 4. Coverage Issues
```bash
# Check coverage configuration
npm run test:coverage

# Verify threshold settings in jest.config.js
```

## Future Enhancements

### Planned Test Additions
- **E2E Tests**: Cypress or Playwright integration
- **Visual Regression Tests**: Storybook + Chromatic
- **Performance Tests**: Lighthouse CI integration
- **Security Tests**: OWASP compliance validation

### Test Automation
- **Auto-testing**: Pre-commit hooks
- **Test Generation**: AI-powered test creation
- **Coverage Monitoring**: Real-time coverage tracking

## Contributing

### Adding New Tests
1. Follow the existing test structure
2. Ensure >80% coverage for new code
3. Add comprehensive edge case testing
4. Update this README with new test information

### Test Review Process
1. All tests must pass locally
2. Coverage thresholds must be met
3. Tests must follow established patterns
4. Edge cases must be covered

## Resources

### Testing Libraries
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro/)

### Best Practices
- [Kent C. Dodds Testing Blog](https://kentcdodds.com/blog/write-tests)
- [React Testing Best Practices](https://reactjs.org/docs/testing.html)
- [Jest Best Practices](https://jestjs.io/docs/best-practices)
