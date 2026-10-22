import React from 'react';
import { BookOpen, GraduationCap, ShieldAlert } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const Footer: React.FC = () => {
  const { setActivePage } = useBanking();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 no-print transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Required Academic Title */}
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <GraduationCap className="w-4 h-4 text-[#0A2540] dark:text-sky-400" />
          <span className="font-semibold text-slate-900 dark:text-white">
            Banking Management System — Academic Project
          </span>
          <span className="text-slate-400 dark:text-slate-600">·</span>
          <span className="text-slate-500 dark:text-slate-400">First Year Engineering Coursework</span>
        </div>

        {/* Disclaimer */}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] text-center md:text-left">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Educational Simulation only · Mock data in browser local storage · No real currency or credentials</span>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActivePage('help')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Project Viva Docs
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-500 dark:text-slate-400">React + TS + Tailwind</span>
        </div>
      </div>
    </footer>
  );
};
