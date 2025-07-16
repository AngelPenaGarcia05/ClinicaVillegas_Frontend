import { AbstractControl, ValidationErrors } from "@angular/forms";

export function soloLetrasValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (valor && !regex.test(valor)) {
    return { soloLetras: true };
  }
  return null;
}