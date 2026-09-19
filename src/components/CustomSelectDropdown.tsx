import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string | number;
  label: string;
  sublabel?: string;
  icon?: React.ComponentType<{ className?: string }> | string;
  badge?: string;
}

interface CustomSelectDropdownProps {
  options: DropdownOption[];
  value: string | number;
  onChange: (value: any) => void;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  helperText?: string;
  id?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
}

export const CustomSelectDropdown: React.FC<CustomSelectDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  icon: HeaderIcon,
  helperText,
  id = 'custom-dropdown-select',
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

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

  return (
    <div ref={containerRef} className={`relative ${isOpen ? 'z-40' : 'z-10'} ${className}`}>
      {label && (
        <div className="h-5 flex items-center gap-1.5 mb-1.5 px-0.5">
          <label
            htmlFor={id}
            className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold flex items-center gap-1.5 truncate"
          >
            {HeaderIcon && <HeaderIcon className="w-3 h-3 text-amber-400 flex-shrink-0" />}
            <span>{label}</span>
          </label>
        </div>
      )}

      {/* Main Select Button - Traveler Control Deck Colors */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full h-[60px] group text-left px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 border ${
          isOpen
            ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/30 shadow-xl shadow-black/60'
            : 'bg-slate-950 hover:bg-slate-900 border-slate-700 hover:border-amber-500/50'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedOption?.icon && (
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/25 group-hover:text-amber-300 transition-colors text-xs font-bold shadow-sm">
              {typeof selectedOption.icon === 'string' ? (
                <span>{selectedOption.icon}</span>
              ) : (
                <selectedOption.icon className="w-4 h-4" />
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <span>{selectedOption?.label}</span>
              {selectedOption?.badge && (
                <span className="font-mono text-[9px] text-amber-300 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                  {selectedOption.badge}
                </span>
              )}
            </div>
            {(helperText || selectedOption?.sublabel) && (
              <div className="text-[10px] text-slate-400 truncate font-medium">
                {selectedOption?.sublabel || helperText}
              </div>
            )}
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

      {/* Dropdown Menu Options Popover - Solid Opaque High-Contrast Traveler Control Deck */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 min-w-full sm:min-w-[290px] top-full mt-2 z-[150] rounded-2xl bg-slate-950 border-2 border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2.5 max-h-72 overflow-y-auto ${dropdownClassName} animate-in fade-in zoom-in-95`}
        >
          <div className="px-2 py-1.5 border-b border-slate-800 text-[10px] uppercase tracking-wider font-mono text-slate-300 font-bold mb-1.5 flex items-center justify-between">
            <span className="text-amber-400 font-semibold">Select {label || 'Option'}</span>
            <span className="text-[9px] text-slate-400 font-mono font-medium">2026 Guaranteed</span>
          </div>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={String(option.value)}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer mb-1 border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md scale-[1.01]'
                    : 'hover:bg-slate-850 hover:text-white text-slate-200 bg-slate-900/50 border-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {option.icon && (
                    <span className="text-sm flex-shrink-0">
                      {typeof option.icon === 'string' ? (
                        option.icon
                      ) : (
                        <option.icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                      )}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className={`truncate font-semibold ${isSelected ? 'text-slate-950 font-bold' : 'text-slate-100'}`}>
                      {option.label}
                    </div>
                    {option.sublabel && (
                      <div className={`text-[10px] truncate ${isSelected ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                        {option.sublabel}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  {option.badge && (
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${
                      isSelected
                        ? 'bg-slate-900 text-amber-300 border-slate-800 font-bold'
                        : 'text-amber-300 bg-slate-900 px-1.5 py-0.5 border-slate-800'
                    }`}>
                      {option.badge}
                    </span>
                  )}
                  {isSelected && <Check className="w-4 h-4 text-slate-950 flex-shrink-0 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
