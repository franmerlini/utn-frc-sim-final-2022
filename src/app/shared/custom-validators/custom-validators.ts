import { AbstractControl, ValidationErrors } from '@angular/forms';

const PROB_REGEXP = /^(0+\.?|0*\.\d+|0*0.99(\.0*)?)$/;
const POSITIVE_NUMBER_REGEXP = /(^\d*\.?\d*[0-9]+\d*$)|(^[0-9]+\d*\.\d*$)/;

export function isEmpty(value: any): boolean {
  return (
    typeof value === null ||
    typeof value === undefined ||
    (typeof value === 'string' && value === '')
  );
}

export class CustomValidators {
  public static probability(control: AbstractControl): ValidationErrors | null {
    if (isEmpty(control.value)) {
      return null;
    }
    return PROB_REGEXP.test(control.value) ? null : { probability: true };
  }

  public static positiveNumber(
    control: AbstractControl
  ): ValidationErrors | null {
    if (isEmpty(control.value)) {
      return null;
    }
    return POSITIVE_NUMBER_REGEXP.test(control.value)
      ? null
      : { positiveNumber: true };
  }
}

export class ErrorMessages {
  public static messageOf(validatorName: string, validatorValue?: any): string {
    const config: any = {
      required: 'El campo es requerido.',
      probability: 'Ingresar sólo números entre 0 y 1 (sin incluir el 1).',
      positiveNumber: 'Ingresar sólo números positivos.',
      min: `El valor debe ser mayor o igual a ${validatorValue.min}.`,
    };
    return config[validatorName];
  }
}
