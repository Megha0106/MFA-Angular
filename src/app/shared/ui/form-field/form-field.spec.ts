import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { FormField } from './form-field';

@Component({
  imports: [FormField],
  template: `<app-form-field fieldId="t" label="Name" [control]="control" />`,
})
class Host {
  control = new FormControl('', { nonNullable: true, validators: [Validators.required] });
}

describe('FormField', () => {
  it('shows an error only after the control is touched', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.field__error')).toBeNull();

    fixture.componentInstance.control.markAsTouched();
    await fixture.whenStable();
    expect(el.querySelector('.field__error')?.textContent).toContain('required');
    expect(el.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
  });
});
