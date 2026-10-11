import {
  ApplicationConfig,
  PLATFORM_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
} from '@azure/msal-angular';
import { MSALGuardConfigFactory, MSALInstanceFactory } from './auth-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    // Runs before the router starts. Two jobs:
    //  1. initialize(): mandatory MSAL set-up.
    //  2. handleRedirectPromise(): when Microsoft sends the user back to us, the URL contains
    //     `#code=...`. This exchanges it for tokens and caches the account. It must finish
    //     before routing, otherwise the '' -> /login redirect would wipe the code from the URL.
    // Returns null when this page load was not a return from Microsoft.
    provideAppInitializer(async () => {
      if (!isPlatformBrowser(inject(PLATFORM_ID))) {
        return; // MSAL needs window/localStorage.
      }
      const msal = inject(MsalService).instance;
      await msal.initialize();
      const result = await msal.handleRedirectPromise();
      // Mark the signed-in user as "current" so getActiveAccount() works everywhere.
      const account = result?.account ?? msal.getAllAccounts()[0];
      if (account) {
        msal.setActiveAccount(account);
      }
    }),
  ],
};
