export type Demarcacion = 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero';

export interface Evaluacion {
  id: string;
  jugador_id: string;
  puntuacion: number;
  comentario: string;
  fecha: string;
  created_at?: string;
}

export interface Team {
  id: string;
  nombre: string;
  escudo?: string;
  user_id?: string;
  created_at?: string;
}

export interface MatchEvent {
  id: string;
  tiempo: string;
  tipo: 'Gol Favor' | 'Gol Contra' | 'Ocasión Favor' | 'Ocasión Contra';
  descripcion: string;
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
  valoracion_inicial?: number;
  foto_jugador?: string;
  observaciones?: string;
  created_at: string;
  evaluaciones?: Evaluacion[];
}

export interface UserProfile {
  id: string;
  email: string;
}
