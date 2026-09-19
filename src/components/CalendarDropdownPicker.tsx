import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Clock,
  Check,
  X,
} from 'lucide-react';

interface CalendarDropdownPickerProps {
  value: string; // ISO format: YYYY-MM-DD
  onChange: (dateStr: string) => void;
  label?: string;
  helperText?: string;
  minDate?: string;
  id?: string;
  className?: string;
  buttonClassName?: string;
}

export const CalendarDropdownPicker: React.FC<CalendarDropdownPickerProps> = ({
  value,
  onChange,
  label = 'Departure Date',
  helperText = 'Guaranteed departure • Free cancellation up to 48h',
  minDate,
  id = 'calendar-dropdown-box',
  className = '',
  buttonClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().slice(0, 10);
  const effectiveMinDate = minDate || todayStr;

  // Internal view year and month (0-indexed month: 0 = Jan, 11 = Dec)
  const initialDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  // Keep view year & month synced when value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Format the selected date for human display
  const formatHumanDate = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);

    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
    return `${weekday}, ${day} ${monthName} ${year}`;
  };

  // Calculate relative info (e.g. "In 14 days")
  const getRelativeInfo = (dateStr: string) => {
    if (!dateStr) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = dateStr.split('-');
    const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return 'Past date';
  };

  // Preset generator
  const getPresetDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().slice(0, 10);
  };

  const quickPresets = [
    { label: 'Tomorrow', date: getPresetDate(1) },
    { label: '+7 Days', date: getPresetDate(7) },
    { label: '+14 Days', date: getPresetDate(14) },
    { label: '+1 Month', date: getPresetDate(30) },
  ];

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Build calendar matrix
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays: Array<{
    dayNumber: number;
    dateStr: string;
    isCurrentMonth: boolean;
    isDisabled: boolean;
    isSelected: boolean;
    isToday: boolean;
  }> = [];

  // Trailing previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonthNum = viewMonth === 0 ? 12 : viewMonth;
    const prevYearNum = viewMonth === 0 ? viewYear - 1 : viewYear;
    const padMonth = String(prevMonthNum).padStart(2, '0');
    const padDay = String(day).padStart(2, '0');
    const dateStr = `${prevYearNum}-${padMonth}-${padDay}`;

    calendarDays.push({
      dayNumber: day,
      dateStr,
      isCurrentMonth: false,
      isDisabled: true,
      isSelected: dateStr === value,
      isToday: dateStr === todayStr,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const padMonth = String(viewMonth + 1).padStart(2, '0');
    const padDay = String(d).padStart(2, '0');
    const dateStr = `${viewYear}-${padMonth}-${padDay}`;
    const isDisabled = dateStr < effectiveMinDate;

    calendarDays.push({
      dayNumber: d,
      dateStr,
      isCurrentMonth: true,
      isDisabled,
      isSelected: dateStr === value,
      isToday: dateStr === todayStr,
    });
  }

  // Next month leading days to complete row grid (multiples of 7)
  const remainingCells = 7 - (calendarDays.length % 7);
  if (remainingCells < 7) {
    for (let d = 1; d <= remainingCells; d++) {
      const nextMonthNum = viewMonth === 11 ? 1 : viewMonth + 2;
      const nextYearNum = viewMonth === 11 ? viewYear + 1 : viewYear;
      const padMonth = String(nextMonthNum).padStart(2, '0');
      const padDay = String(d).padStart(2, '0');
      const dateStr = `${nextYearNum}-${padMonth}-${padDay}`;

      calendarDays.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isDisabled: true,
        isSelected: dateStr === value,
        isToday: dateStr === todayStr,
      });
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div ref={containerRef} className={`relative ${isOpen ? 'z-40' : 'z-10'} ${className}`}>
      {/* 1. LABEL & TOP STATUS - Fixed Height & Aligned */}
      {label && (
        <div className="h-5 flex items-center justify-between mb-1.5 px-0.5">
          <label
            htmlFor={id}
            className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold flex items-center gap-1.5 truncate"
          >
            <CalendarDays className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span>{label}</span>
          </label>
          {value && (
            <span className="font-mono text-[9px] text-amber-300 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700 flex-shrink-0">
              {getRelativeInfo(value)}
            </span>
          )}
        </div>
      )}

      {/* 2. MAIN CLICKABLE DROPDOWN BOX - Traveler Control Deck Colors */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`w-full h-[60px] group text-left px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 border ${
          isOpen
            ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/30 shadow-xl shadow-black/60'
            : 'bg-slate-950 hover:bg-slate-900 border-slate-700 hover:border-amber-500/50'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* User-Friendly Calendar Icon Box */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 shadow-sm ${
              isOpen
                ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow-amber-500/30'
                : 'bg-amber-500/15 border border-amber-500/30 text-amber-400 group-hover:bg-amber-500/25 group-hover:text-amber-300'
            }`}
          >
            <CalendarDays className="w-4 h-4 flex-shrink-0" />
          </div>

          {/* Date Label & Helper Text */}
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
              {formatHumanDate(value)}
            </div>
            <div className="text-[10px] text-slate-400 truncate font-medium">
              {helperText}
            </div>
          </div>
        </div>

        {/* Dropdown Indicator Chevron */}
        <div
          className={`p-1 rounded-lg text-slate-400 group-hover:text-white transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-amber-400' : ''
          }`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </button>

      {/* 3. USER-FRIENDLY CALENDAR DROPDOWN POPOVER - Solid Opaque High-Contrast Traveler Deck Colors */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Select Tour Departure Date"
          className="absolute left-0 min-w-full sm:min-w-[330px] top-full mt-2 z-[150] rounded-2xl bg-slate-950 border-2 border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-3.5 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Top Quick-Preset Chips for Rapid Booking */}
          <div className="mb-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] uppercase tracking-wider font-mono text-slate-300 font-bold">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Quick Departure Presets</span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close calendar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {quickPresets.map((preset) => {
                const isPresetSelected = value === preset.date;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      onChange(preset.date);
                      setIsOpen(false);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold text-center transition-all cursor-pointer truncate border ${
                      isPresetSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                        : 'bg-slate-900 text-slate-200 hover:bg-slate-850 hover:text-white border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month & Year Navigation Bar */}
          <div className="flex items-center justify-between py-1.5 px-2 mb-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-xs font-mono font-bold text-white tracking-wide">
              {monthNames[viewMonth]} <span className="text-amber-400 font-black">{viewYear}</span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {weekdayHeaders.map((day) => (
              <span
                key={day}
                className="text-[10px] font-mono font-bold uppercase text-slate-400 py-0.5"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid - Solid Opaque High-Contrast Styling */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((item, idx) => {
              if (!item.isCurrentMonth) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-8 flex items-center justify-center text-[11px] text-slate-700 select-none font-mono"
                  >
                    {item.dayNumber}
                  </div>
                );
              }

              return (
                <button
                  key={item.dateStr}
                  type="button"
                  disabled={item.isDisabled}
                  onClick={() => {
                    onChange(item.dateStr);
                    setIsOpen(false);
                  }}
                  className={`h-8 w-full rounded-xl text-xs transition-all duration-150 flex items-center justify-center relative cursor-pointer border ${
                    item.isDisabled
                      ? 'text-slate-700 cursor-not-allowed line-through border-transparent'
                      : item.isSelected
                      ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md scale-[1.04]'
                      : 'text-slate-200 bg-slate-900/60 hover:bg-slate-800 hover:text-white font-medium border-slate-800/80 hover:border-amber-500/40'
                  } ${item.isToday && !item.isSelected ? 'border-amber-500 text-amber-400 font-bold bg-amber-500/10' : ''}`}
                >
                  <span>{item.dayNumber}</span>
                  {item.isToday && (
                    <span
                      className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${
                        item.isSelected ? 'bg-slate-950' : 'bg-amber-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-slate-200 truncate">
              <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">
                Selected: <strong className="text-amber-300 font-bold">{formatHumanDate(value)}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
