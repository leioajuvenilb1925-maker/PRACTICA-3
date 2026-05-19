export type Demarcacion = 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero';
export type Lateralidad = 'Diestro' | 'Zurdo' | 'Ambidiestro';

export interface Jugador {
  id: string;
  nombre: string;
  apellidos: string;
  dorsal: number;
  fecha_nacimiento: string;
  demarcacion: Demarcacion;
  lateralidad: Lateralidad;
  equipo: string;
  foto_jugador?: string;
  observaciones?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
}
