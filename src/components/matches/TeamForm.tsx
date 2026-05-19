import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { Team } from '../../types';

interface TeamFormProps {
  team?: Team;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TeamForm({ team, onClose, onSuccess }: TeamFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: team?.nombre || '',
    escudo: team?.escudo || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const teamData = {
        ...formData,
        user_id: session?.user.id
      };

      if (team?.id) {
        const { error } = await supabase
          .from('equipos')
          .update(teamData)
          .eq('id', team.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('equipos')
          .insert([teamData]);
        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Error al guardar el equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">
            {team ? 'Editar Equipo' : 'Nuevo Equipo'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Equipo</label>
            <input
              required
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej: Arenas Club de Getxo"
              className="w-full bg-slate-950/50 border border-slate-800 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">URL del Escudo (Opcional)</label>
            <div className="relative">
              <input
                type="url"
                value={formData.escudo}
                onChange={(e) => setFormData(prev => ({ ...prev, escudo: e.target.value }))}
                placeholder="https://ejemplo.com/escudo.png"
                className="w-full bg-slate-950/50 border border-slate-800 text-white pl-12 pr-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
              />
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
            </div>
          </div>

          {formData.escudo && (
            <div className="flex justify-center p-4 bg-slate-950/30 rounded-2xl border border-slate-800/50">
              <img 
                src={formData.escudo} 
                alt="Vista previa" 
                className="w-20 h-20 object-contain"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {team ? 'Guardar Cambios' : 'Crear Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
