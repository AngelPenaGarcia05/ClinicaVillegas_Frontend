import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function fechaHoraNoPasadaValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const fecha = group.get('fecha')?.value;
        const hora = group.get('hora')?.value;

        if (!fecha || !hora) return null; // no validar si está incompleto

        const fechaHora = new Date(`${fecha}T${hora}`);
        const ahora = new Date();

        if (fechaHora.getTime() < ahora.getTime()) {
            return { fechaHoraPasada: true };
        }

        return null;
    };
}