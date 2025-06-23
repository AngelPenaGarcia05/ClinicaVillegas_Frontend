import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { debounceTime, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CitaService } from '../../dashboard/services/cita.service';

export function citaValidator(citaService: CitaService, fecha: string, tratamientoId: number, dentistaId: number): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value) {
      return of(null);
    }

    return citaService.validarDisponibilidad({
      fecha: fecha,
      hora: value,
      tratamientoId: Number(tratamientoId),
      dentistaId: Number(dentistaId),
    }).pipe(
      debounceTime(300),
      map((isValid) => (isValid ? null : { citaInvalid: true })),
      catchError(() => of(null))
    );
  };
}