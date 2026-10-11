import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Rounded surface used to group content. Content is projected via <ng-content>. */
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styles: `
    :host {
      display: block;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow);
      padding: var(--space-6);
    }
  `,
})
export class Card {}
