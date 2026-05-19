import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Team } from '../../types';
import { Calendar, Shield, Save, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function MatchRegistration() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    localId: '',
    visitanteId: '',
    fecha: new Date().toISOString().slice(0, 16) // Format for datetime-local
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const { data } = await supabase.from('equipos').select('*').order('nombre');
    if (data) setTeams(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.localId === formData.visitanteId) {
      alert('El equipo local y visitante no pueden ser el mismo');
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('partidos')
        .insert([{
          user_id: session?.user.id,
          equipo_local_id: formData.localId,
          equipo_visitante_id: formData.visitanteId,
          fecha: formData.fecha
        }]);

      if (error) throw error;
      setSavedAt(new Date());
      setFormData({ localId: '', visitanteId: '', fecha: new Date().toISOString().slice(0, 16) });
      setTimeout(() => setSavedAt(null), 3000);
    } catch (error) {
      console.error('Error saving match:', error);
      alert('Error al dar de alta el partido');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando equipos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-indigo-500/5">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Calendar className="text-indigo-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Alta de Nuevo Partido</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Configura el próximo encuentro del equipo</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                <Shield className="w-3 h-3 text-emerald-400" /> Equipo Local
              </label>
              <select
                required
                value={formData.localId}
                onChange={(e) => setFormData(prev => ({ ...prev, localId: e.target.value }))}
                className="w-full bg-slate-950/50 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Selecciona local...</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>

            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 z-10 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 items-center justify-center">
              <ArrowRight className="w-5 h-5 text-slate-500" />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                <Shield className="w-3 h-3 text-rose-400" /> Equipo Visitante
              </label>
              <select
                required
                value={formData.visitanteId}
                onChange={(e) => setFormData(prev => ({ ...prev, visitanteId: e.target.value }))}
                className="w-full bg-slate-950/50 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:ring-2 focus:ring-rose-500/50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Selecciona visitante...</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Calendar className="w-3 h-3 text-indigo-400" /> Fecha y Hora del Encuentro
            </label>
            <input
              required
              type="datetime-local"
              value={formData.fecha}
              onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
              className="w-full bg-slate-950/50 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={saving}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm transition-all active:scale-95 shadow-xl ${
                savedAt ? 'bg-emerald-500 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20'
              }`}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 
               savedAt ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {savedAt ? '¡Partido Registrado!' : 'Dar de Alta Partido'}
            </button>
            
            {savedAt && (
              <p className="text-center mt-4 text-emerald-400 font-bold text-[10px] uppercase tracking-widest animate-bounce">
                El partido ha sido guardado exitosamente
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
