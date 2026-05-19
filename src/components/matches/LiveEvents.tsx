import React, { useState, useEffect, useRef } from 'react';
import { Youtube, Play, Pause, RotateCcw, Plus, Minus, History, Timer, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Event {
  id: string;
  tiempo: string;
  tipo: string;
  label: string;
}

export default function LiveEvents() {
  const [videoUrl, setVideoUrl] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [score, setScore] = useState({ favor: 0, contra: 0 });
  const [occasions, setOccasions] = useState({ favor: 0, contra: 0 });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addEvent = (tipo: string, label: string) => {
    const newEvent: Event = {
      id: crypto.randomUUID(),
      tiempo: formatTime(seconds),
      tipo,
      label
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleScore = (delta: number, type: 'favor' | 'contra') => {
    setScore(prev => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
    if (delta > 0) {
      addEvent('goal', `Gol a ${type === 'favor' ? 'Favor' : 'Contra'}`);
    }
  };

  const handleOccasions = (delta: number, type: 'favor' | 'contra') => {
    setOccasions(prev => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
    if (delta > 0) {
      addEvent('occasion', `Ocasión a ${type === 'favor' ? 'Favor' : 'Contra'}`);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(videoUrl);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      {/* Left & Middle: Controls & Video */}
      <div className="lg:col-span-2 space-y-6">
        {/* Action Center - Moved to top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           {/* Stopwatch */}
           <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="text-6xl font-mono font-black text-white tabular-nums mb-8 tracking-tighter">
                {formatTime(seconds)}
              </div>
              <div className="flex items-center gap-3 w-full">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 ${
                    isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {isActive ? <><Pause className="w-4 h-4 fill-current" /> Pausar</> : <><Play className="w-4 h-4 fill-current" /> Iniciar</>}
                </button>
                <button 
                  onClick={() => { setSeconds(0); setIsActive(false); }}
                  className="p-4 bg-slate-800 text-slate-400 rounded-2xl hover:text-white transition-colors"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
           </div>

           {/* Stats Record */}
           <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center justify-center mb-2">
                    <span className="text-3xl font-black text-indigo-400">{score.favor} - {score.contra}</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <p className="text-[8px] font-bold text-slate-600 uppercase text-center">Favor</p>
                       <div className="flex bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                          <button onClick={() => handleScore(-1, 'favor')} className="flex-1 py-3 hover:bg-slate-700 text-slate-500"><Minus className="w-4 h-4 mx-auto" /></button>
                          <button onClick={() => handleScore(1, 'favor')} className="flex-1 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500"><Plus className="w-4 h-4 mx-auto" /></button>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[8px] font-bold text-slate-600 uppercase text-center">Contra</p>
                       <div className="flex bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                          <button onClick={() => handleScore(-1, 'contra')} className="flex-1 py-3 hover:bg-slate-700 text-slate-500"><Minus className="w-4 h-4 mx-auto" /></button>
                          <button onClick={() => handleScore(1, 'contra')} className="flex-1 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"><Plus className="w-4 h-4 mx-auto" /></button>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 border-t border-slate-800 pt-6">
                 <div className="flex items-center justify-center mb-2">
                    <span className="text-xl font-black text-slate-400">{occasions.favor} - {occasions.contra} <span className="text-[10px] text-slate-600 ml-2">OCASIONES</span></span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <div className="flex bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                          <button onClick={() => handleOccasions(-1, 'favor')} className="flex-1 py-3 hover:bg-slate-700 text-slate-500"><Minus className="w-4 h-4 mx-auto" /></button>
                          <button onClick={() => handleOccasions(1, 'favor')} className="flex-1 py-3 hover:bg-indigo-500/20 text-indigo-400"><Plus className="w-4 h-4 mx-auto" /></button>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                          <button onClick={() => handleOccasions(-1, 'contra')} className="flex-1 py-3 hover:bg-slate-700 text-slate-500"><Minus className="w-4 h-4 mx-auto" /></button>
                          <button onClick={() => handleOccasions(1, 'contra')} className="flex-1 py-3 hover:bg-slate-700 text-slate-400"><Plus className="w-4 h-4 mx-auto" /></button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Video Player - Moved below controls */}
        <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Youtube className="w-5 h-5 text-rose-500" />
            <input 
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="URL del partido en vivo (YouTube)..."
              className="bg-transparent text-sm text-slate-300 placeholder:text-slate-600 outline-none flex-1 border-b border-slate-800 focus:border-indigo-500 transition-colors pb-1"
            />
          </div>
          <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden border border-slate-800">
             {embedUrl ? (
               <iframe src={embedUrl} title="Live Match" className="w-full h-full" allowFullScreen></iframe>
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center space-y-4 opacity-10">
                  <Youtube className="w-24 h-24" />
                  <p className="font-black uppercase tracking-widest text-xs">Sin señal de video</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Right Column: Event Log */}
      <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800 flex flex-col overflow-hidden max-h-[800px]">
        <div className="p-8 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-10">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <History className="text-indigo-400 w-5 h-5" />
             </div>
             <h3 className="text-xl font-bold">Relato del Partido</h3>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
           <AnimatePresence initial={false}>
             {events.length === 0 ? (
               <div className="py-20 text-center opacity-30 flex flex-col items-center">
                  <History className="w-12 h-12 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Registra eventos para ver el relato</p>
               </div>
             ) : (
               events.map((ev) => (
                 <motion.div
                   key={ev.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 flex items-center gap-4 group"
                 >
                   <div className="w-12 h-12 rounded-xl bg-slate-950 flex flex-col items-center justify-center border border-slate-800 flex-shrink-0">
                      <span className="text-[8px] font-black text-slate-600 uppercase">Min</span>
                      <span className="text-xs font-black text-indigo-400 tabular-nums">{ev.tiempo.split(':')[0]}'</span>
                   </div>
                   <div className="flex-1">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${
                        ev.tipo === 'goal' ? 'text-emerald-400' : 'text-slate-500'
                      }`}>
                        {ev.label}
                      </p>
                      <p className="text-xs text-slate-400">Acción registrada en juego</p>
                   </div>
                 </motion.div>
               ))
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
