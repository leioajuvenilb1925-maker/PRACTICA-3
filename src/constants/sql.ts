/**
 * SQL para crear la base de datos en Supabase.
 * Copia y pega esto en el SQL Editor de tu proyecto de Supabase.
 */

export const SUPABASE_SQL = `
-- 1. Crear tabla de jugadores
CREATE TABLE jugadores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  dorsal INTEGER,
  fecha_nacimiento DATE,
  demarcacion TEXT CHECK (demarcacion IN ('Portero', 'Defensa', 'Centrocampista', 'Delantero')),
  lateralidad TEXT CHECK (lateralidad IN ('Diestro', 'Zurdo', 'Ambidiestro')),
  equipo TEXT,
  foto_jugador TEXT,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;

-- 3. Crear política para usuarios autenticados (Permitir todo si está logueado)
CREATE POLICY "Permitir todo a usuarios autenticados" ON jugadores
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Crear bucket de storage para fotos
-- Nota: Los buckets suelen crearse desde la UI de Supabase, 
-- pero aquí tienes la referencia para las políticas de Storage si el bucket se llama 'jugadores'.

/*
  Políticas para el bucket 'jugadores':
  - Permitir SELECT publico (opcional) o para autenticados.
  - Permitir INSERT/UPDATE/DELETE para autenticados.
*/
`;
