import { AbstractControl } from "@angular/forms";

export function timeRangeValidator(min: string, max: string) {
    return (control: AbstractControl) => {
        const value = control.value;
        if (!value) {
            return null;
        }

        if (value < min || value > max) {
            return { outOfRange: true };
        }
        return null;
    };
}