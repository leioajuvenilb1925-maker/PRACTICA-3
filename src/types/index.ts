export type Demarcacion = 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero';

export interface Evaluacion {
  id: string;
  jugador_id: string;
  puntuacion: number;
  comentario: string;
  fecha: string;
  created_at?: string;
}

export interface Jugador {
  id: string;
  nombre: string;
  apellidos: string;
  dorsal: number;
  fecha_nacimiento: string;
  demarcacion: Demarcacion;
  talla: number;
  equipo: string;
  foto_jugador?: string;
  observaciones?: string;
  created_at: string;
  evaluaciones?: Evaluacion[];
}

export interface UserProfile {
  id: string;
  email: string;
}
