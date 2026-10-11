import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Alert } from '../../../shared/ui/alert/alert';
import { Button } from '../../../shared/ui/button/button';
import { Card } from '../../../shared/ui/card/card';
import { FormField } from '../../../shared/ui/form-field/form-field';

/** MFA code entry screen (UI and validation only; no code is generated or checked). */
@Component({
  selector: 'app-mfa-verify',
  imports: [ReactiveFormsModule, RouterLink, Alert, Button, Card, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mfa-verify.html',
  styleUrl: './mfa-verify.scss',
})
export class MfaVerify {
  protected readonly form = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
    }),
  });

  protected readonly submitted = signal(false);

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO(Entra): submit `this.form.getRawValue().code` to the MFA challenge here.
    this.submitted.set(true);
  }

  protected resend(): void {
    // TODO(Entra): request a new verification code here.
  }
}
