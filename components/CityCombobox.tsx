'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Search } from 'lucide-react';
import { City } from '@/lib/api';

interface Props {
    cities: City[];
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder: string;
}

export default function CityCombobox({ cities, value, onChange, label, placeholder }: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const filtered = cities.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const selected = cities.find(c => c.name === value);

    return (
        <div className="space-y-2" ref={ref}>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <MapPin size={14} className="text-cyan-400" />
                {label}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => { setOpen(!open); setSearch(''); }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 text-left transition-all duration-200 focus:outline-none focus:border-cyan-500/50"
                >
                    <span className={selected ? 'text-white font-medium' : 'text-slate-500 text-sm'}>
                        {selected ? selected.name : placeholder}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    />
                </button>

                {open && (
                    <div className="absolute z-[9999] mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                        <div className="p-2 border-b border-slate-800">
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
                                <Search size={14} className="text-slate-400" />
                                <input
                                    autoFocus
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search city..."
                                    className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
                                />
                            </div>
                        </div>
                        <div className="max-h-52 overflow-y-auto custom-scrollbar">
                            {filtered.length === 0 ? (
                                <p className="text-center text-slate-500 text-sm py-4">No cities found</p>
                            ) : (
                                filtered.map(city => (
                                    <button
                                        key={city.name}
                                        type="button"
                                        onClick={() => { onChange(city.name); setOpen(false); setSearch(''); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-800 ${city.name === value ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300'
                                            }`}
                                    >
                                        {city.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
