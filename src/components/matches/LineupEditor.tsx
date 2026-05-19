import React, { useState, useEffect } from 'react';
import { useDraggable, useDroppable, DndContext, DragEndEvent } from '@dnd-kit/core';
import { supabase } from '../../lib/supabase';
import { Jugador } from '../../types';
import { MOCK_PLAYERS } from '../../constants/mockData';
import { Users, Layout, Shield, Save, Loader2, RotateCcw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Position {
  id: number;
  top: string;
  left: string;
  label: string;
}

const FORMATIONS: Record<string, Position[]> = {
  '4-4-2': [
    { id: 0, top: '88%', left: '50%', label: 'POR' },
    { id: 1, top: '70%', left: '15%', label: 'LI' },
    { id: 2, top: '75%', left: '38%', label: 'DFC' },
    { id: 3, top: '75%', left: '62%', label: 'DFC' },
    { id: 4, top: '70%', left: '85%', label: 'LD' },
    { id: 5, top: '45%', left: '15%', label: 'II' },
    { id: 6, top: '50%', left: '38%', label: 'MC' },
    { id: 7, top: '50%', left: '62%', label: 'MC' },
    { id: 8, top: '45%', left: '85%', label: 'ID' },
    { id: 9, top: '20%', left: '35%', label: 'DC' },
    { id: 10, top: '20%', left: '65%', label: 'DC' },
  ],
  '4-3-3': [
    { id: 0, top: '88%', left: '50%', label: 'POR' },
    { id: 1, top: '70%', left: '15%', label: 'LI' },
    { id: 2, top: '75%', left: '38%', label: 'DFC' },
    { id: 3, top: '75%', left: '62%', label: 'DFC' },
    { id: 4, top: '70%', left: '85%', label: 'LD' },
    { id: 5, top: '50%', left: '50%', label: 'MCD' },
    { id: 6, top: '45%', left: '30%', label: 'MC' },
    { id: 7, top: '45%', left: '70%', label: 'MC' },
    { id: 8, top: '20%', left: '15%', label: 'EI' },
    { id: 9, top: '15%', left: '50%', label: 'DC' },
    { id: 10, top: '20%', left: '85%', label: 'ED' },
  ],
  '3-5-2': [
    { id: 0, top: '88%', left: '50%', label: 'POR' },
    { id: 1, top: '75%', left: '25%', label: 'DFC' },
    { id: 2, top: '78%', left: '50%', label: 'DFC' },
    { id: 3, top: '75%', left: '75%', label: 'DFC' },
    { id: 4, top: '50%', left: '10%', label: 'CAR' },
    { id: 5, top: '50%', left: '90%', label: 'CAR' },
    { id: 6, top: '55%', left: '35%', label: 'MC' },
    { id: 7, top: '55%', left: '65%', label: 'MC' },
    { id: 8, top: '45%', left: '50%', label: 'MCO' },
    { id: 9, top: '20%', left: '35%', label: 'DC' },
    { id: 10, top: '20%', left: '65%', label: 'DC' },
  ]
};

interface DraggablePlayerProps {
  player: Jugador;
  isSmall?: boolean;
}

const DraggablePlayer: React.FC<DraggablePlayerProps> = ({ player, isSmall = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
    data: player
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative cursor-grab active:cursor-grabbing transform transition-transform ${isDragging ? 'opacity-50 scale-110' : 'hover:scale-105'}`}
    >
      <div className={`${isSmall ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-slate-800 border-2 border-indigo-500/50 flex items-center justify-center shadow-lg relative overflow-hidden group`}>
        {player.foto_jugador ? (
          <img src={player.foto_jugador} alt={player.nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-black text-sm">{player.dorsal}</span>
        )}
        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-colors" />
      </div>
      {!isSmall && (
        <div className="mt-1 text-center">
          <p className="text-[10px] font-bold text-white truncate max-w-[60px] leading-tight">{player.nombre}</p>
        </div>
      )}
    </div>
  );
};

interface PositionSlotProps {
  position: Position;
  player?: Jugador;
}

const PositionSlot: React.FC<PositionSlotProps> = ({ position, player }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${position.id}`,
    data: position
  });

  return (
    <div
      ref={setNodeRef}
      style={{ top: position.top, left: position.left }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all ${isOver ? 'scale-125' : ''}`}
    >
      <div className={`w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
        player ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20' : 
        isOver ? 'border-emerald-400 bg-emerald-400/10' : 'border-slate-700 bg-slate-900/40'
      }`}>
        {player ? (
          <DraggablePlayer player={player} />
        ) : (
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">{position.label}</span>
        )}
      </div>
    </div>
  );
};

export default function LineupEditor() {
  const [players, setPlayers] = useState<Jugador[]>([]);
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-4-2');
  const [lineup, setLineup] = useState<Record<number, string>>({}); // positionId -> playerId
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('jugadores').select('*').order('dorsal');
      if (data && data.length > 0) {
        setPlayers(data);
      } else {
        setPlayers(MOCK_PLAYERS as Jugador[]);
      }
    } catch (e) {
      setPlayers(MOCK_PLAYERS as Jugador[]);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && over.id.toString().startsWith('slot-')) {
      const slotId = parseInt(over.id.toString().replace('slot-', ''));
      const playerId = active.id.toString();

      // Check if player is already in another slot
      const existingSlot = Object.entries(lineup).find(([_, id]) => id === playerId);
      let newLineup = { ...lineup };
      if (existingSlot) {
        delete newLineup[parseInt(existingSlot[0])];
      }
      
      newLineup[slotId] = playerId;
      setLineup(newLineup);
    }
  };

  const resetLineup = () => {
    if (confirm('¿Quieres borrar la alineación actual?')) {
      setLineup({});
    }
  };

  const usedPlayerIds = Object.values(lineup);
  const availablePlayers = players.filter(p => !usedPlayerIds.includes(p.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Roster / Sidebar */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm uppercase tracking-widest">Plantilla</h3>
          </div>
          
          <DndContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {availablePlayers.map(player => (
                <DraggablePlayer key={player.id} player={player} />
              ))}
              {availablePlayers.length === 0 && (
                <div className="col-span-full py-8 text-center">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">No hay jugadores disponibles</p>
                </div>
              )}
            </div>
          </DndContext>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Layout className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm uppercase tracking-widest">Sistema</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {Object.keys(FORMATIONS).map(f => (
              <button
                key={f}
                onClick={() => { setFormation(f); setLineup({}); }}
                className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  formation === f ? 'bg-indigo-500 text-white shadow-lg' : 'bg-slate-950/50 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetLineup}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={() => alert('¡Alineación guardada! (Simulación)')}
            className="flex-[2] flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4" /> Guardar XI
          </button>
        </div>
      </div>

      {/* Field / Main View */}
      <div className="lg:col-span-9">
        <div className="relative aspect-[3/4] md:aspect-[4/3] bg-[#2d5a27] rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden group">
          {/* Grass Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.2) 20%)',
            backgroundSize: '20% 100%'
          }} />
          
          {/* Field Lines */}
          <div className="absolute inset-4 border-2 border-white/30 rounded-2xl pointer-events-none" />
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 -translate-x-1/2 pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 w-40 h-40 border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          {/* Penalty Areas */}
          <div className="absolute left-1/2 top-4 w-1/2 h-1/5 border-2 border-white/30 -translate-x-1/2 pointer-events-none" />
          <div className="absolute left-1/2 bottom-4 w-1/2 h-1/5 border-2 border-white/30 -translate-x-1/2 pointer-events-none" />

          {/* Slots */}
          <DndContext onDragEnd={handleDragEnd}>
            {FORMATIONS[formation].map(pos => {
              const assignedPlayerId = lineup[pos.id];
              const player = players.find(p => p.id === assignedPlayerId);
              return (
                <PositionSlot
                  key={pos.id}
                  position={pos}
                  player={player}
                />
              );
            })}
          </DndContext>

          {/* Overlay info */}
          <div className="absolute bottom-8 right-8 bg-slate-950/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-3">
             <Shield className="w-4 h-4 text-emerald-400" />
             <div>
               <p className="text-[10px] font-black text-white uppercase tracking-widest">Sistema Activo</p>
               <p className="text-xl font-black text-emerald-400 tracking-tighter">{formation}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
