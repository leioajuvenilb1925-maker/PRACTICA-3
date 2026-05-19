import React from 'react';
import { Jugador } from '../types';
import { X, Calendar, Shield, Ruler, User, MessageSquare, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EvaluationsList from './EvaluationsList';

interface PlayerDetailProps {
  player: Jugador;
  onClose: () => void;
}

export default function PlayerDetail({ player, onClose }: PlayerDetailProps) {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center z-50 p-4 md:p-8 overflow-y-auto selection:bg-indigo-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-5xl overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.1)] flex flex-col md:flex-row min-h-[600px] relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-2xl transition-all border border-slate-700/50 z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: Photo & Identity */}
        <div className="w-full md:w-2/5 relative bg-slate-800 flex items-center justify-center overflow-hidden">
          {player.foto_jugador ? (
            <img 
              src={player.foto_jugador} 
              alt={player.nombre} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
              <User className="w-32 h-32 text-slate-700 opacity-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-8 left-8 right-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-4 shadow-xl shadow-indigo-500/20">
              Perfiles Activos
            </div>
            <h2 className="text-5xl font-black text-white leading-none tracking-tighter mb-2">
              {player.nombre} <br />
              <span className="text-indigo-400">{player.apellidos}</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-slate-500 opacity-50">#{player.dorsal}</span>
              <div className="h-4 w-[1px] bg-slate-700"></div>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{player.equipo}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Bento Info & Evaluations */}
        <div className="w-full md:w-3/5 flex flex-col bg-slate-900/50 backdrop-blur-md overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
            {/* Bento Item 1: Estatura */}
            <div className="col-span-2 bg-slate-800/40 p-6 rounded-[2rem] border border-slate-800 hover:border-indigo-500/30 transition-colors group">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estatura Corporal</p>
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <Ruler className="w-6 h-6 text-slate-400" />
                </div>
              </div>
              <p className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{player.talla} cm</p>
            </div>

            {/* Bento Item 3: Birthday */}
            <div className="col-span-2 bg-slate-800/40 p-6 rounded-[2rem] border border-slate-800 hover:border-indigo-500/30 transition-colors group flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Fecha de Nacimiento</p>
                <p className="text-3xl font-black text-white">{format(new Date(player.fecha_nacimiento), "d 'de' MMMM, yyyy", { locale: es })}</p>
              </div>
              <Calendar className="w-10 h-10 text-slate-700 opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Bento Item 4: Observations */}
            <div className="col-span-2 bg-indigo-500/5 p-8 rounded-[2.5rem] border border-indigo-500/10 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
              <div className="relative z-10 flex gap-4">
                <MessageSquare className="w-8 h-8 text-indigo-500 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Observaciones Técnicas</p>
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    {player.observaciones || "No hay observaciones detalladas registradas para este jugador en la temporada actual."}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Evaluations Section */}
            <div className="pt-12 border-t border-slate-800">
              <EvaluationsList jugadorId={player.id} />
            </div>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between p-8 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sincronizado con Supabase Cloud</span>
             </div>
             <p className="text-[9px] font-medium text-slate-700 bg-slate-950 px-3 py-1 rounded-full uppercase">UID: {player.id || 'MOCK_USER'}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
