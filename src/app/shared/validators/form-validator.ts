import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidator {
  static includeIn<T>(array: T[], property: string): ValidatorFn {
    return ({ value }: AbstractControl): ValidationErrors | null => {
      return array.some((val: T) => val[property] === value) ? null : { include: true };
    };
  }
}
