import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * UI-level password rules: upper case, lower case and a digit.
 * Length is checked separately with Validators.minLength.
 * These are form hints only; the identity provider's password policy stays the real authority.
 */
export const passwordStrength: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = (control.value ?? '') as string;
  if (!value) {
    return null; // Let Validators.required report empty values.
  }
  const ok = /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);
  return ok ? null : { passwordStrength: true };
};

/** Marks the control invalid when its value differs from a sibling control in the same group. */
export function matchesControl(siblingName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const sibling = control.parent?.get(siblingName);
    if (!sibling || !control.value) {
      return null;
    }
    return control.value === sibling.value ? null : { mismatch: true };
  };
}
