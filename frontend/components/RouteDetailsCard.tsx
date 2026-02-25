'use client';

import { RouteResponse } from '@/lib/api';
import { Route, DollarSign, Ruler, ArrowRight } from 'lucide-react';

interface Props {
    route: RouteResponse;
    mode: 'dist' | 'cost';
}

export default function RouteDetailsCard({ route, mode }: Props) {
    if (!route.success || !route.path) return null;

    return (
        <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Ruler size={13} />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">Distance</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                        {route.total_distance?.toLocaleString()}
                        <span className="text-xs text-slate-400 ml-1 font-normal">km</span>
                    </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <DollarSign size={13} />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">Cost</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                        {route.total_cost?.toLocaleString()}
                        <span className="text-xs text-slate-400 ml-1 font-normal">PKR</span>
                    </p>
                </div>
            </div>

            {/* Route Path */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                    <Route size={14} className="text-cyan-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Route Path</span>
                    <span className="ml-auto text-[10px] text-slate-500">{route.path.length} cities</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    {route.path.map((city, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${i === 0 || i === route.path!.length - 1
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                    : 'bg-slate-700/60 text-slate-300 border border-slate-600/50'
                                }`}>
                                {city}
                            </span>
                            {i < route.path!.length - 1 && (
                                <ArrowRight size={12} className="text-slate-600 flex-shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Segments */}
            {route.segments && route.segments.length > 0 && (
                <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Segments</p>
                    <div className="space-y-1.5">
                        {route.segments.map((seg, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-800/40 rounded-lg border border-slate-700/40 text-xs">
                                <span className="text-slate-300 font-medium">
                                    {seg.from_city} → {seg.to_city}
                                </span>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <span>{seg.distance} km</span>
                                    <span className="text-slate-600">|</span>
                                    <span>PKR {seg.cost.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
