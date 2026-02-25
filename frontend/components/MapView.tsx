'use client';

import 'leaflet/dist/leaflet.css';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet';
import { City, RouteData, RouteResponse } from '@/lib/api';

interface Props {
    cities: City[];
    allRoutes: RouteData[];
    activeRoute: RouteResponse | null;
}

function MapController({ cities }: { cities: City[] }) {
    const map = useMap();
    const initialized = useRef(false);
    useEffect(() => {
        if (cities.length > 0 && !initialized.current) {
            initialized.current = true;
            map.setView([30.3753, 69.3451], 6);
        }
    }, [cities, map]);
    return null;
}

export default function MapView({ cities, allRoutes, activeRoute }: Props) {
    const activePath = activeRoute?.success ? activeRoute.path : null;

    const isActiveSegment = (from: string, to: string) => {
        if (!activePath) return false;
        for (let i = 0; i < activePath.length - 1; i++) {
            if (
                (activePath[i] === from && activePath[i + 1] === to) ||
                (activePath[i] === to && activePath[i + 1] === from)
            ) return true;
        }
        return false;
    };

    const isOnRoute = (name: string) => activePath?.includes(name) ?? false;
    const isEndpoint = (name: string) =>
        activePath ? (name === activePath[0] || name === activePath[activePath.length - 1]) : false;

    return (
        <MapContainer
            center={[30.3753, 69.3451]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
        >
            <MapController cities={cities} />

            {/* Dark map tiles */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                maxZoom={19}
            />

            {/* Background routes — dim gray dashed */}
            {allRoutes.map((route, i) => {
                const active = isActiveSegment(route.from, route.to);
                if (active) return null; // Handle active separately for glow
                return (
                    <Polyline
                        key={`route-${i}`}
                        positions={[route.from_coords, route.to_coords]}
                        pathOptions={{
                            color: '#1e1e3a',
                            weight: 1.5,
                            opacity: 0.5,
                            dashArray: '5 5',
                        }}
                    />
                );
            })}

            {/* Active Route — Glow Effect */}
            {allRoutes.map((route, i) => {
                const active = isActiveSegment(route.from, route.to);
                if (!active) return null;
                return (
                    <div key={`active-glow-${i}`}>
                        {/* Outer large glow */}
                        <Polyline
                            positions={[route.from_coords, route.to_coords]}
                            pathOptions={{
                                color: '#e040fb',
                                weight: 12,
                                opacity: 0.1,
                            }}
                        />
                        {/* Middle medium glow */}
                        <Polyline
                            positions={[route.from_coords, route.to_coords]}
                            pathOptions={{
                                color: '#e040fb',
                                weight: 6,
                                opacity: 0.3,
                            }}
                        />
                        {/* Core solid line */}
                        <Polyline
                            positions={[route.from_coords, route.to_coords]}
                            pathOptions={{
                                color: '#e040fb',
                                weight: 3,
                                opacity: 1,
                            }}
                        />
                    </div>
                );
            })}

            {/* City markers */}
            {cities.map(city => {
                const onRoute = isOnRoute(city.name);
                const endpoint = isEndpoint(city.name);

                return (
                    <CircleMarker
                        key={city.name}
                        center={city.coordinates}
                        radius={endpoint ? 8 : onRoute ? 5 : 3.5}
                        pathOptions={{
                            color: endpoint ? '#ff4081' : onRoute ? '#00e5ff' : '#2a2a4a',
                            fillColor: endpoint ? '#ff4081' : onRoute ? '#00e5ff' : '#0d0d1a',
                            fillOpacity: 1,
                            weight: endpoint ? 3 : 1.5,
                        }}
                    >
                        <Popup>
                            <div style={{ padding: '6px 8px', minWidth: '110px', background: '#0d0d1a', color: '#fff' }}>
                                <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '2px' }}>{city.name}</p>
                                <p style={{ color: '#666', fontSize: '10px' }}>
                                    {city.coordinates[0].toFixed(3)}°N, {city.coordinates[1].toFixed(3)}°E
                                </p>
                                {onRoute && (
                                    <span style={{ display: 'inline-block', marginTop: '4px', background: '#e040fb22', color: '#e040fb', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '10px', border: '1px solid #e040fb44' }}>
                                        On Route
                                    </span>
                                )}
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </MapContainer>
    );
}
