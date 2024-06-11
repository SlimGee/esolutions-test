import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatches: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password && confirmPassword && password === confirmPassword
    ? null
    : { passwordMatch: true };
};
