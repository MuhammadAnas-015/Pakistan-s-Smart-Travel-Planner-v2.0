'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { fetchRoute, fetchCities, fetchAllRoutes, RouteResponse } from '@/lib/api';
import CityCombobox from '@/components/CityCombobox';
import RouteDetailsCard from '@/components/RouteDetailsCard';
import ExportButton from '@/components/ExportButton';
import { Loader2, Navigation, MapPin, Zap } from 'lucide-react';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <Loader2 className="animate-spin text-cyan-500 mx-auto mb-4" size={32} />
        <p className="text-slate-400 text-sm font-medium">Loading Map...</p>
      </div>
    </div>
  ),
});

const queryClient = new QueryClient();

function DashboardContent() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<'dist' | 'cost'>('dist');
  const [activeRoute, setActiveRoute] = useState<RouteResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
  });

  const { data: routesData } = useQuery({
    queryKey: ['allRoutes'],
    queryFn: fetchAllRoutes,
  });

  const handleCalculate = async () => {
    if (!source || !destination) {
      alert('Please select both source and destination cities');
      return;
    }

    if (source === destination) {
      alert('Source and destination cannot be the same');
      return;
    }

    setIsCalculating(true);
    try {
      const result = await fetchRoute(source, destination, mode);
      setActiveRoute(result);
    } catch (error) {
      alert('Failed to calculate route. Please try again.');
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };

  const cities = citiesData?.cities || [];
  const allRoutes = routesData?.routes || [];

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden">
      {/* Sidebar Container - Fixed Width */}
      <div className="w-[400px] flex-shrink-0 flex flex-col h-full border-r border-slate-800 bg-slate-900 relative z-50 shadow-2xl">

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
                <MapPin className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Pakistan Travel Planner
                </h1>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-800 w-full" />

          {/* Form Controls */}
          <div className="space-y-6">
            <div className="space-y-5">
              <CityCombobox
                cities={cities}
                value={source}
                onChange={setSource}
                label="Starting Point"
                placeholder="Select origin city..."
              />

              <CityCombobox
                cities={cities}
                value={destination}
                onChange={setDestination}
                label="Destination"
                placeholder="Select destination city..."
              />
            </div>

            {/* Mode Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Zap size={16} className="text-yellow-400" />
                Optimization Priority
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('dist')}
                  className={`relative overflow-hidden group p-3 rounded-xl border transition-all duration-300 ${mode === 'dist'
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                >
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <span className="text-xs font-bold uppercase tracking-wider">Shortest</span>
                    <span className="text-[10px] opacity-70">Distance (km)</span>
                  </div>
                </button>

                <button
                  onClick={() => setMode('cost')}
                  className={`relative overflow-hidden group p-3 rounded-xl border transition-all duration-300 ${mode === 'cost'
                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                >
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <span className="text-xs font-bold uppercase tracking-wider">Cheapest</span>
                    <span className="text-[10px] opacity-70">Cost (PKR)</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              disabled={isCalculating || !source || !destination}
              className="w-full relative group overflow-hidden rounded-xl p-[1px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-slate-900 rounded-[10px] p-3 transition-colors group-hover:bg-slate-900/90">
                <div className="flex items-center justify-center gap-2">
                  {isCalculating ? (
                    <Loader2 className="animate-spin text-white" size={20} />
                  ) : (
                    <Navigation className="text-white group-hover:scale-110 transition-transform" size={20} />
                  )}
                  <span className="font-bold text-white">
                    {isCalculating ? 'Calculating...' : 'Find Best Route'}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Results Area */}
          {activeRoute && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="h-px bg-slate-800 w-full mb-6" />

              {activeRoute.success ? (
                <div className="space-y-4">
                  <RouteDetailsCard route={activeRoute} mode={mode} />
                  <ExportButton
                    route={activeRoute}
                    mode={mode}
                    source={source}
                    destination={destination}
                  />

                </div>
              ) : (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-center">
                  <p className="font-semibold text-sm">No route found</p>
                  <p className="text-xs opacity-70 mt-1">{activeRoute.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer - Copyright */}
          <div className="pt-8 pb-4 text-center">
            <p className="text-[10px] text-slate-600 font-medium uppercase tracking-widest">
              Pakistan Travel Tool By Anas
            </p>
          </div>
        </div>
      </div>

      {/* Map Content - Fills Remaining Space */}
      <div className="flex-1 relative z-0 bg-slate-950">
        <MapView cities={cities} allRoutes={allRoutes} activeRoute={activeRoute} />

        {/* Floating Info Card */}
        <div className="absolute top-6 right-6 z-[1000] pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-2xl max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live System Status</span>
            </div>
            <p className="text-xs text-slate-400">
              {cities.length} Connected Cities • Real-time Routing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
