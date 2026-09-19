import React from 'react';
import {
  ShieldCheck,
  Star,
  Award,
  Leaf,
  Headphones,
  CheckCircle,
  Sparkles,
  Plane,
} from 'lucide-react';

export const TourismTrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: Award,
      title: 'SLTDA Licensed DMC',
      subtitle: 'Official Tourism Operator',
      color: 'text-amber-400',
    },
    {
      icon: Star,
      title: '4.95 / 5.0 Rating',
      subtitle: '16,400+ Global Travelers',
      color: 'text-amber-400 fill-amber-400',
    },
    {
      icon: Leaf,
      title: 'Carbon-Neutral',
      subtitle: '100% Eco-offset Safaris',
      color: 'text-emerald-400',
    },
    {
      icon: Headphones,
      title: '24/7 Live Concierge',
      subtitle: 'WhatsApp & Chauffeur Support',
      color: 'text-blue-400',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Hidden Fees',
      subtitle: 'Guaranteed Ticket Entrances',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="w-full bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 sm:p-4 backdrop-blur-md">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 transition-colors border border-slate-800/50"
            >
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex-shrink-0">
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {item.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
