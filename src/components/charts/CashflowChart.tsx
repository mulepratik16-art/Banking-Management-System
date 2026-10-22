import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';

export const CashflowChart: React.FC = () => {
  const { cashflow, currency } = useBanking();
  const [activeTab, setActiveTab] = useState<'comparison' | 'balance'>('comparison');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxFlow = Math.max(...cashflow.map((c) => Math.max(c.deposits, c.withdrawals)), 6000);
  const maxBalance = Math.max(...cashflow.map((c) => c.balance), 30000);
  const minBalance = Math.min(...cashflow.map((c) => c.balance), 10000);

  // SVG dimensions
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Area points for balance trend
  const balancePoints = cashflow.map((pt, i) => {
    const x = paddingX + (i / (cashflow.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((pt.balance - minBalance * 0.8) / (maxBalance - minBalance * 0.8)) * chartHeight;
    return { x, y, pt };
  });

  const pathD = balancePoints.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${balancePoints[balancePoints.length - 1].x} ${height - paddingY} L ${balancePoints[0].x} ${height - paddingY} Z`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Simulated Financial Cashflow & Trends</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Academic analytical model · 6-Month rolling view</p>
        </div>

        {/* Segmented filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Inflow vs Outflow
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'balance'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Balance Trajectory
          </button>
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="relative mt-4">
        {activeTab === 'comparison' ? (
          <div>
            <div className="flex items-center justify-end gap-5 mb-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#0A2540] dark:bg-sky-500"></span> Deposits (Inflow)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#38BDF8] dark:bg-cyan-400"></span> Withdrawals (Outflow)
              </span>
            </div>

            <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-800">
              {cashflow.map((item, idx) => {
                const depHeight = (item.deposits / maxFlow) * 100;
                const withHeight = (item.withdrawals / maxFlow) * 100;
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-md px-2.5 py-1.5 shadow-lg whitespace-nowrap pointer-events-none tabular-nums border border-slate-700">
                        <div>Deposits: {currency}{item.deposits.toLocaleString()}</div>
                        <div>Withdrawals: {currency}{item.withdrawals.toLocaleString()}</div>
                      </div>
                    )}

                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Deposit bar */}
                      <div
                        style={{ height: `${depHeight}%` }}
                        className="w-1/2 max-w-[20px] bg-[#0A2540] dark:bg-sky-500 hover:bg-[#0F2F57] dark:hover:bg-sky-400 rounded-t-xs transition-all duration-300"
                        title={`${item.month} Deposits: ${currency}${item.deposits}`}
                      />
                      {/* Withdrawal bar */}
                      <div
                        style={{ height: `${withHeight}%` }}
                        className="w-1/2 max-w-[20px] bg-[#38BDF8] dark:bg-cyan-400 hover:bg-[#0284C7] dark:hover:bg-cyan-300 rounded-t-xs transition-all duration-300"
                        title={`${item.month} Withdrawals: ${currency}${item.withdrawals}`}
                      />
                    </div>

                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-2">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Overall Account Growth Curve</span>
              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300 font-medium">
                Peak: {currency}{maxBalance.toLocaleString()}
              </span>
            </div>

            <div className="relative w-full h-48">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#64748b" strokeWidth="1" opacity="0.4" />

                {/* Area and Line */}
                <path d={areaD} fill="url(#balanceGrad)" />
                <path d={pathD} fill="none" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Nodes */}
                {balancePoints.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#FFFFFF"
                      stroke="#0284C7"
                      strokeWidth="2.5"
                      className="cursor-pointer hover:r-6 transition-all"
                    />
                    <text
                      x={pt.x}
                      y={height - 10}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#94a3b8"
                      fontFamily="Plus Jakarta Sans"
                    >
                      {pt.pt.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Summary indicators */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 block">Avg. Monthly Inflow</span>
          <span className="font-mono font-medium text-slate-800 dark:text-slate-200 tabular-nums">
            {currency}{(cashflow.reduce((a, b) => a + b.deposits, 0) / cashflow.length).toFixed(0)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block">Avg. Monthly Outflow</span>
          <span className="font-mono font-medium text-slate-800 dark:text-slate-200 tabular-nums">
            {currency}{(cashflow.reduce((a, b) => a + b.withdrawals, 0) / cashflow.length).toFixed(0)}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block">Net Liquidity Ratio</span>
          <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">+18.4% Nominal</span>
        </div>
      </div>
    </div>
  );
};
