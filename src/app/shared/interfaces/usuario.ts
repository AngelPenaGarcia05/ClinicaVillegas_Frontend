import { TipoDocumento } from "./tipo-documento";

export interface Usuario{
    id: number,
    nombres: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    numeroIdentidad: string,
    sexo: string,
    telefono: string,
    fechaNacimiento: string,
    correo: string,
    imagenPerfil: string,
    estado: boolean,
    fechaCreacion: string,
    fechaModoficacion: string,
    rol: string,
    tipoDocumento: TipoDocumento
}