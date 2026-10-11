import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Styled button. A native <button> is rendered inside, so type="submit" still submits
 * the surrounding <form>.
 */
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.block]': 'block()' },
  template: `
    <button
      [type]="type()"
      [class]="'btn btn--' + variant()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading()"
    >
      @if (loading()) {
        <span class="spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }
    :host(.block) {
      display: block;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      width: 100%;
      min-height: 2.75rem;
      padding: 0 var(--space-4);
      border-radius: var(--radius);
      border: 1px solid transparent;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .btn--primary {
      background: var(--color-primary);
      color: var(--color-primary-contrast);
    }
    .btn--primary:hover:not(:disabled) {
      background: var(--color-primary-hover);
    }
    .btn--secondary {
      background: var(--color-surface);
      color: var(--color-text);
      border-color: var(--color-border);
    }
    .btn--secondary:hover:not(:disabled) {
      background: var(--color-bg);
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class Button {
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<'primary' | 'secondary'>('primary');
  readonly loading = input(false);
  readonly disabled = input(false);
  /** Stretch to the full width of the container. */
  readonly block = input(true);
}
