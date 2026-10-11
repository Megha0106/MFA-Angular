import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
} from '@azure/msal-browser';
import { MsalGuardConfiguration } from '@azure/msal-angular';

/**
 * Creates the MSAL client: the object that talks to Microsoft Entra.
 * Registered in app.config.ts under the MSAL_INSTANCE token.
 * Uses `window`, so it must only be created in the browser (never during SSR).
 */
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '<CLINET_ID>',                               // Application (client) ID from Part B
      authority: 'https://login.microsoftonline.com/<TENANT_ID>', // Directory (tenant) ID
      redirectUri: window.location.origin,                      // must EXACTLY match a SPA redirect URI registered in Entra
      postLogoutRedirectUri: window.location.origin,
    },
    // Tokens and accounts are cached in localStorage, so the session survives page reloads.
    cache: { cacheLocation: BrowserCacheLocation.LocalStorage },
  });
}

/**
 * Defaults used by MsalGuard when it has to sign the user in
 * (e.g. someone opens /dashboard without a session).
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,                  // use full-page redirect, not popup
    authRequest: { scopes: ['user.read'] },
  };
}
