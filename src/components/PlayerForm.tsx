import React, { useState } from 'react';
import { Jugador, Demarcacion } from '../types';
import { X, Save } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { motion } from 'motion/react';

interface PlayerFormProps {
  player?: Jugador;
  onSave: (data: Partial<Jugador>) => void;
  onClose: () => void;
}

export default function PlayerForm({ player, onSave, onClose }: PlayerFormProps) {
  const [formData, setFormData] = useState<Partial<Jugador>>(
    player || {
      nombre: '',
      apellidos: '',
      dorsal: 0,
      fecha_nacimiento: '',
      demarcacion: 'Centrocampista',
      talla: 175,
      equipo: '',
      foto_jugador: '',
      observaciones: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-50 p-6 overflow-y-auto selection:bg-indigo-500/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl my-auto relative"
      >
        <div className="p-8 bg-indigo-600/10 border-b border-slate-800 flex justify-between items-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white tracking-tight">{player ? 'Editar Perfil' : 'Añadir Jugador'}</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Gestión de Plantilla</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700/50 relative z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Fotografía</label>
              <ImageUpload 
                currentUrl={formData.foto_jugador} 
                onUpload={(url) => setFormData(prev => ({ ...prev, foto_jugador: url }))} 
              />
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-1 space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre</label>
                <input
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="Ej: Lionel"
                />
              </div>
              <div className="col-span-1 space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Apellidos</label>
                <input
                  required
                  value={formData.apellidos}
                  onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="Ej: Messi"
                />
              </div>
              <div className="col-span-1 space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Dorsal</label>
                <input
                  type="number"
                  required
                  value={formData.dorsal || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, dorsal: parseInt(e.target.value) }))}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="10"
                />
              </div>
              <div className="col-span-1 space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nacimiento</label>
                <input
                  type="date"
                  required
                  value={formData.fecha_nacimiento}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="col-span-1 space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Estatura (cm)</label>
                <select
                  value={formData.talla}
                  onChange={(e) => setFormData(prev => ({ ...prev, talla: parseInt(e.target.value) }))}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  {Array.from({ length: 31 }, (_, i) => 160 + i).map(height => (
                    <option key={height} value={height}>{height} cm</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Club / Equipo</label>
                <input
                  required
                  value={formData.equipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipo: e.target.value }))}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="Nombre de tu equipo"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 text-center">Observaciones Técnicas</label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              className="w-full bg-slate-950/50 border border-slate-800 text-white px-6 py-4 rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none placeholder:text-slate-700 text-sm italic"
              placeholder="Notas sobre rendimiento, estado físico o táctica..."
            />
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-700 hover:text-white transition-all text-sm tracking-widest uppercase border border-slate-700/50"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="px-10 py-3 bg-indigo-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 text-sm tracking-widest uppercase"
            >
              <Save className="w-5 h-5" /> Confirmar Datos
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
