import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AlertVariant = 'info' | 'success' | 'error';

/** Message banner. Errors are announced assertively to screen readers. */
@Component({
  selector: 'app-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"alert alert--" + variant()',
    '[attr.role]': 'role()',
  },
  template: '<ng-content />',
  styles: `
    :host {
      display: block;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius);
      border: 1px solid currentColor;
      font-size: 0.9rem;
      margin-bottom: var(--space-4);
    }
    :host(.alert--info) {
      color: var(--color-info);
      background: var(--color-info-bg);
    }
    :host(.alert--success) {
      color: var(--color-success);
      background: var(--color-success-bg);
    }
    :host(.alert--error) {
      color: var(--color-danger);
      background: var(--color-danger-bg);
    }
  `,
})
export class Alert {
  readonly variant = input<AlertVariant>('info');
  protected readonly role = computed(() => (this.variant() === 'error' ? 'alert' : 'status'));
}
