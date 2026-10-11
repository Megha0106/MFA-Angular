import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Alert } from '../../../shared/ui/alert/alert';
import { Button } from '../../../shared/ui/button/button';
import { Card } from '../../../shared/ui/card/card';
import { FormField } from '../../../shared/ui/form-field/form-field';
import { matchesControl, passwordStrength } from '../../../shared/validators/password.validators';

/** Registration form (UI and validation only). */
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, Alert, Button, Card, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), passwordStrength],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, matchesControl('password')],
    }),
    acceptTerms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  protected readonly submitted = signal(false);

  constructor() {
    // Re-check the confirmation field whenever the password changes.
    this.form.controls.password.valueChanges
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => this.form.controls.confirmPassword.updateValueAndValidity());
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO(Entra): send `this.form.getRawValue()` (name, email, password) to the sign-up flow here.
    this.submitted.set(true);
  }
}
