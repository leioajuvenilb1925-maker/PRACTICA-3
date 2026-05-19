import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Evaluacion, Jugador } from '../types';
import { Star, Loader2, Calendar, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function EvaluationsDashboard() {
  const [evaluations, setEvaluations] = useState<(Evaluacion & { jugadores: Jugador })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllEvaluations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('evaluaciones')
        .select('*, jugadores(*)')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setEvaluations(data || []);
    } catch (err) {
      console.error('Error fetching global evaluations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvaluations();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando histórico...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evaluations.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-slate-900/20 rounded-[2.5rem] border-2 border-dashed border-slate-800/50">
            <Star className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300">No hay evaluaciones registradas</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">Entra en el perfil de un jugador para añadir su primera valoración.</p>
          </div>
        ) : (
          evaluations.map((evalItem) => (
            <div key={evalItem.id} className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-[2rem] p-6 hover:border-indigo-500/30 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                  {evalItem.jugadores?.foto_jugador ? (
                    <img src={evalItem.jugadores.foto_jugador} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {evalItem.jugadores?.nombre} {evalItem.jugadores?.apellidos}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(evalItem.fecha), "d MMMM, yyyy", { locale: es })}
                  </div>
                </div>
                <div className={`ml-auto w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                  evalItem.puntuacion >= 8 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                  evalItem.puntuacion >= 5 ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                }`}>
                  {evalItem.puntuacion}
                </div>
              </div>

              <div className="relative">
                <MessageSquare className="w-8 h-8 text-indigo-500/5 absolute -top-2 -left-2" />
                <p className="text-slate-400 text-sm leading-relaxed italic relative z-10 pl-2">
                  "{evalItem.comentario || 'Sin comentarios adicionales.'}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
