'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { fetchRoute, fetchCities, fetchAllRoutes, RouteResponse } from '@/lib/api';
import { Navigation, ChevronDown, Ruler, DollarSign, MapPin, Download, Zap } from 'lucide-react';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-950">
      <p className="text-gray-500 text-sm">Loading map...</p>
    </div>
  ),
});

const queryClient = new QueryClient();

function Dashboard() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<'dist' | 'cost'>('dist');
  const [activeRoute, setActiveRoute] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: citiesData } = useQuery({ queryKey: ['cities'], queryFn: fetchCities });
  const { data: routesData } = useQuery({ queryKey: ['allRoutes'], queryFn: fetchAllRoutes });

  const cities = citiesData?.cities.map(c => c.name) || [];
  const allRoutes = routesData?.routes || [];

  const handleCalculate = async () => {
    if (!source || !destination) return alert('Please select both cities');
    if (source === destination) return alert('Source and destination cannot be the same');
    setLoading(true);
    try {
      const result = await fetchRoute(source, destination, mode);
      setActiveRoute(result);
    } catch {
      alert('Failed to calculate route. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0a0a0f', overflow: 'hidden' }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: '320px', flexShrink: 0, background: '#0d0d1a',
        borderRight: '1px solid #1e1e3a', display: 'flex', flexDirection: 'column',
        height: '100%', overflowY: 'auto', zIndex: 50,
        boxShadow: '10px 0 30px rgba(0,0,0,0.5)'
      }}>

        {/* Header */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #1e1e3a', background: 'linear-gradient(to bottom, #0f0f2d, #0d0d1a)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <MapPin size={22} color="#e040fb" />
            <span style={{ color: '#e040fb', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>
              Pakistan Travel Planner
            </span>
          </div>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Starting Point */}
          <div>
            <label style={{ color: '#e040fb', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <MapPin size={12} /> Starting Point
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
                style={{
                  width: '100%', padding: '12px 32px 12px 12px', background: '#13132a',
                  border: '1px solid #2a2a4a', borderRadius: '8px', color: source ? '#fff' : '#666',
                  fontSize: '14px', appearance: 'none', cursor: 'pointer', outline: 'none',
                  transition: 'border-color 0.2s', fontWeight: 500
                }}
              >
                <option value="" disabled>Select origin...</option>
                {cities.map(c => <option key={c} value={c} style={{ background: '#13132a', color: '#fff' }}>{c}</option>)}
              </select>
              <ChevronDown size={16} color="#555" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label style={{ color: '#e040fb', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <MapPin size={12} /> Destination
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={destination}
                onChange={e => setDestination(e.target.value)}
                style={{
                  width: '100%', padding: '12px 32px 12px 12px', background: '#13132a',
                  border: '1px solid #2a2a4a', borderRadius: '8px', color: destination ? '#fff' : '#666',
                  fontSize: '14px', appearance: 'none', cursor: 'pointer', outline: 'none',
                  fontWeight: 500
                }}
              >
                <option value="" disabled>Select destination...</option>
                {cities.map(c => <option key={c} value={c} style={{ background: '#13132a', color: '#fff' }}>{c}</option>)}
              </select>
              <ChevronDown size={16} color="#555" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Optimization Mode */}
          <div>
            <label style={{ color: '#888', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
              Optimization Mode
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => setMode('dist')}
                style={{
                  padding: '10px 6px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                  background: mode === 'dist' ? 'rgba(224,64,251,0.15)' : '#13132a',
                  color: mode === 'dist' ? '#e040fb' : '#666',
                  outline: mode === 'dist' ? '2px solid rgba(224,64,251,0.5)' : '1px solid #2a2a4a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <Ruler size={13} /> Shortest
              </button>
              <button
                onClick={() => setMode('cost')}
                style={{
                  padding: '10px 6px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                  background: mode === 'cost' ? 'rgba(0,200,150,0.12)' : '#13132a',
                  color: mode === 'cost' ? '#00c896' : '#666',
                  outline: mode === 'cost' ? '2px solid rgba(0,200,150,0.5)' : '1px solid #2a2a4a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <DollarSign size={13} /> Cheapest
              </button>
            </div>
          </div>

          {/* Find Route Button */}
          <button
            onClick={handleCalculate}
            disabled={loading || !source || !destination}
            style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: loading || !source || !destination ? '#1a1a2e' : 'linear-gradient(135deg, #e040fb, #7c4dff)',
              boxShadow: loading || !source || !destination ? 'none' : '0 4px 15px rgba(224,64,251,0.3)',
              color: loading || !source || !destination ? '#444' : '#fff',
              fontWeight: 800, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.2s', marginTop: '4px'
            }}
          >
            <Navigation size={18} style={{ transform: 'rotate(45deg)' }} />
            {loading ? 'Calculating...' : 'Find Best Route'}
          </button>

          {/* Results */}
          {activeRoute && activeRoute.success && (
            <div style={{ marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Zap size={14} color="#00c896" />
                <span style={{ color: '#00c896', fontWeight: 700, fontSize: '13px' }}>Route Found!</span>
              </div>
              <p style={{ color: '#555', fontSize: '10px', marginBottom: '8px' }}>
                {mode === 'dist' ? '↗ Shortest Distance Route' : '$ Cheapest Cost Route'}
              </p>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                <div style={{ background: '#13132a', border: '1px solid #2a2a4a', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ color: '#888', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Ruler size={9} /> Distance
                  </div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>{activeRoute.total_distance}</div>
                  <div style={{ color: '#555', fontSize: '9px' }}>kilometers</div>
                </div>
                <div style={{ background: '#13132a', border: '1px solid #2a2a4a', borderRadius: '6px', padding: '8px' }}>
                  <div style={{ color: '#888', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <DollarSign size={9} /> Cost
                  </div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>{activeRoute.total_cost?.toLocaleString()}</div>
                  <div style={{ color: '#555', fontSize: '9px' }}>PKR</div>
                </div>
              </div>

              {/* Journey Steps */}
              {activeRoute.segments && activeRoute.segments.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#888', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Journey Steps</span>
                    <span style={{ background: '#7c4dff', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '10px' }}>
                      {activeRoute.segments.length} stops
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {activeRoute.segments.map((seg, i) => (
                      <div key={i} style={{ background: '#13132a', border: '1px solid #1e1e3a', borderRadius: '6px', padding: '7px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <span style={{ background: '#7c4dff', color: '#fff', fontSize: '9px', fontWeight: 700, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ color: '#ccc', fontSize: '11px', fontWeight: 600 }}>
                            {seg.from_city} <span style={{ color: '#555' }}>→</span> {seg.to_city}
                          </span>
                        </div>
                        <div style={{ marginLeft: '22px', display: 'flex', gap: '10px' }}>
                          <span style={{ color: '#888', fontSize: '10px' }}>↗ {seg.distance} km</span>
                          <span style={{ color: '#888', fontSize: '10px' }}>$ {seg.cost.toLocaleString()} PKR</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total + Export */}
              <div style={{ marginTop: '8px', padding: '8px', background: '#0a0a14', borderRadius: '6px', border: '1px solid #1e1e3a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: '10px' }}>
                  Total Journey <span style={{ color: '#fff', fontWeight: 700 }}>{activeRoute.total_distance} km</span> · <span style={{ color: '#fff', fontWeight: 700 }}>PKR {activeRoute.total_cost?.toLocaleString()}</span>
                </span>
                <ExportPDF route={activeRoute} source={source} destination={destination} mode={mode} />
              </div>

              <div style={{ marginTop: '8px', textAlign: 'center' }}>
                <span style={{ background: 'linear-gradient(135deg, #7c4dff22, #e040fb22)', border: '1px solid #7c4dff44', color: '#9c7dff', fontSize: '10px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px' }}>
                  © 2024 Anas Dynamic Systems 🚀
                </span>
              </div>
            </div>
          )}

          {activeRoute && !activeRoute.success && (
            <div style={{ padding: '10px', background: '#1a0a0a', border: '1px solid #4a1a1a', borderRadius: '6px', color: '#f87171', fontSize: '12px', textAlign: 'center' }}>
              No route found between these cities.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: '1px solid #1e1e3a' }}>
          <p style={{ color: '#333', fontSize: '10px', textAlign: 'center' }}>© 2024 Anas Dynamic Systems · Muhammad Anas</p>
        </div>
      </div>

      {/* ── MAP ── */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapView
          cities={citiesData?.cities || []}
          allRoutes={allRoutes}
          activeRoute={activeRoute}
        />
      </div>
    </div>
  );
}

// Inline PDF export button
function ExportPDF({ route, source, destination, mode }: { route: RouteResponse; source: string; destination: string; mode: string }) {
  const handleExport = async () => {
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Pakistan Travel Planner', 20, 20);
    doc.setFontSize(11);
    doc.text(`From: ${source}  →  To: ${destination}`, 20, 35);
    doc.text(`Mode: ${mode === 'dist' ? 'Shortest Distance' : 'Cheapest Cost'}`, 20, 43);
    doc.text(`Total Distance: ${route.total_distance} km`, 20, 51);
    doc.text(`Total Cost: PKR ${route.total_cost?.toLocaleString()}`, 20, 59);
    doc.text('Route: ' + route.path?.join(' → '), 20, 67, { maxWidth: 170 });
    doc.save(`route_${source}_to_${destination}.pdf`);
  };
  return (
    <button onClick={handleExport} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px' }}>
      <Download size={11} /> Export as PDF
    </button>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
