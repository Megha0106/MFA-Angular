import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth.service';

/** Shell for signed-in pages: top bar plus content area. */
@Component({
  selector: 'app-portal-layout',
  imports: [RouterOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bar">
      <a class="bar__brand" routerLink="/dashboard">Customer Portal</a>
      <span class="bar__user">{{ auth.account?.name ?? auth.account?.username }}</span>
      <button class="bar__signout" type="button" (click)="auth.logout()">Sign out</button>
    </header>
    <main class="content">
      <router-outlet />
    </main>
  `,
  styles: `
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      padding: var(--space-3) var(--space-4);
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }
    .bar__brand {
      font-weight: 700;
      text-decoration: none;
    }
    .bar__user {
      margin-left: auto;
    }
    .bar__signout {
      font: inherit;
      padding: var(--space-2) var(--space-4);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
      color: var(--color-text);
    }
    .bar__signout:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .content {
      max-width: 64rem;
      margin: 0 auto;
      padding: var(--space-6) var(--space-4);
    }
  `,
})
export class PortalLayout {
  protected readonly auth = inject(AuthService);
}
