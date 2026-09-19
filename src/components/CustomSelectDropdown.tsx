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
    <div ref={containerRef} className={`relative ${className}`}>
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
            ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/20 shadow-lg shadow-black/40'
            : 'bg-slate-950/80 hover:bg-slate-800/90 border-slate-700/80 hover:border-amber-500/40'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {selectedOption?.icon && (
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors text-xs font-bold">
              {typeof selectedOption.icon === 'string' ? (
                <span>{selectedOption.icon}</span>
              ) : (
                <selectedOption.icon className="w-3.5 h-3.5" />
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate group-hover:text-amber-300 flex items-center gap-1.5">
              <span>{selectedOption?.label}</span>
              {selectedOption?.badge && (
                <span className="font-mono text-[9px] text-amber-300 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                  {selectedOption.badge}
                </span>
              )}
            </div>
            {(helperText || selectedOption?.sublabel) && (
              <div className="text-[10px] text-slate-400 truncate">
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

      {/* Dropdown Menu Options Popover - Traveler Control Deck Popover Colors */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 min-w-full sm:min-w-[280px] top-full mt-2 z-[100] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 max-h-72 overflow-y-auto ${dropdownClassName} animate-in fade-in zoom-in-95`}
        >
          <div className="px-2 py-1.5 border-b border-slate-800 text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold mb-1 flex items-center justify-between">
            <span>Select {label || 'Option'}</span>
            <span className="text-[9px] text-slate-500 font-mono font-normal">Traveler Deck</span>
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
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold shadow-sm'
                    : 'hover:bg-slate-800 text-slate-300 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {option.icon && (
                    <span className="text-sm flex-shrink-0">
                      {typeof option.icon === 'string' ? (
                        option.icon
                      ) : (
                        <option.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                      )}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-slate-100">{option.label}</div>
                    {option.sublabel && (
                      <div className="text-[10px] text-slate-400 truncate">
                        {option.sublabel}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  {option.badge && (
                    <span className="font-mono text-[9px] text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                      {option.badge}
                    </span>
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
