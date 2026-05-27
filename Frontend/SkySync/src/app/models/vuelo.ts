export interface Vuelo {
  id?: number;
  codigo?: string;
  origen: string;
  destino: string;
  fechaSalida: string;
  cuposMaximos?: number;
  cuposDisponibles?: number;
}
