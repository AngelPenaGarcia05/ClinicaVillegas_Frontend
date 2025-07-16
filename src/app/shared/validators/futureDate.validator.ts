import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Si no hay valor, no validamos (puede ser manejado por un validador 'required')
    }

    const selectedDate = new Date(control.value);
    const today = new Date();

    // Normalizar las fechas para comparar solo día, mes y año
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return { futureDate: { value: control.value } }; // Retorna un error si la fecha es futura
    }

    return null; // La validación es exitosa
  };
}