import { Jugador } from '../types';
import { Pencil, Trash2, Calendar, Shield, MoveHorizontal as MoveH } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PlayerCardProps {
  player: Jugador;
  onEdit: (player: Jugador) => void;
  onDelete: (id: string) => void;
}

export default function PlayerCard({ player, onEdit, onDelete }: PlayerCardProps) {
  const getDemarcacionColor = (dem: string) => {
    switch (dem) {
      case 'Portero': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Defensa': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Centrocampista': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Delantero': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-slate-900/40 backdrop-blur-sm rounded-[2rem] shadow-xl border border-slate-800 overflow-hidden group hover:border-indigo-500/50 transition-all duration-300"
    >
      <div className="relative h-56 bg-slate-800 overflow-hidden">
        {player.foto_jugador ? (
          <img 
            src={player.foto_jugador} 
            alt={player.nombre} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 group-hover:from-indigo-900/40 group-hover:to-slate-900 transition-colors duration-500">
            <Shield className="w-20 h-20 text-slate-700 group-hover:text-indigo-500/30 transition-colors" />
          </div>
        )}
        <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-2xl text-indigo-400 font-black text-xl shadow-2xl border border-white/5">
          #{player.dorsal}
        </div>
        
        <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button 
            onClick={() => onEdit(player)}
            className="p-2.5 bg-black/60 backdrop-blur-md hover:bg-indigo-500 text-white rounded-xl shadow-2xl border border-white/5 transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(player.id)}
            className="p-2.5 bg-black/60 backdrop-blur-md hover:bg-rose-600 text-white rounded-xl shadow-2xl border border-white/5 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent"></div>
      </div>

      <div className="p-6 relative">
        <div className="mb-5">
          <h3 className="text-2xl font-black text-white leading-tight tracking-tight mb-1">
            {player.nombre} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">{player.apellidos}</span>
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/80">{player.equipo}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className={ `flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${getDemarcacionColor(player.demarcacion)}`}>
            {player.demarcacion}
          </div>
          <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-800 bg-slate-800/30 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            {player.lateralidad}
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-800/50 pt-5 mt-2">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-7 h-7 rounded-lg bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium">{format(new Date(player.fecha_nacimiento), 'dd MMM yyyy', { locale: es })}</span>
          </div>
          {player.observaciones && (
            <div className="bg-slate-800/20 rounded-xl p-3 border border-slate-800/30">
              <p className="text-slate-400 text-[11px] leading-relaxed italic">
                "{player.observaciones}"
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
