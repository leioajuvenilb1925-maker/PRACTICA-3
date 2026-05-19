import React from 'react';
import { Jugador } from '../types';
import { Pencil, Trash2, Eye, Shield, Activity, Trophy, User, Star } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PlayerTableProps {
  players: Jugador[];
  onEdit: (player: Jugador) => void;
  onDelete: (id: string) => void;
  onView: (player: Jugador) => void;
}

export default function PlayerTable({ players, onEdit, onDelete, onView }: PlayerTableProps) {
  const getAverageRating = (evals?: any[]) => {
    if (!evals || evals.length === 0) return null;
    const sum = evals.reduce((acc, curr) => acc + curr.puntuacion, 0);
    return (sum / evals.length).toFixed(1);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-sm rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Dorsal</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Jugador</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Val.</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Evaluación</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Talla</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nacimiento</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {players.map((player) => (
              <tr key={player.id || `${player.nombre}-${player.dorsal}`} className="group hover:bg-indigo-500/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-xl font-black text-indigo-400">#{player.dorsal}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                      {player.foto_jugador ? (
                        <img src={player.foto_jugador} alt={player.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm tracking-tight">{player.nombre} {player.apellidos}</p>
                      <p className="text-[10px] font-bold text-indigo-400/60 uppercase tracking-widest">{player.equipo}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-black text-indigo-400 text-xs bg-indigo-500/10 px-2 py-1 rounded-lg w-fit">
                    {player.valoracion_inicial || '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getAverageRating(player.evaluaciones) ? (
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${
                        Number(getAverageRating(player.evaluaciones)) >= 8 ? 'bg-emerald-500/20 text-emerald-400' :
                        Number(getAverageRating(player.evaluaciones)) >= 5 ? 'bg-indigo-500/20 text-indigo-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        <Star className="w-3 h-3 fill-current" />
                        {getAverageRating(player.evaluaciones)}
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">({player.evaluaciones?.length})</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Sin notas</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">{player.talla} cm</span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500">
                  {format(new Date(player.fecha_nacimiento), 'dd MMM yyyy', { locale: es })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onView(player)}
                      className="p-2 bg-slate-800 hover:bg-white hover:text-slate-900 text-slate-400 rounded-lg transition-all border border-slate-700/50"
                      title="Ver Detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(player)}
                      className="p-2 bg-slate-800 hover:bg-indigo-500 hover:text-white text-slate-400 rounded-lg transition-all border border-slate-700/50"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(player.id)}
                      className="p-2 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 rounded-lg transition-all border border-slate-700/50"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
