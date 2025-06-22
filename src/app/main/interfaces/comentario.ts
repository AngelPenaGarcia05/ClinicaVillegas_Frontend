export interface Comentario {
    id: number;
    contenido: string;
    fecha: string;
    nombresUsuario: string;
    emailUsuario: string;
    imagenUsuario: string;
    comentarios: Comentario[];
}
