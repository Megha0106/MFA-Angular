import { Injectable, inject } from '@angular/core';
import { AccountInfo } from '@azure/msal-browser';
import { MsalService } from '@azure/msal-angular';

/** Thin wrapper around MSAL. Browser-only: never inject this during server rendering. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly msal = inject(MsalService);

  /** The signed-in user from MSAL's cache, or null. Includes name/username from the ID token. */
  get account(): AccountInfo | null {
    return this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0] ?? null;
  }

  get isLoggedIn(): boolean {
    return this.account !== null;
  }

  /**
   * Navigates the whole browser to Microsoft's sign-in page (password, consent, MFA happen there).
   * Microsoft redirects back to redirectUri, where the app initializer finishes the login.
   * `loginHint` just pre-fills the email on Microsoft's page.
   */
  login(loginHint?: string): void {
    void this.msal.loginRedirect({ scopes: ['user.read'], loginHint: loginHint || undefined });
  }

  /** Clears the local cache and ends the Microsoft session, then returns to postLogoutRedirectUri. */
  logout(): void {
    void this.msal.logoutRedirect({ account: this.account ?? undefined });
  }
}
