import React, { useState } from 'react';
import { LayoutGrid, FileText, ClipboardList, Radio, Trophy, Users, Star, ArrowRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TeamsList from './TeamsList';
import RivalReport from './RivalReport';
import MatchPlan from './MatchPlan';
import LiveEvents from './LiveEvents';
import MatchRegistration from './MatchRegistration';

export type MatchTab = 'teams' | 'rival' | 'plan' | 'live' | 'create';

export default function MatchesModule() {
  const [activeTab, setActiveTab] = useState<MatchTab>('teams');

  const tabs = [
    { id: 'teams', label: 'Equipos', icon: Users, color: 'text-blue-400' },
    { id: 'create', label: 'Alta Partido', icon: Plus, color: 'text-white' },
    { id: 'rival', label: 'Informe Rival', icon: FileText, color: 'text-amber-400' },
    { id: 'plan', label: 'Plan Partido', icon: ClipboardList, color: 'text-emerald-400' },
    { id: 'live', label: 'En Directo', icon: Radio, color: 'text-rose-400' },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as MatchTab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'teams' && <TeamsList />}
            {activeTab === 'create' && <MatchRegistration />}
            {activeTab === 'rival' && <RivalReport />}
            {activeTab === 'plan' && <MatchPlan />}
            {activeTab === 'live' && <LiveEvents />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
