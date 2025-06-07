import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function ageValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaNacimiento = new Date(control.value);
    const fechaHoy = new Date();
    if (!control.value) { return null; }
    let edad = fechaHoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = fechaHoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && fechaHoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    console.log(edad >= min);
    return edad >= min ? null : { edadInvalida: true };
  };
}