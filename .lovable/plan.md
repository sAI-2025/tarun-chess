# Replace localStorage Auth with Supabase Auth

## Overview

Replace the insecure localStorage-based admin authentication with Supabase Auth. Keep the UI identical — only swap the underlying auth logic.

## Important Note About Credentials

The `.env` file is auto-managed by Lovable Cloud and must NOT be edited manually. The Supabase credentials shown (`VITE_SUPABASE_URL`, etc.) are already configured automatically. No credential changes needed.

## What Already Exists

- `admin_roles` table in the database
- `is_admin()` security-definer function
- `site_data` table with RLS policies using `is_admin()`
- Supabase client at `src/integrations/supabase/client.ts`

## Step 1: Create the first admin user

- Use a database migration to enable auto-confirm for initial setup, OR use Supabase Auth signup
- Insert an admin user into `auth.users` via an edge function or manual signup
- Add their `user_id` to `admin_roles` table

We will need to ask the user for the admin email/password they want to use, then create the user.

## Step 2: Update `AdminLogin` component (~lines 71-108)

Replace `validateAdmin()` with:

```typescript
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) { setError('Invalid credentials'); return; }
const { data: isAdmin } = await supabase.rpc('is_admin', { _user_id: data.user.id });
if (!isAdmin) { await supabase.auth.signOut(); setError('Not an admin'); return; }
onLogin();
```

## Step 3: Update `ChangeCredentialsSection` (~lines 112-169)

Replace localStorage password/email change with:

- Password update: `supabase.auth.updateUser({ password: newPassword })`
- Email update: `supabase.auth.updateUser({ email: newEmail })`
- Verify current password by re-signing in before allowing changes

## Step 4: Update `Admin` main component (~lines 1068-1073)

Replace `isAdminLoggedIn()` check with:

```typescript
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [loading, setLoading] = useState(true);
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      supabase.rpc('is_admin', { _user_id: data.session.user.id }).then(({ data: admin }) => {
        setIsLoggedIn(!!admin);
        setLoading(false);
      });
    } else { setLoading(false); }
  });
}, []);
```

## Step 5: Update logout (~line 989)

Replace `setAdminLoggedIn(false)` with `await supabase.auth.signOut()`

## Step 6: Clean up `src/lib/siteData.ts`

Remove all auth-related exports: `validateAdmin`, `isAdminLoggedIn`, `setAdminLoggedIn`, `getAdminPassword`, `setAdminPassword`, `getAdminEmail`, `setAdminEmail`, and the related constants.

## What Does NOT Change

- All admin panel UI (tabs, CRUD, drag-and-drop, draft/publish)
- Site data context and content management
- All public pages
- The `site_data` table and its RLS policies

**Note:** 

- Use the .env for  storing credintials on them
  &nbsp;