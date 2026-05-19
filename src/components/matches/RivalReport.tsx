import React, { useState, useEffect } from 'react';
import { Youtube, ShieldAlert, Swords, Zap, Info, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Team } from '../../types';

export default function RivalReport() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  
  const [report, setReport] = useState({
    ofensivo: '',
    defensivo: '',
    transiciones: '',
    videoUrl: ''
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [selectedTeamId]);

  const fetchTeams = async () => {
    const { data } = await supabase.from('equipos').select('*').order('nombre');
    if (data) setTeams(data);
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase
        .from('informes_partido')
        .select('contenido')
        .eq('user_id', session?.user.id)
        .eq('tipo', 'rival')
        .eq('equipo_rival_id', selectedTeamId || null)
        .maybeSingle();

      if (data?.contenido) {
        setReport(data.contenido);
      } else {
        setReport({
          ofensivo: '',
          defensivo: '',
          transiciones: '',
          videoUrl: ''
        });
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const content = { ...report };
      
      const { error } = await supabase
        .from('informes_partido')
        .upsert({
          user_id: session?.user.id,
          tipo: 'rival',
          equipo_rival_id: selectedTeamId || null,
          contenido: content,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id, tipo, equipo_rival_id'
        });

      if (error) throw error;
      setSavedAt(new Date());
      setTimeout(() => setSavedAt(null), 3000);
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Error al guardar el informe');
    } finally {
      setSaving(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(report.videoUrl);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-[2rem] border border-slate-800">
        <div className="flex-1 max-w-md">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Seleccionar Rival</label>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 text-white px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
          >
            <option value="">General / Sin equipo específico</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg ${
            savedAt ? 'bg-emerald-500 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20'
          }`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 
           savedAt ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {savedAt ? '¡Guardado!' : 'Guardar Informe'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Swords className="text-amber-400 w-5 h-5" />
               </div>
               <h3 className="text-xl font-bold">Análisis Táctico</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <Zap className="w-3 h-3 text-emerald-400" /> Fase Ofensiva
                </label>
                {loading ? (
                  <div className="w-full h-[120px] bg-slate-950/20 animate-pulse rounded-2xl" />
                ) : (
                  <textarea
                    value={report.ofensivo}
                    onChange={(e) => setReport(prev => ({ ...prev, ofensivo: e.target.value }))}
                    placeholder="Puntos fuertes en ataque, jugadores clave, sistema de salida..."
                    className="w-full bg-slate-950/50 border border-slate-800 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px] text-sm resize-none"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <ShieldAlert className="w-3 h-3 text-rose-400" /> Fase Defensiva
                </label>
                {loading ? (
                  <div className="w-full h-[120px] bg-slate-950/20 animate-pulse rounded-2xl" />
                ) : (
                  <textarea
                    value={report.defensivo}
                    onChange={(e) => setReport(prev => ({ ...prev, defensivo: e.target.value }))}
                    placeholder="Debilidades en defensa, presión tras pérdida, balón parado..."
                    className="w-full bg-slate-950/50 border border-slate-800 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px] text-sm resize-none"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <Info className="w-3 h-3 text-indigo-400" /> Transiciones
                </label>
                {loading ? (
                  <div className="w-full h-[120px] bg-slate-950/20 animate-pulse rounded-2xl" />
                ) : (
                  <textarea
                    value={report.transiciones}
                    onChange={(e) => setReport(prev => ({ ...prev, transiciones: e.target.value }))}
                    placeholder="Cómo reaccionan tras robo o pérdida de balón..."
                    className="w-full bg-slate-950/50 border border-slate-800 text-white p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px] text-sm resize-none"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col h-full">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                  <Youtube className="text-rose-500 w-5 h-5" />
               </div>
               <h3 className="text-xl font-bold">Video Análisis</h3>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">URL Video de YouTube</label>
                <input
                  type="text"
                  value={report.videoUrl}
                  onChange={(e) => setReport(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-950/50 border border-slate-800 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                />
              </div>

              <div className="flex-1 min-h-[300px] bg-slate-950/50 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden">
                 {embedUrl ? (
                   <iframe
                      src={embedUrl}
                      title="Análisis Rival"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                   ></iframe>
                 ) : (
                   <div className="text-center p-8">
                      <Youtube className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                      <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Introduce una URL para ver el video</p>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
