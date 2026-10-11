import { FormControl, FormGroup } from '@angular/forms';
import { matchesControl, passwordStrength } from './password.validators';

describe('passwordStrength', () => {
  it('accepts upper, lower and digit', () => {
    expect(passwordStrength(new FormControl('Abcdef12'))).toBeNull();
  });

  it('rejects missing character classes', () => {
    expect(passwordStrength(new FormControl('abcdefgh'))).toEqual({ passwordStrength: true });
    expect(passwordStrength(new FormControl('ABCDEFG1'))).toEqual({ passwordStrength: true });
    expect(passwordStrength(new FormControl('Abcdefgh'))).toEqual({ passwordStrength: true });
  });

  it('ignores empty values (required handles those)', () => {
    expect(passwordStrength(new FormControl(''))).toBeNull();
  });
});

describe('matchesControl', () => {
  const build = (password: string, confirm: string) => {
    const group = new FormGroup({
      password: new FormControl(password),
      confirm: new FormControl(confirm, matchesControl('password')),
    });
    // The control's validator first ran before it had a parent; re-run it now.
    group.controls.confirm.updateValueAndValidity();
    return group;
  };

  it('passes when values match', () => {
    expect(build('Abcdef12', 'Abcdef12').controls.confirm.errors).toBeNull();
  });

  it('reports a mismatch', () => {
    expect(build('Abcdef12', 'Different1').controls.confirm.errors).toEqual({ mismatch: true });
  });
});
