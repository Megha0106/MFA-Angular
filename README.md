# CustomerPortal

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.2.

## Authentication and MFA

Sign-in uses Microsoft Entra ID through MSAL (`@azure/msal-browser` and `@azure/msal-angular`) with the
redirect flow (OpenID Connect, authorization code with PKCE). **The app does not implement MFA itself.**
MFA is enforced by an Entra tenant policy on Microsoft's own sign-in page; the app only redirects there
and receives the result.

### Where the code lives

| File | Role |
| --- | --- |
| `src/app/auth-config.ts` | MSAL client settings (client ID, tenant, redirect URIs) and guard defaults |
| `src/app/app.config.ts` | Registers MSAL with DI; app initializer finishes the login before routing |
| `src/app/auth.service.ts` | `account`, `isLoggedIn`, `login()`, `logout()` |
| `src/app/app.routes.ts` | `MsalGuard` on `/dashboard` |
| `src/app/app.routes.server.ts` | Client-only rendering (MSAL needs `window`/`localStorage`) |
| `src/app/features/auth/login/` | "Sign in with Microsoft" button; sends signed-in users to `/dashboard` |
| `src/app/layouts/portal-layout/` | Shows the user's name and the Sign out button |

### Sign-in and MFA flow

1. The user clicks **Sign in with Microsoft**. `AuthService.login()` calls `loginRedirect`, and the browser
   navigates to `login.microsoftonline.com` (the app is unloaded).
2. Entra authenticates the user. This is where the following happen:
   - password entry
   - the one-time consent screen for the `user.read` scope
   - **MFA**, if a policy requires it: Microsoft Authenticator push approval (with number matching), or
     SMS/phone. First-time users are asked to register a method.
3. Entra redirects back to `http://localhost:4200/#code=...`, and the Angular app boots again.
4. The app initializer in `app.config.ts` runs before the router: `initialize()`, then
   `handleRedirectPromise()` exchanges the code for tokens and caches them in localStorage, then
   `setActiveAccount()` marks the user as current. It must finish before routing, otherwise the
   `'' -> /login` redirect would drop the code from the URL.
5. The router starts. `Login` sees the user is signed in and navigates to `/dashboard`. `MsalGuard` allows it
   because an account exists. A user who opens `/dashboard` without a session is sent to Microsoft by the guard.
6. **Sign out** calls `logoutRedirect`, which clears the cache and ends the Microsoft session.

### Enabling MFA in Entra (not part of this repo)

Without a policy Entra only asks for the password, and the user goes straight to the dashboard. Enable one of:

- **Security defaults** (free): Entra admin center -> Entra ID -> Overview -> Properties -> Manage security
  defaults -> Enabled.
- **Conditional Access** (needs Entra ID P1, recommended): Protection -> Conditional Access -> New policy.
  Target the users and this app registration, then under Grant choose *Require multifactor authentication*.
- **Per-user MFA** (legacy): Users -> Per-user MFA -> Enable.

To verify, sign out, sign in again (a private window helps, since sessions are cached), and decode the ID token
at https://jwt.ms. The `amr` claim should include `"mfa"` (without MFA it shows only `"pwd"`).

### Entra app registration requirements

- Platform: **Single-page application** (not Web).
- Redirect URI: `http://localhost:4200` for local development, and the production URL when deployed. It must
  exactly match `window.location.origin`.
- Delegated permission: `User.Read` (Microsoft Graph).

### Limitations

- `MsalGuard` runs in the browser, so it protects the UI only. Any backend API must validate the access token
  itself, and can check `amr` for `mfa` if MFA must be guaranteed.
- The `register` and `mfa-verify` screens are not connected to Entra.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
