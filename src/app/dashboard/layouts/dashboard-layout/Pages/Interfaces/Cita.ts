import { Dentista } from "./dentista";
import { TipoDocumento } from "./tipo-documento";
import { Tratamiento } from "./tratamiento";


export interface Cita {
    id: number;

    fecha: string;
    hora: string;
    monto: number;

    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;

    tipoDocumento: TipoDocumento;
    numeroIdentidad: string;
    sexo: string;
    fechaNacimiento: string;
    estado: string;

    dentista: Dentista;
    usuarioId: number;
    tratamiento: Tratamiento;
}