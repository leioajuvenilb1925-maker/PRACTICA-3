import React, { useState, useEffect } from 'react';
import { Shield, Trophy, Users, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Team } from '../../types';
import TeamForm from './TeamForm';

export default function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>();

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipos')
        .select('*')
        .order('nombre', { ascending: true });
      
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este equipo?')) return;
    
    try {
      const { error } = await supabase
        .from('equipos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setTeams(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('No se pudo eliminar el equipo');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando equipos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Equipos en Competición</h2>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.2em]">Gestiona tu liga y rivales</p>
        </div>
        <button
          onClick={() => { setEditingTeam(undefined); setShowForm(true); }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nuevo Equipo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-slate-900/20 rounded-[2.5rem] border-2 border-dashed border-slate-800/50">
            <Shield className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300">No hay equipos registrados</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">Pulsa el botón de arriba para añadir tu primer equipo rival.</p>
          </div>
        ) : (
          teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-[2.5rem] p-6 hover:border-indigo-500/30 transition-all group relative"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {team.escudo ? (
                    <img src={team.escudo} alt={team.nombre} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Shield className="w-8 h-8 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors truncate">{team.nombre}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/50 px-2 py-0.5 rounded border border-slate-800">Oficial</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t border-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditingTeam(team); setShowForm(true); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Editar
                </button>
                <button
                  onClick={() => deleteTeam(team.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  Borrar
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <TeamForm
            team={editingTeam}
            onClose={() => setShowForm(false)}
            onSuccess={fetchTeams}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
