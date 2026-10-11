import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Centered shell shared by the register, login and MFA pages. */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="auth">
      <div class="auth__inner">
        <p class="auth__brand">Customer Portal</p>
        <router-outlet />
      </div>
    </main>
  `,
  styles: `
    .auth {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: var(--space-4);
    }
    .auth__inner {
      width: 100%;
      max-width: 26rem;
    }
    .auth__brand {
      text-align: center;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: var(--space-4);
    }
  `,
})
export class AuthLayout {}
