
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import Leaderboard from './components/Leaderboard';
import SeriesInfo from './components/SeriesInfo';
import { fetchDrivers, fetchRaceRounds } from './services/dataService';
import { Driver, RaceRound } from './types';
import { SERIES_LIST, SERIES_RULES } from './constants';

const App: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [raceRounds, setRaceRounds] = useState<RaceRound[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRound, setSelectedRound] = useState('');
  const [selectedSeries, setSelectedSeries] = useState(SERIES_LIST[0].id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeriesData = async () => {
      setLoading(true);
      try {
        const roundsData = await fetchRaceRounds(selectedSeries);
        setRaceRounds(roundsData);
        
        // Reset selected round when series changes or rounds data is loaded
        if (roundsData.length > 0) {
          setSelectedRound(String(roundsData[0].id));
        } else {
          setSelectedRound('');
          setDrivers([]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load series data', error);
        setLoading(false);
      }
    };
    loadSeriesData();
  }, [selectedSeries]);

  useEffect(() => {
    if (!selectedRound) return;

    const loadDriversData = async () => {
      setLoading(true);
      try {
        const driversData = await fetchDrivers(selectedSeries, selectedRound);
        setDrivers(driversData);
      } catch (error) {
        console.error('Failed to load drivers', error);
      } finally {
        setLoading(false);
      }
    };

    loadDriversData();
  }, [selectedRound, selectedSeries]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => 
      d.name.toLowerCase().includes(search.toLowerCase()) || 
      d.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, drivers]);

  const currentSeriesRules = SERIES_RULES[selectedSeries];

  return (
    <div className="min-h-screen flex flex-col items-center">
      <main className="w-full flex flex-col items-center">
        <Header title={currentSeriesRules?.title} seriesId={selectedSeries} />
        <FilterBar 
          search={search} 
          setSearch={setSearch} 
          selectedRound={selectedRound} 
          setSelectedRound={setSelectedRound} 
          rounds={raceRounds}
          selectedSeries={selectedSeries}
          setSelectedSeries={setSelectedSeries}
          seriesList={SERIES_LIST}
        />
        <Leaderboard drivers={filteredDrivers} seriesId={selectedSeries} isLoading={loading} />
        {currentSeriesRules && <SeriesInfo rules={currentSeriesRules} />}
      </main>
      
      {/* Footer */}
      <footer className="w-full flex justify-center border-t border-[#e6e1db] dark:border-[#2d261f] py-8 mt-auto">
        <div className="w-full max-w-[1200px] px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-[#8a7960] uppercase tracking-widest">
          <div className="flex items-center gap-2 group cursor-default">
            <span className="material-symbols-outlined text-primary text-base group-hover:animate-spin">speed</span>
            <span>株洲速度节 • 官方赛事门户</span>
          </div>
          <div className="flex gap-8">
            <a className="hover:text-primary transition-colors" href="#">安全协议</a>
            <a className="hover:text-primary transition-colors" href="#">条款与条件</a>
            <p>© 2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
