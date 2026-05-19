import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Revisa tu email para confirmar el registro.');
      }
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] p-6 selection:bg-indigo-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-md w-full bg-slate-900/40 backdrop-blur-xl rounded-[2rem] shadow-2xl p-10 border border-slate-800 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-500 rounded-2xl mb-6 shadow-2xl shadow-indigo-500/20 transform rotate-3">
            <LogIn className="text-white w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">
            {isLogin ? '¡Bienvenido!' : 'Crea tu Equipo'}
          </h2>
          <p className="text-slate-500 font-medium text-sm tracking-wide">
            Gestión Profesional de Plantillas <span className="text-indigo-400">v2.0</span>
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none placeholder:text-slate-700"
              placeholder="tu@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none placeholder:text-slate-700"
              placeholder="••••••••"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 text-red-400 p-4 rounded-xl text-xs font-bold border border-red-500/20"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-600 active:scale-95 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-70 disabled:active:scale-100 mt-4"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-white/50" />
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5" /> Entrar al Panel
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" /> Registrar Manager
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-xs font-medium">
            {isLogin ? '¿Nuevo en la plataforma?' : '¿Ya tienes una cuenta?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline decoration-2 underline-offset-4"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
