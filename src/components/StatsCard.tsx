import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
}) => {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-[#191919] p-5 border border-[#D4AF37]/25 shadow-md hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:border-[#D4AF37]/50 hover:-translate-y-1 transition-all duration-300">
      {/* Decorative subtle gold glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-[#D4AF37]/10 blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-bold uppercase tracking-wider text-[#B8B8B8]">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-[#222222] border border-[#D4AF37]/30 text-[#D4AF37] shadow-inner">
          <Icon className="w-5 h-5 text-[#D4AF37]" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-[26px] font-extrabold text-white tracking-tight">
          {value}
        </h3>
        {trend && (
          <span
            className={`text-[12px] font-bold px-1.5 py-0.5 rounded border ${
              trendPositive
                ? 'bg-[#D4AF37]/15 text-[#F5D76E] border-[#D4AF37]/35'
                : 'bg-red-950/60 text-red-300 border-red-800/40'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <p className="text-[12px] text-[#B8B8B8] mt-1 font-medium">
        {subtitle}
      </p>
    </div>
  );
};
