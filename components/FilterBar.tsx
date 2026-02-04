import React, { useState, useRef, useEffect } from 'react';
import { RaceRound, Series } from '../types';

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedRound: string;
  setSelectedRound: (val: string) => void;
  rounds: RaceRound[];
  selectedSeries: string;
  setSelectedSeries: (val: string) => void;
  seriesList: Series[];
}

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  icon: string;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, icon, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className={`w-full bg-[#000000]/40 border ${isOpen ? 'border-primary/50 ring-2 ring-primary/20' : 'border-white/5'} rounded-xl pl-12 pr-10 py-4 text-white transition-all cursor-pointer hover:bg-[#000000]/60 flex items-center justify-between group`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`material-symbols-outlined absolute left-4 text-white/40 group-hover:text-primary transition-colors ${isOpen ? 'text-primary' : ''}`}>{icon}</span>
        <span className="font-bold truncate select-none">{selectedOption?.label || placeholder}</span>
        <span className={`material-symbols-outlined absolute right-4 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>expand_more</span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1612] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                  option.value === value 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <span className="material-symbols-outlined text-sm">check</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterBar: React.FC<FilterBarProps> = ({ 
  search, 
  setSearch, 
  selectedRound, 
  setSelectedRound, 
  rounds,
  selectedSeries,
  setSelectedSeries,
  seriesList
}) => {
  // Map series to options
  const seriesOptions = seriesList.map(s => ({ value: s.id, label: s.name }));
  // Map rounds to options
  const roundOptions = rounds.map(r => ({ value: String(r.id), label: r.name }));

  return (
    <div className="w-full max-w-[1200px] px-6 -mt-32 relative z-30 mb-8">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-4 backdrop-blur-2xl p-3 rounded-2xl border border-[#ffffff]/10 shadow-2xl">
        {/* Series Selector */}
        <div className="w-full md:w-56">
          <CustomSelect 
            options={seriesOptions}
            value={selectedSeries}
            onChange={setSelectedSeries}
            icon="trophy"
          />
        </div>

        <div className="relative flex-1 w-full group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full bg-[#000000]/40 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none hover:bg-[#000000]/60" 
            placeholder="搜索车手、车队 or ID..." 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {/* Round Selector */}
        <div className="w-full md:w-64">
          <CustomSelect 
            options={roundOptions}
            value={selectedRound}
            onChange={setSelectedRound}
            icon="calendar_month"
          />
        </div>

        <button className="w-full md:w-auto px-8 py-4 bg-primary text-[#181511] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all transform hover:scale-[1.05] active:scale-95 shadow-lg flex items-center justify-center gap-2">
          <span>筛选</span>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
