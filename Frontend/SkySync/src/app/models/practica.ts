export interface Practica {
  id?: number;
  usuarioId: number;
  fecha: string;
  tipo: 'Teorica' | 'Practica';
  horas: number;
  descripcion?: string;
  instructor?: string;
  completada: boolean;
}
