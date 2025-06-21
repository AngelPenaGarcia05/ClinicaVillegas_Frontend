import { TipoDocumento } from "./tipo-documento";

export interface Dentista {
    id: number;
    nColegiatura: string;
    estado: boolean;
    especializacion: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: TipoDocumento;
    numeroIdentidad: string;
    sexo: string;
    telefono: string;
    fechaNacimiento: string;
}
