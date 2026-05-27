export interface HorasVuelo {
  id?: number;
  usuarioId: number;
  fecha: string;
  horas: number;
  tipoVuelo: 'Local' | 'Nacional' | 'Internacional';
  origen?: string;
  destino?: string;
  notas?: string;
}
