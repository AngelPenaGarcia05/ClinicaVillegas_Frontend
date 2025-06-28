import { TipoTratamiento } from "./tipo-tratamiento";

export interface Tratamiento {
    id: number;
    nombre: string;
    descripcion: string;
    costo: number;
    estado: boolean;
    duracion: string;
    imagenURL: string;
    tipoTratamiento: TipoTratamiento;
    fechaCreacion: string;
    fechaModificacion: string;
}
