import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Evaluacion } from '../types';
import { Star, MessageSquare, Plus, Trash2, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EvaluationsListProps {
  jugadorId: string;
}

export default function EvaluationsList({ jugadorId }: EvaluationsListProps) {
  const [evaluations, setEvaluations] = useState<Evaluacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEval, setNewEval] = useState({
    puntuacion: 7,
    comentario: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('evaluaciones')
        .select('*')
        .eq('jugador_id', jugadorId)
        .order('fecha', { ascending: false });

      if (error) throw error;
      setEvaluations(data || []);
    } catch (err) {
      console.error('Error fetching evaluations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, [jugadorId]);

  const handleAddEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('evaluaciones')
        .insert([{
          jugador_id: jugadorId,
          ...newEval
        }]);

      if (error) throw error;
      fetchEvaluations();
      setShowForm(false);
      setNewEval({
        puntuacion: 7,
        comentario: '',
        fecha: new Date().toISOString().split('T')[0]
      });
    } catch (err: any) {
      alert('Error al guardar evaluación: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta evaluación?')) return;
    try {
      const { error } = await supabase
        .from('evaluaciones')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEvaluations(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-indigo-500 fill-indigo-500/20" />
          Evaluaciones
        </h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
        >
          {showForm ? 'Cancelar' : <><Plus className="w-4 h-4" /> Nueva Nota</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddEvaluation}
            className="bg-slate-800/40 p-6 rounded-3xl border border-indigo-500/20 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Puntuación (1-10)</label>
                <div className="flex items-center gap-2">
                   <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={newEval.puntuacion}
                    onChange={(e) => setNewEval(prev => ({ ...prev, puntuacion: parseInt(e.target.value) }))}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="text-2xl font-black text-indigo-400 w-8 text-center">{newEval.puntuacion}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha</label>
                <input 
                  type="date"
                  value={newEval.fecha}
                  onChange={(e) => setNewEval(prev => ({ ...prev, fecha: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs p-3 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Comentarios</label>
              <textarea 
                value={newEval.comentario}
                onChange={(e) => setNewEval(prev => ({ ...prev, comentario: e.target.value }))}
                placeholder="Analiza su rendimiento en el último partido o entrenamiento..."
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs p-4 rounded-xl outline-none focus:border-indigo-500 min-h-[100px] resize-none"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-500 py-4 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all"
            >
              Guardar Evaluación
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : evaluations.length === 0 ? (
          <div className="py-12 text-center bg-slate-800/20 rounded-3xl border border-dashed border-slate-800">
            <MessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Sin evaluaciones aún</p>
          </div>
        ) : (
          evaluations.map((evalItem) => (
            <motion.div 
              key={evalItem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800/30 p-5 rounded-3xl border border-slate-800 group hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                    evalItem.puntuacion >= 8 ? 'bg-emerald-500/20 text-emerald-400' :
                    evalItem.puntuacion >= 5 ? 'bg-indigo-500/20 text-indigo-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {evalItem.puntuacion}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(evalItem.fecha), "d MMM, yyyy", { locale: es })}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(evalItem.id)}
                  className="p-2 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {evalItem.comentario}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
