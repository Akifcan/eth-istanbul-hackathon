# Development Guidelines

## What is Sway?

Sway is a **web3-based platform that enables users to purchase products in bulk at lower prices.** Users can perform secure, fast, and transparent bulk purchases through blockchain-based operations and smart contract infrastructure.

## Key Features
- **Web3 & Smart Contracts:** All transactions are secure and transparent on the blockchain.
- **Bulk Purchase Optimization:** Users save money by purchasing products in bulk.
- **Wallet Integration:** Connect wallets (MetaMask, WalletConnect, etc.) for fast and secure transactions.
- **Dark Mode Friendly UI:** Modern, dark-themed designs compatible with the Web3 ecosystem.
- **Marketplace Functionalities:** Purchase/sale management, order tracking, bids, and user interactions.
- **Analytics & Reporting:** Track buying trends and price optimization insights.
- **Security & Compliance:** Blockchain-based data integrity and user safety.

## Conditional UI States

Do not use **inline JSX** for rendering conditional UI states such as loading, error, or pending.

Always use **clean control flow** patterns:

```
// ❌ Avoid
{isError && <ErrorComponent />}
{isLoading && <LoadingComponent />}
{!isLoading && !isError && <Content />}

// ✅ Prefer
if (isError) {
  return <ErrorComponent />;
}

if (isLoading) {
  return <LoadingComponent />;
}

return <Content />;
```

## Component Architecture

- Do not define JSX-returning components inside other components.
- Each component should be in its own file and imported when needed.

```
// ❌ Incorrect
const ParentComponent = () => {
  const ChildComponent = () => {
    return <div>Child</div>; // Avoid
  };
  return <div><ChildComponent /></div>;
};

// ✅ Correct
// Define ChildComponent in a separate ChildComponent.tsx file and import it
```

## 📁 Code Organization

### Type Definitions

- Keep all custom type and interface definitions inside the @types/ directory.
- Do not define inline types within component files.
- Properly categorize interfaces and types.

```
// ✅ @types/user.ts
export interface User {
  id: string;
  name: string;
}

// ✅ In a component file
import { User } from '@types/user';
```

## File Structure
- Remove unused imports.
- Delete unused files.
- Optimize project size and performance.
- Always use kebab-case for file names.

```
// ❌ Avoid
UserProfile.tsx
userProfile.tsx
user_profile.tsx

// ✅ Prefer
user-profile.tsx
api-client.ts
auth-context.tsx
```

- Place all custom hooks in the **/hooks** directory:

```
hooks/
├── use-auth.ts
├── use-local-storage.ts
├── use-api.ts
└── use-debounce.ts
```

## 🌐 API Request Handling

- Always use react-query / @tanstack/react-query and axios for API requests.


```
const { data, isLoading, isError, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers()
});

if (isLoading) {
  return <Skeleton />; // Show skeleton during loading
}

if (isError) {
  return <ErrorMessage message={error.message} />; // Display error message
}

return (
  <UserList users={data} />
);
```

```
const mutation = useMutation({
  mutationFn: (userData) => createUser(userData),
  onSuccess: () => {
    // Actions to perform on success
  },
  onError: (error) => {
    // Actions to perform on error
  },
  isLoading: false // Use loading state in the UI as needed
});
```

## ℹ️ Additional Notes

- **isLoading:** Show Skeleton, Spinner, LoadingText, or a similar component while API call is in progress.
- **isError:** Display a meaningful error message when an API call fails.
- **isSuccess:** Perform actions like showing a toast, redirecting, or refetching data after a successful response.

## ♿ Accessibility & Semantic HTML

- Use appropriate HTML tags for interactive elements.
- Write screen reader and SEO-friendly code.

```
// ❌ Avoid
<div onClick={handleClick}>Click Me</div>
<span onClick={handleClick}>Button</span>

// ✅ Prefer
<button onClick={handleClick}>Click Me</button>
<Link href="/page">Go to Page</Link>
<nav>, <header>, <main>, <section> // Use meaningful containers
```

## ARIA Attributes

- Add aria-* attributes where necessary:

```
<button aria-label="Close modal" onClick={handleClose}>✕</button>
<div role="alert" aria-live="assertive">Error message</div>
<input type="text" aria-describedby="help-text" />
<span id="help-text">Enter your email address</span>
```

## 🔄 State Management

- Use Zustand for state management.
- Place all Zustand stores in the /store directory.

## ✅ Design Guideline Addition

- All designs should be **web3 & dark theme friendly**, tailored for **marketplace and bulk purchase scenarios**, reflecting a professional tone, sector-specific terminology, and visual language (e.g., marketplace flows, wallet integration, transaction dashboards, group buying processes).

- Use shadcn/ui components wherever possible for UI consistency and accessibility.

## Icon Library

- Replace Heroicons with Lucide React icons:

```
// ❌ Avoid Heroicons
import { UserIcon } from '@heroicons/react/24/outline';

// ✅ Use Lucide React
import { User } from 'lucide-react';
```
- do not use any gradients while styling always head with solid colors