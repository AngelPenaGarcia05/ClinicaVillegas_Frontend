export interface ReporteRequestDTO {
  filas: string[];
  columnas: string[];
  valor: string;
  agregacion: string;
  filtros?: { [key: string]: any };
  fechaDesde?: string; // formato ISO, ej. '2024-01-01'
  fechaHasta?: string;
}