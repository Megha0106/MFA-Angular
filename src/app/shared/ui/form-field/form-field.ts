import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { startWith, switchMap } from 'rxjs';

const DEFAULT_MESSAGES: Record<string, string> = {
  required: 'This field is required.',
  email: 'Enter a valid email address.',
  minlength: 'This value is too short.',
  pattern: 'This value has an invalid format.',
  passwordStrength: 'Use upper and lower case letters and at least one number.',
  mismatch: 'Values do not match.',
};

/**
 * Label + input + hint + validation message in one reusable control.
 * Pass an existing FormControl; errors appear once the control is touched or dirty.
 */
@Component({
  selector: 'app-form-field',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField {
  readonly control = input.required<FormControl<string>>();
  readonly label = input.required<string>();
  /** Unique id; also used to link the label, hint and error text. */
  readonly fieldId = input.required<string>();
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly autocomplete = input('off');
  readonly hint = input('');
  readonly placeholder = input('');
  readonly inputMode = input<'text' | 'numeric' | 'email'>('text');
  readonly maxLength = input<number | null>(null);
  /** Per-field overrides keyed by validator error name, e.g. { required: 'Enter your name.' }. */
  readonly errorMessages = input<Record<string, string>>({});

  // OnPush needs a signal that changes whenever the control's state or value changes.
  private readonly controlEvents = toSignal(
    toObservable(this.control).pipe(switchMap((c) => c.events.pipe(startWith(null)))),
  );

  protected readonly errorText = computed(() => {
    this.controlEvents();
    const control = this.control();
    if (!control.invalid || !(control.touched || control.dirty)) {
      return null;
    }
    const key = Object.keys(control.errors ?? {})[0];
    return this.errorMessages()[key] ?? DEFAULT_MESSAGES[key] ?? 'This field is invalid.';
  });
}
