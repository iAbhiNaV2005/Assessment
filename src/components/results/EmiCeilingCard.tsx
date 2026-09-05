'use client';

/**
 * O4 Safe EMI Ceiling & Multi-Tenure Matrix Card
 * Displays monthly safe payment limits alongside tenure vs interest trade-offs.
 * Free of emojis.
 */

import React from 'react';
import { EmiResult } from '../../../lib/engine';

interface EmiCeilingCardProps {
  emi: EmiResult;
}

export const EmiCeilingCard: React.FC<EmiCeilingCardProps> = ({ emi }) => {
  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Output 4 — Safe EMI Ceiling & Tenure Trade-Offs
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Recommended Monthly Outflow Limit
          </h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ₹{emi.safeEmiCeiling.toLocaleString('en-IN')}/mo
          </div>
          <span className="text-xs text-slate-400">
            at {emi.recommendedTenureYears} Years Recommended Tenure
          </span>
        </div>
      </div>

      {/* Tenure Trade-Off Matrix */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold tracking-wider">
              <th className="py-3 px-3">Tenure</th>
              <th className="py-3 px-3 font-mono">Monthly EMI</th>
              <th className="py-3 px-3 font-mono">Total Interest</th>
              <th className="py-3 px-3 font-mono">Total Outflow</th>
              <th className="py-3 px-3">Post-Loan FOIR</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {emi.tenureTable.map((opt) => (
              <tr
                key={opt.tenureYears}
                className={`transition-colors ${
                  opt.isRecommended
                    ? 'bg-blue-600/10 text-white font-medium'
                    : 'text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <td className="py-3.5 px-3">
                  <span className="font-semibold text-white">{opt.tenureYears} Years</span>
                  <span className="text-slate-500 block text-[11px] font-mono">
                    ({opt.tenureMonths} Months)
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-slate-100">
                  ₹{opt.monthlyEmi.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-3 font-mono text-amber-400">
                  ₹{opt.totalInterestPaid.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-300">
                  ₹{opt.totalPayment.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-400">
                  {Math.round(opt.foirShare * 100)}%
                </td>
                <td className="py-3.5 px-3 text-right">
                  {opt.isRecommended ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Recommended
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">Alternative</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rationale on Trade-off */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-xs text-slate-300">
        <span className="font-semibold text-white block mb-1">Tenure Decision Trade-off:</span>
        <p className="leading-relaxed text-slate-400">
          A shorter tenure increases your monthly EMI but saves substantially on aggregate compounding interest. A longer tenure reduces monthly strain but costs more total rupees over the loan lifetime. Choose the shortest tenure that keeps your monthly outflow below the safe ceiling.
        </p>
      </div>
    </div>
  );
};
