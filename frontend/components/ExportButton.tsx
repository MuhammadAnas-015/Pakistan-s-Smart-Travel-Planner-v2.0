'use client';

import { RouteResponse } from '@/lib/api';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface Props {
    route: RouteResponse;
    mode: 'dist' | 'cost';
    source: string;
    destination: string;
}

export default function ExportButton({ route, mode, source, destination }: Props) {
    const handleExport = () => {
        if (!route.success || !route.path) return;

        const doc = new jsPDF();
        const now = new Date().toLocaleString();

        doc.setFillColor(2, 6, 23);
        doc.rect(0, 0, 210, 297, 'F');

        doc.setTextColor(6, 182, 212);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Pakistan Travel Planner', 105, 25, { align: 'center' });

        doc.setTextColor(148, 163, 184);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${now}`, 105, 33, { align: 'center' });

        doc.setDrawColor(51, 65, 85);
        doc.line(20, 38, 190, 38);

        doc.setTextColor(226, 232, 240);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Route Summary', 20, 50);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(148, 163, 184);
        doc.text(`From: ${source}`, 20, 62);
        doc.text(`To: ${destination}`, 20, 70);
        doc.text(`Mode: ${mode === 'dist' ? 'Shortest Distance' : 'Cheapest Cost'}`, 20, 78);
        doc.text(`Total Distance: ${route.total_distance} km`, 20, 86);
        doc.text(`Total Cost: PKR ${route.total_cost?.toLocaleString()}`, 20, 94);

        doc.line(20, 100, 190, 100);

        doc.setTextColor(226, 232, 240);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Route Path', 20, 112);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184);
        const pathText = route.path.join(' → ');
        const lines = doc.splitTextToSize(pathText, 170);
        doc.text(lines, 20, 122);

        let y = 122 + lines.length * 6 + 10;

        if (route.segments && route.segments.length > 0) {
            doc.line(20, y, 190, y);
            y += 12;

            doc.setTextColor(226, 232, 240);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('Segment Details', 20, y);
            y += 10;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            route.segments.forEach(seg => {
                if (y > 270) { doc.addPage(); y = 20; }
                doc.setTextColor(148, 163, 184);
                doc.text(`${seg.from_city} → ${seg.to_city}`, 20, y);
                doc.setTextColor(100, 116, 139);
                doc.text(`${seg.distance} km  |  PKR ${seg.cost.toLocaleString()}`, 130, y);
                y += 7;
            });
        }

        doc.setTextColor(51, 65, 85);
        doc.setFontSize(8);
        doc.text('Developed by M.Anas — Pakistan Smart Travel Planner', 105, 290, { align: 'center' });

        doc.save(`route_${source}_to_${destination}.pdf`);
    };

    return (
        <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium"
        >
            <Download size={16} />
            Export as PDF
        </button>
    );
}
