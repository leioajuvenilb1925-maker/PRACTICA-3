import React, { useState } from 'react';
import { Presentation, Youtube, HelpCircle, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function MatchPlan() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [plan, setPlan] = useState({
    slidesUrl: '',
    videoUrl: ''
  });

  React.useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data } = await supabase
        .from('informes_partido')
        .select('contenido')
        .eq('user_id', session?.user.id)
        .eq('tipo', 'plan')
        .is('equipo_rival_id', null)
        .maybeSingle();

      if (data?.contenido) {
        setPlan(data.contenido);
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('informes_partido')
        .upsert({
          user_id: session?.user.id,
          tipo: 'plan',
          contenido: plan,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id, tipo'
        });

      if (error) throw error;
      setSavedAt(new Date());
      setTimeout(() => setSavedAt(null), 3000);
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error al guardar el plan de partido');
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

  const getSlidesEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('docs.google.com/presentation') && url.includes('embed')) {
        return url;
    }
    if (url.includes('docs.google.com/presentation')) {
        return url.replace(/\/pub\?|\/edit\?|\/edit#/, '/embed?');
    }
    return null;
  };

  const slidesEmbed = getSlidesEmbedUrl(plan.slidesUrl);
  const videoEmbed = getYoutubeEmbedUrl(plan.videoUrl);

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg ${
            savedAt ? 'bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
          }`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 
           savedAt ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {savedAt ? 'Plan Guardado' : 'Guardar Plan de Partido'}
        </button>
      </div>

      {/* Slides Section */}
      <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Presentation className="text-indigo-400 w-5 h-5" />
             </div>
             <h3 className="text-xl font-bold">Presentación Táctica (Google Slides)</h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
             <HelpCircle className="w-3 h-3 text-indigo-400" /> Usa el enlace de "Publicar en la web"
          </div>
        </div>

        <div className="space-y-4">
           <input
            type="text"
            value={plan.slidesUrl}
            onChange={(e) => setPlan(prev => ({ ...prev, slidesUrl: e.target.value }))}
            placeholder="Pega aquí el enlace de tu presentación de Google Slides..."
            className="w-full bg-slate-950/50 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          />
          
          <div className="aspect-video w-full bg-slate-950/50 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden">
            {slidesEmbed ? (
              <iframe
                src={slidesEmbed}
                title="Google Slides Plan"
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            ) : (
               <div className="text-center p-12 max-w-sm">
                 <Presentation className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                 <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] leading-relaxed">
                   Integra el plan de partido directamente desde Google Slides para que todo el equipo esté alineado
                 </p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategy Video Section */}
      <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Youtube className="text-emerald-400 w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">Video de Estrategia / Motivación</h3>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={plan.videoUrl}
            onChange={(e) => setPlan(prev => ({ ...prev, videoUrl: e.target.value }))}
            placeholder="Enlace a video de YouTube con jugadas ensayadas o charla técnica..."
            className="w-full bg-slate-950/50 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          />

          <div className="aspect-video w-full max-w-4xl mx-auto bg-slate-950/50 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden">
            {videoEmbed ? (
               <iframe
                src={videoEmbed}
                title="Estrategia Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-center p-12">
                 <Youtube className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                 <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Sin video de estrategia asignado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
