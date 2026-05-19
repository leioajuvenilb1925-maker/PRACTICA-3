import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Jugador } from './types';
import Auth from './components/Auth';
import PlayerCard from './components/PlayerCard';
import PlayerForm from './components/PlayerForm';
import PlayerDetail from './components/PlayerDetail';
import PlayerTable from './components/PlayerTable';
import EvaluationsDashboard from './components/EvaluationsDashboard';
import MatchesModule from './components/matches/MatchesModule';
import { Plus, LogOut, Users, Settings, Database, Loader2, AlertTriangle, LayoutGrid, List, BarChart3, Star, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PLAYERS } from './constants/mockData';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [players, setPlayers] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentTab, setCurrentTab] = useState<'roster' | 'evaluations' | 'matches'>('roster');
  const [filterTalla, setFilterTalla] = useState<string>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<Jugador | undefined>();
  const [viewSql, setViewSql] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchPlayers();
    }
  }, [session]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Configuración incompleta');
      }

      const { data, error } = await supabase
        .from('jugadores')
        .select('*, evaluaciones(*)')
        .order('dorsal', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setPlayers(data);
      } else {
        setPlayers(MOCK_PLAYERS as Jugador[]);
      }
    } catch (err) {
      console.warn('Usando datos locales:', err);
      setPlayers(MOCK_PLAYERS as Jugador[]);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlayer = async (data: Partial<Jugador>) => {
    try {
      if (selectedPlayer) {
        const { error } = await supabase
          .from('jugadores')
          .update(data)
          .eq('id', selectedPlayer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('jugadores')
          .insert([data]);
        if (error) throw error;
      }
      setShowForm(false);
      setSelectedPlayer(undefined);
      fetchPlayers();
    } catch (err: any) {
      alert('Nota: Si no has configurado las credenciales de Supabase o las tablas, esta operación fallará.\nError: ' + err.message);
    }
  };

  const handleDeletePlayer = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar a este jugador?')) return;
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('jugadores').delete().eq('id', id);
        if (error) throw error;
      }
      
      // Actualizamos el estado local siempre para que el usuario vea el cambio (especialmente en modo demo)
      setPlayers(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
       console.error('Error al eliminar:', err);
       alert('Error al eliminar de la base de datos: ' + err.message);
    }
  };

  const filteredPlayers = players.filter(p => {
    let tallaMatch = true;
    if (filterTalla === 'tall') tallaMatch = p.talla >= 185;
    else if (filterTalla === 'medium') tallaMatch = p.talla >= 175 && p.talla < 185;
    else if (filterTalla === 'short') tallaMatch = p.talla < 175;
    return tallaMatch;
  });

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <header className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-30 shadow-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transform rotate-3">
              <Users className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">TEAM<span className="text-indigo-400">MANAGER</span> <span className="text-slate-500 text-xs font-normal ml-2">PRO v2.0</span></h1>
          </div>

          <div className="flex bg-slate-900/40 p-1 rounded-xl shadow-inner border border-slate-800 ml-auto mr-4">
             <button 
               onClick={() => setCurrentTab('roster')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all ${currentTab === 'roster' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <Users className="w-4 h-4" />
               Plantilla
             </button>
             <button 
               onClick={() => setCurrentTab('evaluations')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all ${currentTab === 'evaluations' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <Star className="w-4 h-4" />
               Evaluaciones
             </button>
             <button 
               onClick={() => setCurrentTab('matches')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all ${currentTab === 'matches' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <Trophy className="w-4 h-4" />
               Partidos
             </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Connected
            </div>
            <button 
              onClick={() => { setShowForm(true); setSelectedPlayer(undefined); }}
              className="bg-indigo-500 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-600 transition-all font-bold text-sm active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nuevo Jugador</span>
            </button>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all border border-slate-800 bg-slate-900/50"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
               <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20 text-[10px] uppercase font-bold tracking-widest">Temporada 24/25</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">Plantilla Actual</h2>
            <p className="text-slate-500 font-medium tracking-wide">Gestionando {filteredPlayers.length} perfiles activos de {players.length} totales</p>
          </div>
          
          <div className="flex flex-wrap gap-3 self-start">
             {/* Filtros */}
             <div className="flex bg-slate-900/40 p-1 rounded-xl shadow-inner border border-slate-800">
                <select 
                  value={filterTalla}
                  onChange={(e) => setFilterTalla(e.target.value)}
                  className="bg-transparent text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 outline-none cursor-pointer hover:text-white transition-colors"
                >
                  <option value="all">Estatura: Todas</option>
                  <option value="tall">Altos (+185cm)</option>
                  <option value="medium">Media (175-185cm)</option>
                  <option value="short">Bajos (-175cm)</option>
                </select>
             </div>

             <div className="flex bg-slate-900/40 p-1 rounded-xl shadow-inner border border-slate-800">
             <div className="flex border-r border-slate-800 pr-1 mr-1">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                 title="Vista Cuadrícula"
               >
                 <LayoutGrid className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => setViewMode('table')}
                 className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                 title="Vista Tabla"
               >
                 <List className="w-4 h-4" />
               </button>
             </div>
             <button 
               onClick={() => setViewSql(!viewSql)}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewSql ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800/50'}`}
             >
               <Database className="w-4 h-4" /> Setup SQL
             </button>
          </div>
        </div>
      </div>

        {!isSupabaseConfigured && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4 text-amber-500"
          >
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div className="text-xs font-medium leading-relaxed">
              <p className="font-bold uppercase tracking-wider mb-1">Conexión no configurada</p>
              <p className="opacity-80">La app está funcionando con datos locales. Para conectar con tu base de datos real, añade <code className="bg-amber-500/20 px-1 rounded">VITE_SUPABASE_URL</code> y <code className="bg-amber-500/20 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> en los Secretos de AI Studio.</p>
            </div>
          </motion.div>
        )}

        {viewSql && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 bg-slate-900/40 rounded-2xl p-8 border border-slate-800 backdrop-blur-sm relative shadow-2xl"
          >
            <button onClick={() => setViewSql(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <LogOut className="w-5 h-5 transform rotate-180" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Database className="text-indigo-400 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Base de Datos de Jugadores</h3>
                <p className="text-slate-500 text-xs">Copia este SQL en el editor de Supabase</p>
              </div>
            </div>
            <div className="bg-black/40 rounded-xl p-5 border border-slate-800/50">
              <pre className="text-indigo-300 text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed selection:bg-indigo-500/30">
                {`-- 1. CREAR TABLA
CREATE TABLE jugadores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  dorsal INTEGER,
  fecha_nacimiento DATE,
  talla INTEGER,
  equipo TEXT,
  foto_jugador TEXT,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- NUEVA TABLA: Evaluaciones
CREATE TABLE evaluaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  puntuacion INTEGER CHECK (puntuacion >= 1 AND puntuacion <= 10),
  comentario TEXT,
  fecha DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SEGURIDAD (RLS)
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluaciones ENABLE ROW LEVEL SECURITY;

-- Política integral para usuarios autenticados
CREATE POLICY "Gestión total para autenticados" ON jugadores 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Gestión evaluaciones para autenticados" ON evaluaciones 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- 3. STORAGE (Importante: Crea el bucket 'jugadores' en la UI de Supabase primero)
-- Políticas para el bucket 'jugadores':
CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'jugadores');
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'jugadores' AND auth.role() = 'authenticated');`}
              </pre>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cargando Plantilla...</p>
          </div>
        ) : currentTab === 'evaluations' ? (
          <EvaluationsDashboard />
        ) : currentTab === 'matches' ? (
          <MatchesModule />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredPlayers.map((player) => (
                <div key={player.id || `${player.nombre}-${player.dorsal}`}>
                  <PlayerCard 
                    player={player} 
                    onEdit={(p) => { setSelectedPlayer(p); setShowForm(true); }}
                    onView={(p) => { setSelectedPlayer(p); setShowDetail(true); }}
                    onDelete={handleDeletePlayer}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <PlayerTable 
            players={filteredPlayers}
            onEdit={(p) => { setSelectedPlayer(p); setShowForm(true); }}
            onView={(p) => { setSelectedPlayer(p); setShowDetail(true); }}
            onDelete={handleDeletePlayer}
          />
        )}

        {filteredPlayers.length === 0 && !loading && (
          <div className="text-center py-32 bg-slate-900/20 rounded-[2.5rem] border-2 border-dashed border-slate-800/50">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">No se encontraron jugadores</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">Prueba a cambiar los filtros aplicados arriba.</p>
            <button 
              onClick={() => { setFilterTalla('all'); }}
              className="mt-8 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-8 py-3 rounded-2xl font-bold hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <PlayerForm 
            player={selectedPlayer}
            onSave={handleSavePlayer}
            onClose={() => { setShowForm(false); setSelectedPlayer(undefined); }}
          />
        )}
        {showDetail && selectedPlayer && (
          <PlayerDetail 
            player={selectedPlayer} 
            onClose={() => { setShowDetail(false); setSelectedPlayer(undefined); }} 
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-slate-900 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-slate-500">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Users className="text-indigo-400 w-4 h-4" />
            </div>
            <span className="font-bold text-white text-xs tracking-widest uppercase">TeamManager Pro</span>
          </div>
          <p className="text-center text-[10px] uppercase font-bold tracking-widest">© 2026 Ready for GitHub & Vercel Deployment</p>
          <div className="flex gap-6 justify-center md:justify-end text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-400 transition-colors">Docs</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Support</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
