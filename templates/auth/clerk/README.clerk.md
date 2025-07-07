# Clerk Authentication Setup

This template includes Clerk authentication integration for your Next.js app.

## Environment Setup

1. Copy the environment variables from `env.clerk.example` to your `.env.local` file:
   ```bash
   cp env.clerk.example .env.local
   ```

2. Get your Clerk keys from the [Clerk Dashboard](https://dashboard.clerk.com/):
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Found in your app's API Keys section
   - `CLERK_SECRET_KEY`: Found in your app's API Keys section

## What's Included

### Authentication Pages
- `/sign-in` - Sign in page with email/password and OAuth
- `/sign-up` - Sign up page with email/password and OAuth
- `/dashboard` - Protected dashboard page (example)

### Components
- `SignInForm` - Customized Clerk SignIn component
- `SignUpForm` - Customized Clerk SignUp component
- `UserProfile` - User profile display with sign in/out buttons

### Middleware
- Route protection for `/dashboard`, `/profile`, `/settings`
- Automatic redirects for unauthenticated users

## Usage

### Protecting Routes
The middleware automatically protects routes matching these patterns:
- `/dashboard(.*)`
- `/profile(.*)`
- `/settings(.*)`

To protect additional routes, update the `isProtectedRoute` matcher in `middleware.ts`.

### Getting User Data
```tsx
// Server components
import { auth, currentUser } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId } = auth()
  const user = await currentUser()

  return <div>Hello {user?.firstName}!</div>
}

// Client components
import { useUser } from '@clerk/nextjs'

export default function Component() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded || !isSignedIn) return null

  return <div>Hello {user.firstName}!</div>
}
```

### Customizing Appearance
The SignIn and SignUp components include Tailwind CSS styling. You can customize the appearance by modifying the `appearance` prop in the component files.

## OAuth Providers

Clerk supports many OAuth providers. To enable them:

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to "Social Connections"
3. Enable the providers you want (Google, GitHub, Discord, etc.)
4. Configure the OAuth apps in your provider's dashboard
5. Add the redirect URLs as shown in Clerk

## Next Steps

- Customize the dashboard page in `app/dashboard/page.tsx`
- Add more protected routes as needed
- Configure additional OAuth providers
- Set up webhooks for user events (optional)
- Add user management features

## Documentation

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)