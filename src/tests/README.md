# Testing Documentation

## Overview

This directory contains comprehensive tests for the HatsuSound Frontend application, ensuring code quality and reliability through automated testing.

## Test Structure

```
src/tests/
├── setup.ts                          # Jest configuration and test setup
├── index.ts                          # Test exports
├── __mocks__/                        # Mock data and services
│   └── checkout.mock.ts             # Checkout-related mocks
├── services/                         # Service layer tests
│   └── checkout.service.test.ts     # Checkout service tests
├── hooks/                           # Custom hook tests
│   └── useCheckout.test.ts          # useCheckout hook tests
├── components/                      # Component tests
│   └── checkout/                    # Checkout component tests
│       └── CheckoutModal.test.tsx   # CheckoutModal component tests
└── utils/                           # Utility function tests
    └── checkout.utils.test.ts       # Checkout utility tests
```

## Running Tests

### All Tests
```bash
npm test
```

### Tests with Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

### Specific Test File
```bash
npm test -- --testPathPattern=checkout.service.test.ts
```

### Tests Matching Pattern
```bash
npm test -- --testNamePattern="should validate"
```

## Test Coverage

Our testing strategy aims for **>80% code coverage** across all critical components:

- **Services**: 100% coverage for business logic
- **Hooks**: 100% coverage for state management
- **Components**: 90%+ coverage for user interactions
- **Utilities**: 100% coverage for helper functions

## Test Categories

### 1. Unit Tests
- **Services**: Test business logic in isolation
- **Utilities**: Test helper functions with various inputs
- **Hooks**: Test custom React hooks

### 2. Component Tests
- **Rendering**: Verify components render correctly
- **User Interactions**: Test button clicks, form submissions
- **State Changes**: Verify component state updates
- **Error Handling**: Test error scenarios and edge cases

### 3. Integration Tests
- **Hook + Service**: Test hook integration with services
- **Component + Hook**: Test component integration with hooks

## Testing Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow the pattern: "should [expected behavior] when [condition]"

### 2. Mocking Strategy
- Mock external dependencies (APIs, services)
- Use consistent mock data across tests
- Reset mocks between tests to avoid interference

### 3. Assertions
- Test one concept per test case
- Use specific assertions (e.g., `toBe` vs `toEqual`)
- Verify both positive and negative scenarios

### 4. Async Testing
- Use `async/await` for asynchronous operations
- Wrap state changes in `act()` when testing React components
- Use `waitFor()` for assertions that depend on async operations

## Mock Data

### Checkout Mocks
Located in `__mocks__/checkout.mock.ts`:

- `mockCheckoutData`: Valid checkout form data
- `mockCheckoutResponse`: Successful checkout response
- `mockCartItems`: Sample cart items for testing

### Usage Example
```typescript
import { mockCheckoutData, mockCheckoutResponse } from '../__mocks__/checkout.mock';

// Use in tests
expect(mockCheckoutData.email).toBe('test@example.com');
```

## Common Test Patterns

### Testing React Components
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    
    await user.click(screen.getByRole('button'));
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

### Testing Custom Hooks
```typescript
import { renderHook, act } from '@testing-library/react';

describe('useCustomHook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe(initialValue);
  });

  it('should update state', async () => {
    const { result } = renderHook(() => useCustomHook());
    
    await act(async () => {
      await result.current.updateValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
```

### Testing Services
```typescript
import { CheckoutService } from '../services/checkout.service';

jest.mock('../services/checkout.service');
const mockService = CheckoutService as jest.MockedClass<typeof CheckoutService>;

describe('CheckoutService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process checkout successfully', async () => {
    mockService.prototype.processCheckout.mockResolvedValue(mockResponse);
    
    const service = new CheckoutService();
    const result = await service.processCheckout(mockData);
    
    expect(result).toEqual(mockResponse);
    expect(mockService.prototype.processCheckout).toHaveBeenCalledWith(mockData);
  });
});
```

## Debugging Tests

### Verbose Output
```bash
npm test -- --verbose
```

### Debug Specific Test
```bash
npm test -- --testNamePattern="should validate email" --verbose
```

### Coverage Report
```bash
npm run test:coverage
# Opens coverage report in browser
```

## Continuous Integration

Tests are automatically run on:
- **Pull Requests**: All tests must pass
- **Main Branch**: Coverage reports are generated
- **Deployments**: Tests run before deployment

## Troubleshooting

### Common Issues

1. **Mock not working**: Ensure mocks are imported before components
2. **Async test failures**: Wrap state changes in `act()`
3. **Component not rendering**: Check if required props are provided
4. **Service calls not mocked**: Verify mock setup in `beforeEach`

### Getting Help

- Check Jest documentation: https://jestjs.io/
- Review React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Consult team members for complex testing scenarios

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Ensure >80% coverage for new code
3. Add appropriate mocks for external dependencies
4. Test both success and failure scenarios
5. Update this README if adding new test categories
