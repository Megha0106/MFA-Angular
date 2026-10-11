import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { Button } from '../../../shared/ui/button/button';
import { Card } from '../../../shared/ui/card/card';
import { FormField } from '../../../shared/ui/form-field/form-field';

/** Sign-in page. Credentials are entered on the Microsoft Entra page; the email is only a hint. */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Button, Card, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthService);

  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.email],
  });
  protected readonly form = new FormGroup({ email: this.email });

  constructor() {
    // After Microsoft redirects back, the app lands on /login with a session already cached;
    // skip the form and go straight to the dashboard.
    if (this.auth.isLoggedIn) {
      void inject(Router).navigateByUrl('/dashboard');
    }
  }

  protected submit(): void {
    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }
    this.auth.login(this.email.value); // leaves the app: full-page redirect to Microsoft
  }
}
